import React from "react";
import styles from "../../../styles/page.module.css";
import Image from "next/image";

const PictureLayout = ({ slide, onImageClick }) => {
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(slide.image, slide.title || slide.alt || "Gallery image");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className={styles.artist_page_image_container}>
        <Image
          src={slide.image}
          alt={slide.title || slide.alt || "Gallery image"}
          style={{ width: "100%", cursor: "pointer" }} 
          onClick={handleImageClick} 
          width={0}
          height={0}
          sizes="100vw"
          placeholder="empty"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default PictureLayout;
