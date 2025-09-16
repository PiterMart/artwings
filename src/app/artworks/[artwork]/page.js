"use client";
import styles from "../../../styles/artwork.module.css";
// import pageStyles from "../../../styles/page.module.css";
import "../../../styles/page.module.css";
import { firestore } from "../../firebase/firebaseConfig";
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Lightbox from "../../../components/Lightbox";
import AcquireDialog from "../../../components/AcquireDialog";

export default function Artwork({ params }) {
  const [artwork, setArtwork] = useState(undefined); // Undefined for initial loading state
  const [artist, setArtist] = useState(null); // To store artist details
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' });
  const [isAcquireDialogOpen, setIsAcquireDialogOpen] = useState(false);
  const artworkSlug = params.artwork; // Get slug from params

  const openLightbox = (imageSrc, imageAlt) => {
    setLightboxImage({ src: imageSrc, alt: imageAlt });
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const openAcquireDialog = () => {
    setIsAcquireDialogOpen(true);
  };

  const closeAcquireDialog = () => {
    setIsAcquireDialogOpen(false);
  };

  useEffect(() => {
    const fetchArtworkAndArtist = async () => {
      try {
        console.log("Fetching artwork with slug:", artworkSlug);

        // Query the 'artworks' collection for the specific slug
        const q = query(collection(firestore, "artworks"), where("artworkSlug", "==", artworkSlug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // There should only be one document for the given slug
          const docSnap = querySnapshot.docs[0];
          const artworkData = docSnap.data();

          setArtwork({
            id: docSnap.id,
            ...artworkData,
          });

          // Fetch artist details using the stored artist ID or reference
          if (artworkData.artistId) {
            const artistDocRef = doc(firestore, "artists", artworkData.artistId);
            const artistDocSnap = await getDoc(artistDocRef);

            if (artistDocSnap.exists()) {
              const artistData = artistDocSnap.data();
              setArtist({
                name: artistData.name,
                slug: artistData.slug,
              });
            } else {
              console.error("Artist not found for artwork.");
              setArtist(null);
            }
          } else {
            console.warn("No artistId found in artwork document.");
          }
        } else {
          setArtwork(null); // No artwork found for this slug
        }
      } catch (error) {
        console.error("Error fetching artwork or artist:", error);
        setArtwork(null); // Explicit null for error state
      }
    };

    fetchArtworkAndArtist();
  }, [artworkSlug]);

  if (artwork === undefined) return <p>Loading...</p>; // Loading state
  if (artwork === null) return <p>Error fetching artwork. Please try again.</p>;

  const { title, url, date, medium, measurements, description, price, availability_status } = artwork;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.artwork_page}>
          <div className={styles.artwork_details}>
            <h1 className={styles.title} style={{ fontWeight: "400", fontFamily: 'var(--font-lovelt)', fontSize: '3rem' }}>{title}</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {artist ? (
                <Link href={`/artists/${artist.slug}`}>
                  <h2 style={{ fontWeight: "300" }}>{artist.name}</h2>
                </Link>
              ) : (
                <h2 style={{ fontWeight: "300" }}>Unknown Artist</h2>
              )}
              <p>{date}</p>
              <p>{medium}</p>
              <p>{measurements}</p>
              {price && <p style={{ fontWeight: "500", fontSize: "1.1rem" }}>${price.toLocaleString()}</p>}
              {availability_status && (
                <p style={{ 
                  fontWeight: "400", 
                  fontSize: "0.9rem", 
                  color: availability_status === "SOLD" ? "#e74c3c" : 
                         availability_status === "FOR_SALE" ? "#27ae60" :
                         availability_status === "ON_AUCTION" ? "#f39c12" :
                         availability_status === "ON_HOLD" ? "#9b59b6" : "#7f8c8d"
                }}>
                  {availability_status.replace(/_/g, ' ')}
                </p>
              )}
              <p style={{ marginTop: "2rem" }}>{description}</p>
              <button 
                onClick={openAcquireDialog}
                style={{
                  marginTop: "2rem",
                  padding: "0.875rem 1.75rem",
                  background: "none",
                  color: "#707984",
                  border: "1px solid #707984",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontFamily: "var(--font-lovelt)",
                  fontWeight: "300",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.color = "#000";
                  e.target.style.borderColor = "#000";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.color = "#707984";
                  e.target.style.borderColor = "#707984";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Acquire
              </button>
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <button
                onClick={() => window.history.back()}
                className={styles.back_link}
              >
                {/* <p style={{ fontSize: "1rem", fontWeight: "100", paddingBottom: "1rem", color: '#707984' }}>
                  {"<"} Back
                </p> */}
              </button>
            </div>
          </div>
          <div className={styles.artwork_image_container}>
            <img
              src={url}
              alt={title}
              style={{ width: "100%", height: "auto", maxHeight: "80vh", cursor: "pointer" }}
              onClick={() => openLightbox(url, title)}
            />
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={isLightboxOpen}
        imageSrc={lightboxImage.src}
        imageAlt={lightboxImage.alt}
        onClose={closeLightbox}
      />

      {/* Acquire Dialog Component */}
      <AcquireDialog
        isOpen={isAcquireDialogOpen}
        onClose={closeAcquireDialog}
        artwork={artwork}
        artist={artist}
      />
    </div>
  );
}
