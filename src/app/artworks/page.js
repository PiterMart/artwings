"use client";
import Image from "next/image";
import styles from "../../styles/page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { app, firestore } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        // Fetch artworks
        const artworksSnapshot = await getDocs(collection(firestore, "artworks"));
        const artworksData = artworksSnapshot.docs.map((doc) => ({
          id: doc.id,
          slug: doc.data().artworkSlug || doc.id, // Use `artworkSlug` for the slug
          ...doc.data(),
        }));

        // Fetch artist information for each artwork
        const artworksWithArtists = await Promise.all(
          artworksData.map(async (artwork) => {
            if (artwork.artistId) {
              try {
                const artistDocRef = doc(firestore, "artists", artwork.artistId);
                const artistDocSnap = await getDoc(artistDocRef);
                if (artistDocSnap.exists()) {
                  const artistData = artistDocSnap.data();
                  return {
                    ...artwork,
                    artist: {
                      name: artistData.name,
                      slug: artistData.slug,
                    },
                  };
                }
              } catch (error) {
                console.error("Error fetching artist for artwork:", artwork.id, error);
              }
            }
            return {
              ...artwork,
              artist: null,
            };
          })
        );

        // Shuffle artworks for variety
        const shuffledArtworks = artworksWithArtists.sort(() => Math.random() - 0.5);
        setArtworks(shuffledArtworks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setIsLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  
  

  const currentPath = usePathname();

  const isCurrent = (path) => {
    return currentPath === path;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.page_container} style={{marginBottom: "10rem"}}>
          <div className={styles.artworks_page}>
            <div className={styles.artworks_header}>
              <h1 className={styles.artworks_title} style={{fontSize: '3rem', fontFamily: 'var(--font-lovelt)', marginBottom: '2rem', paddingTop: '1rem'}}>Artworks</h1>
              {isLoading ? (
                <div className={styles.loading_container}>
                  <div className={styles.loading_spinner}></div>
                  <p>Loading artworks...</p>
                </div>
              ) : (
                <div className={styles.artworks_grid}>
                  {artworks.map((artwork) => (
                    <div key={artwork.id} className={styles.artwork_card}>
                      <Link href={`/artworks/${artwork.slug}`} className={styles.artwork_link}>
                        <div className={styles.artwork_image_container}>
                          <Image
                            src={artwork.url}
                            alt={artwork.title}
                            width={300}
                            height={300}
                            className={styles.artwork_image}
                            loading="lazy"
                          />
                        </div>
                        <div className={styles.artwork_info}>
                          <h3 className={styles.artwork_title}>{artwork.title}</h3>
                          {artwork.artist && (
                            <p className={styles.artwork_artist}>
                              <Link href={`/artists/${artwork.artist.slug}`} className={styles.artist_link}>
                                {artwork.artist.name}
                              </Link>
                            </p>
                          )}
                          {artwork.availability_status && (
                            <p className={styles.artwork_availability} style={{ 
                              fontWeight: "400", 
                              fontSize: "0.9rem", 
                              color: artwork.availability_status === "SOLD" ? "#e74c3c" : 
                                     artwork.availability_status === "FOR_SALE" ? "#27ae60" :
                                     artwork.availability_status === "ON_AUCTION" ? "#f39c12" :
                                     artwork.availability_status === "ON_HOLD" ? "#9b59b6" : "#7f8c8d"
                            }}>
                              {artwork.availability_status.replace(/_/g, ' ')}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
