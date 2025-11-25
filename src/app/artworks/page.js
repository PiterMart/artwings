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
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistNames, setArtistNames] = useState([]);
  const [featuredArtwork, setFeaturedArtwork] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

        // Extract unique artist names and sort them
        const uniqueArtistNames = [...new Set(
          artworksWithArtists
            .map(artwork => artwork.artist?.name || 'Unknown Artist')
            .filter(name => name)
        )].sort();

        setArtistNames(uniqueArtistNames);
        setArtworks(artworksWithArtists);
        
        // Select a random featured artwork from all artworks
        const allArtworks = artworksWithArtists;
        if (allArtworks.length > 0) {
          const randomIndex = Math.floor(Math.random() * allArtworks.length);
          setFeaturedArtwork(allArtworks[randomIndex]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setIsLoading(false);
      }
    }

    fetchArtworks();
  }, []);

  const handleArtistSelect = (artistName) => {
    setSelectedArtist(artistName === selectedArtist ? null : artistName);
  };

  // Filter artworks based on selected artist
  const filteredArtworks = selectedArtist
    ? artworks.filter(artwork => (artwork.artist?.name || 'Unknown Artist') === selectedArtist)
    : artworks;

  const currentPath = usePathname();

  const isCurrent = (path) => {
    return currentPath === path;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
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
        <div className={styles.page_container} style={{marginBottom: "10rem"}}>
          <div className={styles.artworks_page}>
            <div className={styles.artworks_header}>
              {/* <h1 className={styles.artworks_title} style={{fontSize: '3rem', fontFamily: 'var(--font-lovelt)', marginBottom: '2rem', paddingTop: '1rem'}}>Artworks</h1> */}
              {isLoading ? (
                <div className={styles.loading_container}>
                  <div className={styles.loading_spinner}></div>
                  <p>Loading artworks...</p>
                </div>
              ) : (
                <div className={styles.artworks_container}>
                  {/* Featured Artwork Section */}
                  {featuredArtwork && (
                    <div className={styles.featured_artwork_section}>
                      <div className={styles.featured_artwork_image}>
                        <Link href={`/artworks/${featuredArtwork.slug}`}>
                          <Image
                            src={featuredArtwork.url}
                            alt={featuredArtwork.title}
                            width={400}
                            height={400}
                            className={styles.featured_image}
                            priority={true}
                            loading="eager"
                          />
                        </Link>
                      </div>
                      <div className={styles.featured_artwork_text}>
                        <div>
                        {featuredArtwork.title && (
                          <p className={styles.featured_artwork_name}>&quot;{featuredArtwork.title}&quot;</p>
                        )}
                        {featuredArtwork.artist && (
                          <p className={styles.featured_artist_name}>by {featuredArtwork.artist.name}</p>
                        )}

                        </div>
                          <h2 className={styles.featured_title} style={{fontFamily: 'var(--font-lovelt)', color: "#707984"}}>The Complete Artwings Collection</h2>
                      </div>
                    </div>
                  )}
                  
                  {/* Artist Filter List */}
                  <div className={styles.artist_filter_container}>
                    <div className={styles.artist_filter_list}>
                      {artistNames.map((artistName) => (
                        <button
                          key={artistName}
                          className={`${styles.artist_filter_button} ${selectedArtist === artistName ? styles.artist_filter_button_active : ''}`}
                          onClick={() => handleArtistSelect(artistName)}
                        >
                          {artistName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Artworks Grid */}
                  <div className={styles.artworks_grid}>
                    {filteredArtworks.map((artwork) => (
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
                                {/* <Link href={`/artists/${artwork.artist.slug}`} className={styles.artist_link}>
                                  {artwork.artist.name}
                                </Link> */}
                              </p>
                            )}
                            {artwork.availability_status && (
                              <p className={styles.artwork_availability} style={{ 
                                fontWeight: "400", 
                                fontSize: "0.9rem", 
                                color: artwork.availability_status === "SOLD" ? "#e74c3c" : 
                                       artwork.availability_status === "FOR_SALE" ? "#707984" :
                                       artwork.availability_status === "ON_AUCTION" ? "#707984" :
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
