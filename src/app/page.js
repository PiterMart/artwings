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
          <p className={styles.taglineText}>Berlin-based artspace redefining the boundaries of artistic expression. We offer a platform for emerging artists, diverse identities, alternative voices and seekers from all over the world to bring raw, intimate narratives into the spotlight, bridging the underground scene with the contemporary art world and market.</p>
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
            src="/pictures/@Artwings111 photo by @Xowkyu (1).jpg"
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
            src="/pictures/@Artwings111 photo by @Xowkyu (5).jpg"
            alt="Artwings photo by Xowkyu"
            width={400}
            height={600}
            className={styles.galleryImage}
          />
        </motion.div>
      </div>
      
      {/* Spacer for parallax effect */}
      <div className={styles.parallaxSpacer}></div>
      
      <main className={styles.main}>
      </main>
    </div>
  );
}