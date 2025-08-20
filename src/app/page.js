"use client"
import Image from "next/image";
import styles from "./styles/page.module.css";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { scrollY } = useScroll();
  
  // Create parallax transforms for each image
  const y1 = useTransform(scrollY, [0, 1500], [0, -300]);
  const y2 = useTransform(scrollY, [0, 1500], [0, 400]);
  const y3 = useTransform(scrollY, [0, 1500], [0, -250]);
  const y4 = useTransform(scrollY, [0, 1500], [0, 350]);

  return (
    <div className={styles.page}>
      {/* Left margin image */}
      <div className={styles.leftMargin}>
        <Image
          src="/maiden 11.png"
          alt="Left margin decoration"
          width={200}
          height={800}
          className={styles.marginImage}
        />
      </div>
      
      {/* Right margin image */}
      <div className={styles.rightMargin}>
        <Image
          src="/maiden 11.png"
          alt="Right margin decoration"
          width={200}
          height={800}
          className={styles.marginImage}
        />
      </div>
      
      {/* Centered Logo */}
      <div className={styles.logoContainer}>
        <Image
          src="/new_1logo_transparent.png"
          alt="ARTWINGS Logo"
          width={400}
          height={200}
          className={styles.logo}
          priority
        />
        <div className={styles.tagline}>
          {/* <p className={styles.taglineText}>Berlin-based artspace redefining the boundaries of artistic expression. We offer a platform for emerging artists, diverse identities, alternative voices and seekers from all over the world to bring raw, intimate narratives into the spotlight, bridging the underground scene with the contemporary art world and market.</p> */}
          <p className={styles.taglineSubtext}>Resistance, remembrance, and reimagination. </p>
        </div>
      </div>
      {/* Exhibition Flyer Section */}
      <div className={styles.exhibitionSection}>
      <h2 className={styles.address}>Exhibition</h2>
      <h2 className={styles.exhibitionTitle}>METAXY</h2>
        <div className={styles.flyerContainer}>
          <Image
            src="/flyer placeholder.jpg"
            alt="Exhibition Flyer"
            width={600}
            height={800}
            className={styles.flyerImage}
            priority
          />
        </div>
        {/* <div className={styles.exhibitionInfo}>
          <p className={styles.exhibitionDate}>04/09/25</p>
          <div className={styles.addressInfo}>
            <p className={styles.address}>Direktorenhaus</p>
            <p className={styles.address}>Am Krögel 2, 10179 Berlin</p>
          </div>
        </div> */}
      </div>
      <div className={styles.page_container}>
          <div className={styles.artists_page}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', margin: "auto", maxWidth: '800px', marginTop: '5rem'}}>

            <p className={styles.exhibitionTitle} style={{fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem',}}>
                About Us
              </p>
            
              <p style={{lineHeight: '1.5rem', textAlign: 'justify', marginTop: '1rem'}}>
                ARTWINGS is a Berlin-based artspace redefining the boundaries of artistic expression. We offer a platform for emerging artists, diverse identities, alternative voices and seekers from all over the world to bring raw, intimate narratives into the spotlight, bridging the underground scene with the contemporary art world and market.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                We regard artists as transcendent vessels, in tune with their Higher Selves and their ability to translate that connection into tangible forms through the medium of art. Voices that pulse from the depths of memory, identity, loss, mythology, grief and fantasy. Their work becomes visceral imagery, immersive environments, symbolic rituals, and sonic atmospheres.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                ARTWINGS is more than a gallery; it is a living space where bold ideas, creative freedom, and new visions take shape. A shared field of transformation, healing, and radical presence. A place where art and social change grow through connection, shared voices, and meaningful exchange.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                Our mission is to provide a platform that bridges artistry with meaningful opportunities and authentic connections. By aligning artistic practice with the core values of ARTWINGS, we strive to foster growth, depth, and resonance. We aim to curate immersive, collective experiences in which art is encountered in its full emotional and conceptual richness, leaving a lasting, transformative imprint on both artists and audiences.
              </p>
              
              <p className={styles.exhibitionTitle} style={{fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem', }}>
                Purpose
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                ARTWINGS embodies a strong social mission and is proudly supported by YUVEDO, a foundation dedicated to assisting individuals affected by neurodegenerative diseases. YUVEDO&apos;s multifaceted initiative harnesses the power of art and culture to promote brain health, empower patients to actively improve their care, and encourage participation in medical research by contributing personal data and experiences to advance the search for better treatments.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                Their guiding philosophy, &ldquo;Art as Therapy; Culture ignites the brain. Let&apos;s use it to heal the world,&rdquo; speaks to the profound potential of creativity as a healing force.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                Rooted in this vision, ARTWINGS was conceived as a platform for the creation and sharing of purposeful art, where artistic expression becomes a catalyst for social impact and collective healing.
              </p>
              
              <p className={styles.exhibitionTitle} style={{fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem', lineHeight: '2.5rem'}}>
                Creative Vision
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                We envision a space where the boundaries of artistic expression dissolve into a living archive of resistance, remembrance, and reimagination. A dynamic movement where artistic innovation and social impact converge.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                This creative ecosystem is rooted in vulnerability and boldness, a refusal to conform and a commitment to reclaiming the emotional, the strange, the ancestral, and the mystical. Whether through analog media, digital soundscapes, dreamlike painting, or ritual-based practices, participating artists turn introspection into shared experience and isolation into new forms of connection.
              </p>
              
              <p style={{lineHeight: '1.5rem', textAlign: 'justify'}}>
                We aim to foster meaningful dialogue among participating artists, researchers, and broader communities, bridging creative practice with science, care, and cultural agency. To join ARTWINGS is to become part of a larger social initiative, contributing to an inspiring, ever-evolving space for artistic innovation and collective transformation.
              </p>

              <div style={{marginTop: '4rem', maxWidth: '800px', margin: 'auto'}}>
              <p className={styles.exhibitionTitle} style={{fontSize: '2rem', fontWeight: '400', marginBottom: '2rem'}}>The Venue - Direktorenhaus</p>
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

      
      {/* Parallax Image Gallery */}
      <div className={styles.parallaxGallery}>
        <motion.div 
          className={styles.parallaxImage}
          style={{ y: y1 }}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (28).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
          />
        </motion.div>
        
        <motion.div 
          className={styles.parallaxImage}
          style={{ y: y2 }}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (38).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
          />
        </motion.div>
        
        <motion.div 
          className={styles.parallaxImage}
          style={{ y: y3 }}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (9).jpg"
            alt="Artwings photo by Xowkyu"
            width={400}
            height={600}
            className={styles.galleryImage}
          />
        </motion.div>
        
        <motion.div 
          className={styles.parallaxImage}
          style={{ y: y4 }}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (57)_1.jpg"
            alt="Artwings photo by Xowkyu"
            width={400}
            height={600}
            className={styles.galleryImage}
          />
        </motion.div>
      </div>
      
      {/* Spacer for parallax effect */}
      <div className={styles.parallaxSpacer}></div>

      <div style={{ padding: "10rem 1rem 1rem 1rem", margin: "auto", height: "100%" }}>
          
          <div className={styles.page_container} style={{ marginTop: "7rem", margin: 'auto' }}>
            <div className={styles.sedes} style={{ gap: '0rem'}}>
              <p className={styles.exhibitionTitle} style={{fontSize: '2rem', marginTop: '1rem', marginBottom: '1rem',  fontWeight: 'bold'}}>CONTACT US</p>
              <div className={styles.sedeCard} >
              <p><a href="mailto:info@artwings.art">info@artwings.art</a></p>
                    <p><a href="tel:+491721736434">+49 172 1736434</a></p>
                    <p><a href="https://www.instagram.com/artwings111/" target="_blank" rel="noopener noreferrer">@artwings111</a></p>
              </div>
                  <div  style={{display: 'flex', flexDirection: 'column', fontSize: '1rem'}}>
                  <p className={styles.exhibitionTitle} style={{fontSize: '1rem', marginTop: '2rem',  fontWeight: 'bold'}}>Direktorenhaus</p>
                    <p style={{fontFamily: 'var(--font-helvetica-light)'}}>Am Krögel 2, 10179 Berlin</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4856.025219182328!2d13.407547512739256!3d52.51511087194333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e26b464b7eb%3A0x23ba24dd44f369d4!2sDirektorenhaus!5e0!3m2!1ses-419!2sit!4v1755696365900!5m2!1ses-419!2sit" width="auto" height="250"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                </div>
            </div>
          </div>
        </div>
      
      <main className={styles.main}>
      </main>
    </div>
  );
}