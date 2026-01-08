"use client";
import styles from "../../styles/page.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function About() {
  const [visibleSubtitles, setVisibleSubtitles] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(new Set());

  // Intersection Observer for subtitle and image animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const subtitleId = entry.target.getAttribute('data-subtitle-id');
          const imageId = entry.target.getAttribute('data-image-id');
          
          if (subtitleId) {
            setVisibleSubtitles(prev => new Set([...prev, subtitleId]));
          }
          
          if (imageId) {
            setVisibleImages(prev => new Set([...prev, imageId]));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with data-subtitle-id or data-image-id attributes
    const subtitleElements = document.querySelectorAll('[data-subtitle-id]');
    const imageElements = document.querySelectorAll('[data-image-id]');
    
    subtitleElements.forEach(el => observer.observe(el));
    imageElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.page_container}>
          <div className={styles.homepage_container} style={{paddingTop: '0rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', margin: "auto", maxWidth: '666px', marginTop: '5rem'}}>
            
              <div id="about">
                <br></br>
                
                <p 
                  className={`${styles.sectionSubtitle} ${visibleSubtitles.has('subtitle1') ? styles.sectionSubtitleVisible : ''}`}
                  data-subtitle-id="subtitle1"
                  style={{marginTop: '5rem', fontSize: '3rem', lineHeight: '3rem'}}
                >
                  ARTWINGS is a Berlin-based artspace redefining the boundaries of artistic expression.
                </p>
                <br></br>
                <br></br>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  We offer a platform for emerging artists, diverse identities, alternative voices and seekers from all over the world to bring raw, intimate narratives into the spotlight, bridging the underground scene with the contemporary art world and market.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  We regard artists as transcendent vessels, in tune with their Higher Selves and their ability to translate that connection into tangible forms through the medium of art. Voices that pulse from the depths of memory, identity, loss, mythology, grief and fantasy. Their work becomes visceral imagery, immersive environments, symbolic rituals, and sonic atmospheres.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  ARTWINGS is more than a gallery; it is a living space where bold ideas, creative freedom, and new visions take shape. A shared field of transformation, healing, and radical presence. A place where art and social change grow through connection, shared voices, and meaningful exchange.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  Our mission is to provide a platform that bridges artistry with meaningful opportunities and authentic connections. By aligning artistic practice with the core values of ARTWINGS, we strive to foster growth, depth, and resonance. We aim to curate immersive, collective experiences in which art is encountered in its full emotional and conceptual richness, leaving a lasting, transformative imprint on both artists and audiences.
                </p>
                
                {/* Photo after About Us section */}
                <div 
                  style={{marginTop: '2.5rem', marginBottom: '5rem', textAlign: 'center'}}
                  data-image-id="img1"
                  className={`${styles.imageContainer} ${visibleImages.has('img1') ? styles.imageVisible : ''}`}
                >
                  <Image
                    src="/pictures/DSC00346.jpg"
                    alt="Artwings Collection"
                    width={600}
                    height={400}
                    style={{maxWidth: '100%', height: 'auto'}}
                  />
                </div>
                
                <p 
                  className={`${styles.sectionSubtitle} ${visibleSubtitles.has('subtitle2') ? styles.sectionSubtitleVisible : ''}`}
                  data-subtitle-id="subtitle2"
                  style={{marginTop: '5rem', fontSize: '2rem', lineHeight: '2rem'}}
                >
                  ARTWINGS embodies a strong social mission and is proudly supported by YUVEDO, a foundation dedicated to assisting individuals affected by neurodegenerative diseases.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  YUVEDO&apos;s multifaceted initiative harnesses the power of art and culture to promote brain health, empower patients to actively improve their care, and encourage participation in medical research by contributing personal data and experiences to advance the search for better treatments.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  Their guiding philosophy, &ldquo;Art as Therapy; Culture ignites the brain. Let&apos;s use it to heal the world,&rdquo; speaks to the profound potential of creativity as a healing force.
                </p>
                
                <p style={{lineHeight: '1.5rem'}}>
                  Rooted in this vision, ARTWINGS was conceived as a platform for the creation and sharing of purposeful art, where artistic expression becomes a catalyst for social impact and collective healing.
                </p>
                <br></br>
                {/* Photo after Purpose section */}
                <div 
                  style={{marginTop: '2.5rem', marginBottom: '2rem', textAlign: 'center'}}
                  data-image-id="img2"
                  className={`${styles.imageContainer} ${visibleImages.has('img2') ? styles.imageVisible : ''}`}
                >
                  <Image
                    src="/pictures/DSC00348.jpg"
                    alt="Artwings Collection"
                    width={600}
                    height={400}
                    style={{maxWidth: '100%', height: 'auto'}}
                  />
                </div>
                
                <p 
                  className={`${styles.sectionSubtitle} ${visibleSubtitles.has('subtitle3') ? styles.sectionSubtitleVisible : ''}`}
                  data-subtitle-id="subtitle3"
                  style={{marginTop: '5rem', fontSize: '2rem', lineHeight: '2rem'}}
                >
                  We envision a space where the boundaries of artistic expression dissolve into a living archive of resistance, remembrance, and reimagination.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  A dynamic movement where artistic innovation and social impact converge.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  This creative ecosystem is rooted in vulnerability and boldness, a refusal to conform and a commitment to reclaiming the emotional, the strange, the ancestral, and the mystical. Whether through analog media, digital soundscapes, dreamlike painting, or ritual-based practices, participating artists turn introspection into shared experience and isolation into new forms of connection.
                </p>
                <br></br>
                <p style={{lineHeight: '1.5rem'}}>
                  We aim to foster meaningful dialogue among participating artists, researchers, and broader communities, bridging creative practice with science, care, and cultural agency. To join ARTWINGS is to become part of a larger social initiative, contributing to an inspiring, ever-evolving space for artistic innovation and collective transformation.
                </p>
                
                {/* Photo after Creative Vision section */}
                <div 
                  style={{marginTop: '2.5rem', marginBottom: '2rem', textAlign: 'center'}}
                  data-image-id="img3"
                  className={`${styles.imageContainer} ${visibleImages.has('img3') ? styles.imageVisible : ''}`}
                >
                  <Image
                    src="/pictures/DSC00349.jpg"
                    alt="Artwings Collection"
                    width={600}
                    height={400}
                    style={{maxWidth: '100%', height: 'auto'}}
                  />
                </div>
              </div>

              {/* The Venue Section */}
              <div style={{marginTop: '4rem', maxWidth: '800px', margin: 'auto'}}>
                <h2 style={{fontSize: '2rem', fontWeight: '400', marginBottom: '2rem'}}>The Venue</h2>
                <p style={{fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify'}}>
                  The physical space was selected to reflect the essence of ARTWINGS. Direktorenhaus Berlin is both a gallery and cultural center located in the Mitte district. Founded in 2010 by Pascal Johanssen and Katja Kleiss, the venue is situated within the historic complex of the Alte Münze, the former state mint of Berlin.
                </p>
                <p style={{fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify', marginTop: '1.5rem'}}>
                  With two floors, high ceilings, and multiple exhibition rooms, Direktorenhaus provides the architectural and energetic frame for our project. We will host meetings on-site for participating artists to explore the space, meet each other, and engage in the logistics and vision of the exhibition. Our goal is to transform it into a cohesive, inclusive artistic environment aligned with the mission of ARTWINGS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
