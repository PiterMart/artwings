"use client"
import Image from "next/image";
import styles from "../styles/page.module.css";
import React, { useEffect, useState, useRef } from "react";
import Lightbox from "../components/Lightbox";
import Link from "next/link";

export default function Home() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' });
  const [draggedImage, setDraggedImage] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [imagePositions, setImagePositions] = useState({});
  const [visibleSubtitles, setVisibleSubtitles] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(new Set());
  const bannerRef = useRef(null);
  const leftMarginRef = useRef(null);
  const rightMarginRef = useRef(null);
  const pageRef = useRef(null);

  const openLightbox = (imageSrc, imageAlt) => {
    setLightboxImage({ src: imageSrc, alt: imageAlt });
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
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

  // Sync margin top with banner height
  useEffect(() => {
    const updateMarginPosition = () => {
      if (bannerRef.current && leftMarginRef.current && rightMarginRef.current && pageRef.current) {
        const bannerHeight = bannerRef.current.offsetHeight;
        
        // Position margins at banner height
        leftMarginRef.current.style.top = `${bannerHeight}px`;
        rightMarginRef.current.style.top = `${bannerHeight}px`;
      }
    };

    // Update on mount with a small delay to ensure DOM is ready
    setTimeout(updateMarginPosition, 100);
    updateMarginPosition();

    // Update on window resize
    window.addEventListener('resize', updateMarginPosition);
    window.addEventListener('scroll', updateMarginPosition);

    // Update when images load
    const bannerImages = bannerRef.current?.querySelectorAll('img');
    bannerImages?.forEach(img => {
      if (img.complete) {
        updateMarginPosition();
      } else {
        img.addEventListener('load', updateMarginPosition);
      }
    });

    return () => {
      window.removeEventListener('resize', updateMarginPosition);
      window.removeEventListener('scroll', updateMarginPosition);
    };
  }, []);

  // Parallax effect for bioMargin element
  useEffect(() => {
    const handleParallaxScroll = () => {
      if (rightMarginRef.current && bannerRef.current) {
        const scrollY = window.scrollY || window.pageYOffset;
        // Parallax speed factor - lower values create slower scrolling effect
        // 0.5 means it scrolls at half the speed of normal content, creating depth
        const parallaxSpeed = 0.5;
        const parallaxOffset = scrollY * parallaxSpeed;
        
        // Apply transform to create parallax effect while preserving scaleX(-1) from CSS
        rightMarginRef.current.style.transform = `translateY(${parallaxOffset}px) scaleX(-1)`;
      }
    };

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleParallaxScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    // Initial call with a small delay to ensure DOM is ready
    setTimeout(handleParallaxScroll, 100);
    handleParallaxScroll();

    return () => {
      window.removeEventListener('scroll', optimizedScroll);
    };
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      
      {/* Bio margin image */}
      <div ref={rightMarginRef} className={styles.bioMargin}>
        <Image
          src="/tendrils-ornament.png"
          alt="Right margin decoration"
          width={200}
          height={800}
          className={styles.marginImage}
        />
      </div>

      {/* Hero Banner Section */}
      <div ref={bannerRef} className={styles.heroBanner} style={{ position: 'relative' }}>
        <Image
          src="/banner/banner-desktop-final.jpg"
          alt="ARTWINGS Hero Banner"
          width={1920}
          height={1080}
          className={styles.heroBannerDesktop}
          priority
          sizes="100vw"
        />
        <Image
          src="/banner/banner-mobile-final.jpg"
          alt="ARTWINGS Hero Banner"
          width={1080}
          height={1920}
          className={styles.heroBannerMobile}
          priority
          sizes="100vw"
        />
        <Link 
          href="/exhibitions/transgenesis"
          style={{
            position: 'absolute',
            top: '65%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            textDecoration: 'none'
          }}
        >
          <span 
            className={styles.transgenesisArrowRight}
            style={{
              fontSize: '1.5rem',
              color: '#a8a8a8',
              display: 'block'
            }}
          >
            →
          </span>
          <button
            style={{
              padding: '0.875rem 1.75rem',
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#a8a8a8',
              border: '1px solid #a8a8a8',
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'var(--font-megatrans-regular)',
              fontWeight: '300',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.5)';
              e.target.style.borderColor = '#a8a8a8';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.3)';
              e.target.style.borderColor = '#a8a8a8';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span className={styles.transgenesisButtonText}>
              TRANSGENESIS
            </span>
          </button>
          <span 
            className={styles.transgenesisArrowLeft}
            style={{
              fontSize: '1.5rem',
              color: '#a8a8a8',
              display: 'block'
            }}
          >
            ←
          </span>
        </Link>
      </div>
      <div className={styles.page_container}>
          <div className={styles.homepage_container} style={{paddingTop: '0rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', margin: "auto", maxWidth: '666px', marginTop: '5rem'}}>
            <div style={{ position: 'relative' }}>
                <p className={styles.exhibitionTitle} style={{ marginTop: '0rem', marginBottom: '1rem', lineHeight: '3rem', zIndex: "-1", position: "relative"}}><span style={{fontWeight: "200"}}>The</span> artwings <span style={{fontWeight: "400", letterSpacing: "0.2em", fontStyle: "italic"}}>Collection</span></p>
                <p 
                  className={`${styles.sectionSubtitle} ${visibleSubtitles.has('subtitle4') ? styles.sectionSubtitleVisible : ''}`}
                  data-subtitle-id="subtitle4"
                  style={{marginBottom: '1rem', textAlign: "right", fontStyle: "italic", fontWeight: "100"}}
                >
                  See our curated selection of artworks from the diverse community of artists we champion.
                </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', position: 'relative', zIndex: 2 }}>
                    <Link href="/artworks" style={{ textDecoration: 'none' }}>
                      <button 
                        style={{
                          padding: '0.875rem 1.75rem',
                          background: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          color: '#a8a8a8',
                          border: '1px solid #a8a8a8',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontFamily: 'var(--font-helvetica-regular), Arial, Helvetica, sans-serif',
                          fontWeight: '300',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                          e.target.style.borderColor = '#a8a8a8';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                          e.target.style.borderColor = '#a8a8a8';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        See Collection
                      </button>
                    </Link>
                  </div>
                  <div className={styles.bioUnderline}>
                  <Image
                    src="/tendrils-underline.png"
                    alt="Collection title underline"
                    width={666}
                    height={50}
                    className={styles.bioUnderlineImage}
                  />
                </div>
              </div>
              </div>
            </div>
          </div>

      
      {/* Image Gallery */}
      <div className={styles.parallaxGallery}>
        <div 
          className={`${styles.parallaxImage} ${visibleImages.has('gallery1') ? styles.imageVisible : ''}`}
          data-image-id="gallery1"
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
          className={`${styles.parallaxImage} ${visibleImages.has('gallery2') ? styles.imageVisible : ''}`}
          data-image-id="gallery2"
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
          className={`${styles.parallaxImage} ${visibleImages.has('gallery3') ? styles.imageVisible : ''}`}
          data-image-id="gallery3"
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
          className={`${styles.parallaxImage} ${visibleImages.has('gallery4') ? styles.imageVisible : ''}`}
          data-image-id="gallery4"
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
          className={`${styles.parallaxImage} ${visibleImages.has('gallery5') ? styles.imageVisible : ''}`}
          data-image-id="gallery5"
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
    
      </div>
      
      {/* Spacer for layout */}
      {/* <div className={styles.parallaxSpacer}></div> */}
      
      <main className={styles.main}>
      </main>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={isLightboxOpen}
        imageSrc={lightboxImage.src}
        imageAlt={lightboxImage.alt}
        onClose={closeLightbox}
      />
    </div>
  );
}
