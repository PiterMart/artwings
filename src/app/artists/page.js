"use client";
import Image from "next/image";
import styles from "../styles/page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { app, firestore } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [randomArtwork, setRandomArtwork] = useState(null);

  useEffect(() => {
    async function fetchArtistsAndArtworks() {
      try {
        // Fetch artists
        const querySnapshot = await getDocs(collection(firestore, "artists"));
        const artistsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Fetch artworks separately
        const artworksSnapshot = await getDocs(collection(firestore, "artworks"));
        const artworksData = artworksSnapshot.docs.map((doc) => ({
          id: doc.id,
          slug: doc.data().artworkSlug || doc.id, // Use `artworkSlug` for the slug
          ...doc.data(),
        }));
  
        // Associate artworks with artists
        const artistsWithArtworks = artistsData.map((artist) => ({
          ...artist,
          artworks: artworksData.filter((artwork) => artist.artworks?.includes(artwork.id)),
        }));
  
        // Sort artists alphabetically by name
        artistsWithArtworks.sort((a, b) => a.name.localeCompare(b.name));
        setArtists(artistsWithArtworks);
  
        // Select a random artwork
        if (artworksData.length > 0) {
          const randomArt = artworksData[Math.floor(Math.random() * artworksData.length)];
          setRandomArtwork(randomArt);
        }
      } catch (error) {
        console.error("Error fetching artists or artworks:", error);
      }
    }
  
    fetchArtistsAndArtworks();
  }, []);
  
  

  const currentPath = usePathname();

  const isCurrent = (path) => {
    return currentPath === path;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.page_container} style={{marginBottom: "10rem"}}>
        {/* Left margin image */}
        <div className={styles.leftMargin} style={{height: "100vh"}}>
        <Image
          src="/maiden 11.png"
          alt="Left margin decoration"
          width={200}
          height={800}
          className={styles.marginImage}
        />
      </div>
      
      {/* Right margin image */}
      <div className={styles.rightMargin} style={{height: "100vh"}}>
        <Image
          src="/maiden 11.png"
          alt="Right margin decoration"
          width={200}
          height={800}
          className={styles.marginImage}
        />
      </div>
          <div className={styles.artists_page}>
            <div className={styles.name_list}>
              <ul className={styles.name_list}>
                {artists.map((artist) => (
                  <li key={artist.id}>
                    <Link href={`/artists/${artist.slug}`}>{artist.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={styles.artists_image}
              style={{
                background: "transparent",
                width: "100%",
                height: "auto",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {/* {randomArtwork ? (
                <Link href={`/artworks/${randomArtwork.slug}`}>
                  <img
                    src={randomArtwork.url}
                    alt={randomArtwork.title}
                    width={500}
                    height={500}
                    loading="lazy"
                    style={{
                      margin: "auto",
                      width: "auto",
                      maxHeight: "50vh",
                      height: "100%",
                      display: "block",
                    }}
                  />
                </Link>
              ) : (
                <p></p>
              )} */}
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
