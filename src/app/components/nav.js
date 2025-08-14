'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '../styles/nav.module.css';

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const currentPath = usePathname();

    const pages = [
        { name: 'Artists', path: '/artists' },
        { name: 'Exhibitions', path: '/exhibitions' },
        { name: 'News', path: '/news' },
        // { name: 'Headquarters', path: '/headquarters' },
        // { name: 'Fairs', path: '/fairs' },
        // { name: 'RESIDENCIES', path: '/tra' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const isCurrent = (path) => {
        return currentPath === path;
    };


    return (
        <div className={`${styles.nav} ${isVisible ? styles.nav_visible : styles.nav_hidden}`}>
            <Link href="/">
                <Image
                    src="/artwingslogo.png"
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
                    {pages.map((page, index) => (
                        <li key={index}>
                            <Link
                                href={page.path}
                                className={isCurrent(page.path) ? styles.page_current : ''}
                                onClick={() => setIsMenuOpen(false)} // Close menu on click
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
