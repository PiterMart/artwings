"use client"
import Image from "next/image";
import styles from "./styles/page.module.css";
import React, { useEffect, useState, useRef } from "react";

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [draggedImage, setDraggedImage] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [imagePositions, setImagePositions] = useState({});

  const openLightbox = (imageSrc, imageAlt) => {
    setLightboxImage({ src: imageSrc, alt: imageAlt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Handle mouse/touch down events
  const handleDragStart = (e, imageId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    setDragStartPos({ x: clientX, y: clientY });
    setDraggedImage(imageId);
  };

  // Handle mouse/touch move events
  const handleDragMove = (e) => {
    if (!draggedImage) return;
    
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartPos.x;
    const deltaY = clientY - dragStartPos.y;
    
    setImagePositions(prev => ({
      ...prev,
      [draggedImage]: {
        x: (prev[draggedImage]?.x || 0) + deltaX,
        y: (prev[draggedImage]?.y || 0) + deltaY
      }
    }));
    
    // Update start position for next frame
    setDragStartPos({ x: clientX, y: clientY });
  };

  // Handle mouse/touch up events
  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  // Add global event listeners for drag
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleDragMove(e);
    const handleGlobalTouchMove = (e) => handleDragMove(e);
    const handleGlobalMouseUp = () => handleDragEnd();
    const handleGlobalTouchEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [draggedImage, dragStartPos]);

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
          src="/artwingslogo2.png"
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
          <video
            src="/metxyflyer.mp4"
            className={styles.flyerImage}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '600px', height: 'auto', objectFit: 'contain' }}
          >
            Your browser does not support the video tag.
          </video>
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
          <div className={styles.artists_page} style={{paddingTop: '0rem'}}>
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
              
              {/* Photo after About Us section */}
              <div style={{marginTop: '2rem', marginBottom: '2rem', textAlign: 'center'}}>
                <Image
                  src="/pictures/@Artwings111 photo by @Rubi__Azul (1)_1.jpg"
                  alt="Artwings photo by Rubi Azul"
                  width={600}
                  height={400}
                  style={{maxWidth: '100%', height: 'auto'}}
                />
              
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
              
              {/* Photo after Purpose section */}
              <div style={{marginTop: '2rem', marginBottom: '2rem', textAlign: 'center'}}>
                <Image
                  src="/pictures/@Artwings111 photo by @Rubi__Azul (44)_1.jpg"
                  alt="Artwings photo by Rubi Azul"
                  width={600}
                  height={400}
                  style={{maxWidth: '100%', height: 'auto'}}
                />
              </div>
              
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
              
              {/* Photo after Creative Vision section */}
              <div style={{marginTop: '2rem', marginBottom: '2rem', textAlign: 'center'}}>
                <Image
                  src="/pictures/@Artwings111 photo by @Rubi__Azul (51)_1.jpg"
                  alt="Artwings photo by Rubi Azul"
                  width={600}
                  height={400}
                  style={{maxWidth: '100%', height: 'auto'}}
                />
              </div>
              </div>
            </div>
          </div>
        </div>

      
      {/* Image Gallery */}
      <div className={styles.parallaxGallery}>
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image1'] 
              ? `translate(${imagePositions['image1'].x}px, ${imagePositions['image1'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image1' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image1')}
          onTouchStart={(e) => handleDragStart(e, 'image1')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (28).jpg", "Artwings photo by Rubi Azul")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (28).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
        
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image2'] 
              ? `translate(${imagePositions['image2'].x}px, ${imagePositions['image2'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image2' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image2')}
          onTouchStart={(e) => handleDragStart(e, 'image2')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (38).jpg", "Artwings photo by Rubi Azul")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (38).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
        
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image3'] 
              ? `translate(${imagePositions['image3'].x}px, ${imagePositions['image3'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image3' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image3')}
          onTouchStart={(e) => handleDragStart(e, 'image3')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (9).jpg", "Artwings photo by Xowkyu")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (9).jpg"
            alt="Artwings photo by Xowkyu"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
        
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image4'] 
              ? `translate(${imagePositions['image4'].x}px, ${imagePositions['image4'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image4' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image4')}
          onTouchStart={(e) => handleDragStart(e, 'image4')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (57)_1.jpg", "Artwings photo by Xowkyu")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (57)_1.jpg"
            alt="Artwings photo by Xowkyu"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
        
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image5'] 
              ? `translate(${imagePositions['image5'].x}px, ${imagePositions['image5'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image5' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image5')}
          onTouchStart={(e) => handleDragStart(e, 'image5')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (13).jpg", "Artwings photo by Rubi Azul")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (13).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
        
        <div 
          className={styles.parallaxImage}
          style={{
            transform: imagePositions['image6'] 
              ? `translate(${imagePositions['image6'].x}px, ${imagePositions['image6'].y}px)` 
              : 'none',
            cursor: draggedImage === 'image6' ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleDragStart(e, 'image6')}
          onTouchStart={(e) => handleDragStart(e, 'image6')}
          onClick={() => openLightbox("/pictures/@Artwings111 photo by @Rubi__Azul (38).jpg", "Artwings photo by Rubi Azul")}
        >
          <Image
            src="/pictures/@Artwings111 photo by @Rubi__Azul (38).jpg"
            alt="Artwings photo by Rubi Azul"
            width={400}
            height={600}
            className={styles.galleryImage}
            draggable={false}
          />
        </div>
      </div>
      
      {/* Spacer for layout */}
      <div className={styles.parallaxSpacer}></div>

      <div style={{ padding: "10rem 1rem 1rem 1rem", margin: "auto", height: "100%", width: "100%", maxWidth: "800px" }}>
          
          <div className={styles.page_container} style={{ marginTop: "7rem", margin: 'auto' }}>
            <div className={styles.sedes} style={{ gap: '0rem'}}>
              <p className={styles.exhibitionTitle} style={{fontSize: '2rem', marginTop: '1rem', marginBottom: '1rem',  fontWeight: 'bold'}}>
                CONTACT US
              </p>
              <div className={styles.sedeCard} >
              <p><a href="mailto:info@artwings.art">info@artwings.art</a></p>
                    <p><a href="tel:+491721736434">+49 172 1736434</a></p>
                    <p><a href="https://www.instagram.com/artwings111/" target="_blank" rel="noopener noreferrer">@artwings111</a></p>
              </div>
              <div  style={{display: 'flex', flexDirection: 'column', fontSize: '1rem', marginTop: '4rem'}}>
                <div style={{marginTop: '4rem', maxWidth: '800px', margin: 'auto'}}>
                  <p className={styles.exhibitionTitle} style={{fontSize: '2rem', fontWeight: '400', marginBottom: '2rem', marginTop: '0rem'}}>The Venue</p>
                  <p style={{fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify'}}>
                    The physical space was selected to reflect the essence of ARTWINGS. Direktorenhaus Berlin is both a gallery and cultural center located in the Mitte district. Founded in 2010 by Pascal Johanssen and Katja Kleiss, the venue is situated within the historic complex of the Alte Münze, the former state mint of Berlin.
                  </p>
                  <p style={{fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'justify', marginTop: '1.5rem'}}>
                    With two floors, high ceilings, and multiple exhibition rooms, Direktorenhaus provides the architectural and energetic frame for our project. We will host meetings on-site for participating artists to explore the space, meet each other, and engage in the logistics and vision of the exhibition. Our goal is to transform it into a cohesive, inclusive artistic environment aligned with the mission of ARTWINGS.
                </p>
                </div>
                    <p style={{fontFamily: 'var(--font-helvetica-light)'}}>Am Krögel 2, 10179 Berlin</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4856.025219182328!2d13.407547512739256!3d52.51511087194333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e26b464b7eb%3A0x23ba24dd44f369d4!2sDirektorenhaus!5e0!3m2!1ses-419!2sit!4v1755696365900!5m2!1ses-419!2sit" width="auto" height="250"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
      
      <main className={styles.main}>
      </main>

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              width={1200}
              height={800}
              className={styles.lightboxImage}
              priority
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}