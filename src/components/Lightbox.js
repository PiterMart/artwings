"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Lightbox.module.css";

export default function Lightbox({ isOpen, imageSrc, imageAlt, onClose }) {
  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <Image
          src={imageSrc}
          alt={imageAlt}
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
  );
}
