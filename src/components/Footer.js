"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../app/firebase/firebaseConfig";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const currentPath = usePathname();
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState([]);
  const [isLoadingExhibitions, setIsLoadingExhibitions] = useState(true);

  const pages = [
    { name: 'Artworks', path: '/artworks' },
    { name: 'About', path: '/about' },
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
  };

  const handleNavigation = (page, e) => {
    if (page.section) {
      // This is a homepage section, prevent default link behavior and use smooth scroll
      e.preventDefault();
      scrollToSection(page.section);
    }
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMainGrid}>
          {/* Navigation Section */}
          <div className={styles.footerSection}>
            <p className={styles.footerSectionTitle}>Navigation</p>
            <div className={styles.exhibitionsList}>
              <p className={styles.exhibitionsTitle}>Exhibitions</p>
              {isLoadingExhibitions ? (
                <p className={styles.exhibitionsItem}>Loading…</p>
              ) : exhibitions.length === 0 ? (
                <p className={styles.exhibitionsItem}>No exhibitions available</p>
              ) : (
                exhibitions.map((exhibition) => (
                  <Link
                    key={exhibition.id}
                    href={`/exhibitions/${exhibition.slug ?? exhibition.id}`}
                    className={styles.exhibitionsItem}
                  >
                    {exhibition.name}
                  </Link>
                ))
              )}
            </div>
            <div className={styles.footerLinks}>
              {pages.map((page, index) => (
                <Link
                  key={index}
                  href={page.path}
                  onClick={(e) => handleNavigation(page, e)}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className={styles.footerSection}>
            <p className={styles.footerSectionTitle}>Contact</p>
            <div className={styles.contactInfo}>
              <p><a href="mailto:info@artwings.art">info@artwings.art</a></p>
              <p><a href="https://www.instagram.com/artwings111/" target="_blank" rel="noopener noreferrer">@artwings111</a></p>
            </div>
          </div>

          {/* Direction Section */}
          <div className={styles.footerSection}>
            <p className={styles.footerSectionTitle}>Direction</p>
            <div className={styles.directionContent}>
              <p className={styles.venueAddress}>Am Krögel 2, 10179 Berlin</p>
              <div className={styles.mapContainer}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4856.025219182328!2d13.407547512739256!3d52.51511087194333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e26b464b7eb%3A0x23ba24dd44f369d4!2sDirektorenhaus!5e0!3m2!1ses-419!2sit!4v1755696365900!5m2!1ses-419!2sit" 
                  width="100%" 
                  height="250"  
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className={styles.map}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy - Separate at bottom */}
        <div className={styles.footerCopyright}>
          <p className={styles.footerText}>
            © 2025 ARTWINGS. All rights reserved.{' '}
            <Link href="/privacy-policy" className={styles.footerLink}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
