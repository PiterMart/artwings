'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../styles/nav.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../app/firebase/firebaseConfig';

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [exhibitions, setExhibitions] = useState([]);
    const [isExhibitionsOpen, setIsExhibitionsOpen] = useState(false);
    const [isLoadingExhibitions, setIsLoadingExhibitions] = useState(true);
    const currentPath = usePathname();
    const router = useRouter();

    const pages = [
        { name: 'Artworks', path: '/artworks' },
        // { name: 'Artists', path: '/artists' },
        { name: 'About', path: '/', section: 'about' },
        { name: 'Contact', path: '/', section: 'contact' },
    ];

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const snapshot = await getDocs(collection(firestore, 'exhibitions'));
                const exhibitionsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const sorted = exhibitionsData.sort((a, b) => {
                    const aDate = a.openingDate && typeof a.openingDate.toDate === 'function'
                        ? a.openingDate.toDate()
                        : null;
                    const bDate = b.openingDate && typeof b.openingDate.toDate === 'function'
                        ? b.openingDate.toDate()
                        : null;

                    if (!aDate && !bDate) return 0;
                    if (!aDate) return 1;
                    if (!bDate) return -1;
                    return bDate - aDate;
                });

                setExhibitions(sorted);
            } catch (error) {
                console.error('Error fetching exhibitions:', error);
            } finally {
                setIsLoadingExhibitions(false);
            }
        };

        fetchExhibitions();
    }, []);

    const scrollToSection = (sectionId) => {
        // If we're not on the homepage, navigate there first
        if (currentPath !== '/') {
            router.push('/');
            // Wait for navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const offset = 100; // Offset in pixels from the top
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            // If we're already on the homepage, just scroll
            const element = document.getElementById(sectionId);
            if (element) {
                const offset = 100; // Offset in pixels from the top
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        setIsMenuOpen(false);
    };

    const handleNavigation = (page, e) => {
        if (page.section) {
            // This is a homepage section, prevent default link behavior and use smooth scroll
            e.preventDefault();
            scrollToSection(page.section);
        } else {
            // This is a regular page navigation, let the Link handle it
            setIsMenuOpen(false);
            setIsExhibitionsOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => {
            const next = !prev;
            if (!next) {
                setIsExhibitionsOpen(false);
            }
            return next;
        });
    };

    const isCurrent = (path) => {
        // Only apply current styling to the Artists button when on the artists page
        // Don't apply it to homepage section buttons (Exhibitions, About, Contact)
        return currentPath === path && path !== '/';
    };

    return (
        <div className={`${styles.nav} ${isVisible ? styles.nav_visible : styles.nav_hidden}`}>
            <Link href="/">
                <Image
                    src="/ARTWINGS BLACK.png"
                    alt="Artwings"
                    width={120}
                    height={48}
                    className={styles.nav_logo}
                    priority={true}
                    quality={100}
                    unoptimized={true}
                />
            </Link>
            <button className={`${styles.navButton} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>
            <div className={`${styles.nav_list} ${isMenuOpen ? styles.active : ''}`} id="navMenu">
                <ul>
                    <li className={styles.dropdown}>
                        <button
                            type="button"
                            className={`${styles.dropdownToggle} ${isExhibitionsOpen ? styles.dropdownToggle_open : ''}`}
                            onClick={() => setIsExhibitionsOpen((prev) => !prev)}
                        >
                            Exhibitions
                        </button>
                        <div className={`${styles.dropdownMenu} ${isExhibitionsOpen ? styles.dropdownMenu_open : ''}`}>
                            {isLoadingExhibitions ? (
                                <span className={styles.dropdownStatus}>Loading…</span>
                            ) : exhibitions.length === 0 ? (
                                <span className={styles.dropdownStatus}>No exhibitions available</span>
                            ) : (
                                exhibitions.map((exhibition) => (
                                    <Link
                                        key={exhibition.id}
                                        href={`/exhibitions/${exhibition.slug ?? exhibition.id}`}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsExhibitionsOpen(false);
                                        }}
                                    >
                                        {exhibition.name}
                                    </Link>
                                ))
                            )}
                        </div>
                    </li>
                    {pages.map((page, index) => (
                        <li key={index}>
                            <Link
                                href={page.path}
                                className={isCurrent(page.path) ? styles.page_current : ''}
                                onClick={(e) => handleNavigation(page, e)}
                            >
                                {page.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}