"use client";
import styles from "../../../styles/page.module.css";
import { firestore } from "../../firebase/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import EmblaCarousel from "../../carousel/EmblaCarousel";

export default function Exhibition({ params }) {
  const { exhibition: exhibitionSlug } = params; // Get slug from params
  const [exhibition, setExhibition] = useState(null); // State to store the exhibition data
  const [artistsData, setArtistsData] = useState([]); // State to store the artist details
  const bannerRef = useRef(null);

  // Fetch the exhibition details based on the slug
  const fetchExhibition = async () => {
    console.log("Fetching exhibition with slug:", exhibitionSlug);
    try {
      const q = query(collection(firestore, "exhibitions"), where("slug", "==", exhibitionSlug));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const exhibitionData = docSnap.data();
        setExhibition({ id: docSnap.id, ...exhibitionData });

        // Fetch the artists and their artworks
        if (exhibitionData.artists && exhibitionData.artists.length > 0) {
          const artistsDetails = await fetchArtists(exhibitionData.artists);
          setArtistsData(artistsDetails);
        }
      } else {
        console.error("No such exhibition found!");
        setExhibition(null);
      }
    } catch (error) {
      console.error("Error fetching exhibition:", error);
      setExhibition(null);
    }
  };

  // Fetch artist details and associated artworks
  const fetchArtists = async (artists) => {
    try {
      const artistPromises = artists.map(async (artist) => {
        const artistDoc = await getDoc(doc(firestore, "artists", artist.artistSlug)); // Using artistSlug as artistId
        if (artistDoc.exists()) {
          const artistData = artistDoc.data();

          // Fetch artworks for this artist
          const selectedArtworks = await fetchArtworks(artist.selectedArtworks);

          return {
            ...artistData,
            id: artistDoc.id,
            slug: artistDoc.id,
            selectedArtworks, // Attach fetched artworks
          };
        }
        return null;
      });

      const fetchedArtists = await Promise.all(artistPromises);
      return fetchedArtists.filter((artist) => artist !== null); // Remove null entries
    } catch (error) {
      console.error("Error fetching artists:", error);
      return [];
    }
  };

  // Fetch artworks by their IDs
  const fetchArtworks = async (artworkIds) => {
    try {
      const artworkPromises = artworkIds.map(async (artworkId) => {
        const artworkDoc = await getDoc(doc(firestore, "artworks", artworkId));
        if (artworkDoc.exists()) {
          return {
            id: artworkDoc.id,
            ...artworkDoc.data(),
          };
        }
        return null;
      });

      const fetchedArtworks = await Promise.all(artworkPromises);
      return fetchedArtworks.filter((artwork) => artwork !== null); // Remove null entries
    } catch (error) {
      console.error("Error fetching artworks:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchExhibition();
  }, [exhibitionSlug]);

  if (exhibition === null) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_spinner}></div>
        <p style={{ fontSize: '1rem', color: '#707984', marginTop: '1rem' }}>Loading exhibition...</p>
      </div>
    );
  }
  if (!exhibition) return <p>No exhibition found.</p>;

  const exhibitionSlides = (exhibition.gallery || []).map((gallery) => ({
    image: gallery.url,
  }));

  const allArtworks = artistsData.flatMap((artist) =>
    (artist.selectedArtworks || []).map((artwork) => ({
      ...artwork,
      artistName: artist.name,
      artistSlug: artist.slug || artist.id,
    }))
  );

  const flyerExtension = exhibition.flyer?.split("?")[0].toLowerCase();
  const isFlyerVideo =
    typeof flyerExtension === "string" && /\.(mp4|webm|ogg|mov)$/.test(flyerExtension);

  const isMetaxy = exhibition?.name?.toLowerCase() === 'metaxy' || 
                   exhibition?.slug?.toLowerCase() === 'metaxy' ||
                   exhibitionSlug?.toLowerCase() === 'metaxy';

  const isTransgenesis = exhibition?.name?.toLowerCase() === 'transgenesis' || 
                         exhibition?.slug?.toLowerCase() === 'transgenesis' ||
                         exhibitionSlug?.toLowerCase() === 'transgenesis';

  // Helper function to format dates from Firestore timestamps
  const formatDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      // Handle Firestore Timestamp
      const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  // Format dates
  const openingDate = formatDate(exhibition.openingDate);
  const closingDate = formatDate(exhibition.closingDate);
  const receptionDate = formatDate(exhibition.receptionDate);

  return (
    <div className={`${styles.page} ${isMetaxy ? 'metaxy' : ''} ${isTransgenesis ? 'transgenesis' : ''}`}>
      <main className={styles.main}>
        <div className={styles.page_container}>
          <div className={styles.exhibition_page}>
            {/* 1. Exhibition Name and Curator */}
            <div className={styles.exhibitionHeaderContainer}>
              {/* Banner Image */}
              {(exhibition.banner || exhibition.bannermobile) && (
                <div ref={bannerRef} className={styles.heroBanner} style={{ position: 'relative' }}>
                  {exhibition.banner && (
                    <Image
                      src={exhibition.banner}
                      alt={`${exhibition.name} banner`}
                      width={1920}
                      height={1080}
                      className={styles.heroBannerDesktop}
                      priority
                      sizes="100vw"
                    />
                  )}
                  {exhibition.bannermobile && (
                    <Image
                      src={exhibition.bannermobile}
                      alt={`${exhibition.name} mobile banner`}
                      width={1080}
                      height={1920}
                      className={styles.heroBannerMobile}
                      priority
                      sizes="100vw"
                    />
                  )}
                  {!exhibition.bannermobile && exhibition.banner && (
                    <Image
                      src={exhibition.banner}
                      alt={`${exhibition.name} mobile banner`}
                      width={1080}
                      height={1920}
                      className={styles.heroBannerMobile}
                      priority
                      sizes="100vw"
                    />
                  )}
                </div>
              )}
              <h1 className={styles.exhibitionTitle}>{exhibition.name}</h1>
              {exhibition.curator && (
                <p className={styles.paragraph} style={{ fontSize: "0.9rem", textAlign: "right", padding: "1rem"}}>
                  curated by: {exhibition.curator}
                </p>
              )}
            </div>

            {/* 2. Description */}
            {exhibition.description && (
              <p
                className={styles.paragraph}
                style={{ fontSize: "1rem",
                  lineHeight: "1rem",
                  margin: "auto",
                  padding: "1rem" }}
              >
                {Array.isArray(exhibition.description) 
                  ? exhibition.description.map((para, idx) => (
                      <span key={idx}>
                        {para}
                        {idx < exhibition.description.length - 1 && <><br /><br /></>}
                      </span>
                    ))
                  : exhibition.description}
              </p>
            )}

            {exhibition.subtitle && (
              <h2 className={styles.exhibitionSubtitle} style={{ fontSize: "1.5rem", margin: "1rem auto", textAlign: "center", fontWeight: "300" }}>
                {exhibition.subtitle}
              </h2>
            )}

            {/* Curatorial Text */}
            {exhibition.curatorialTexts && exhibition.curatorialTexts.length > 0 && (
              <div
                className={styles.curatorialTextContainer}
                style={{
                  marginTop: "2rem",
                  marginBottom: "2rem",
                  width: "auto",
                  maxWidth: "600px",
                  border: "1px solid var(--foreground)",
                  padding: "1.5rem",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {exhibition.curatorialTexts.map((paragraph, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <p className={styles.paragraph} style={{ width: "100%" }}>{paragraph}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Exhibition Dates & Location */}
            {(openingDate || closingDate || receptionDate || exhibition.receptionTime || exhibition.address || exhibition.googleMapsLink) && (
              <section className={styles.exhibitionInfoContainer} style={{ marginTop: "2rem", marginBottom: "2rem", textAlign: "left" }}>
                {(openingDate || closingDate) && (
                  <div>
                    {openingDate && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <strong>Opening:</strong> {openingDate}
                      </p>
                    )}
                    {closingDate && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <strong>Closing:</strong> {closingDate}
                      </p>
                    )}
                  </div>
                )}
                
                {(receptionDate || exhibition.receptionTime) && (
                  <div>
                    {receptionDate && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <strong>Reception:</strong> {receptionDate}
                        {exhibition.receptionTime && ` at ${exhibition.receptionTime}`}
                      </p>
                    )}
                    {!receptionDate && exhibition.receptionTime && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <strong>Reception Time:</strong> {exhibition.receptionTime}
                      </p>
                    )}
                  </div>
                )}

                {(exhibition.address || exhibition.googleMapsLink) && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    {exhibition.address && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <strong>Location:</strong> {exhibition.address}
                      </p>
                    )}
                    {exhibition.googleMapsLink && (
                      <p className={styles.paragraph} style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>
                        <a 
                          href={exhibition.googleMapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: "inherit", textDecoration: "underline" }}
                        >
                          View on Google Maps
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* 5. Represented Artists */}
            {artistsData.length > 0 && (
              <section className={styles.artistListSection} style={{ marginTop: "3rem" }}>
                <h2 className={styles.sectionHeading}>Represented Artists</h2>
                <ul className={styles.artistList}>
                  {artistsData.map((artist) => (
                    <li key={artist.id}>
                      <Link href={`/artists/${artist.slug || artist.id}`}>{artist.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 6. Artworks */}
            {allArtworks.length > 0 && (
              <section className={styles.artworkGridSection} style={{ marginTop: "3rem" }}>
                <h2 className={styles.sectionHeading} style={{ paddingLeft: "1rem" }}>Featured Artworks</h2>
                <div className={styles.artworkGrid}>
                  {allArtworks.map((artwork) => {
                    const artworkSlug = artwork.slug || artwork.artworkSlug || artwork.id;
                    return (
                      <Link
                        href={artworkSlug ? `/artworks/${artworkSlug}` : "#"}
                        key={`${artwork.id}-${artwork.title}`}
                        className={styles.artworkCard}
                        aria-label={`${artwork.title} by ${artwork.artistName}`}
                      >
                        {artwork.url && (
                          <img
                            src={artwork.url}
                            alt={artwork.title || "Artwork image"}
                            className={styles.artworkImage}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 7. Image Gallery */}
            {exhibition.gallery && exhibition.gallery.length > 0 && (
              <div style={{ marginTop: "3rem" }}>
                <EmblaCarousel slides={exhibitionSlides} type="picture" />
              </div>
            )}

            {/* 8. Flyer */}
            {exhibition.flyer && (
              <div className={styles.flyerContainer} style={{ marginTop: "3rem" }}>
                {isFlyerVideo ? (
                  <video
                    className={`${styles.flyerMedia} ${styles.flyerVideo}`}
                    src={exhibition.flyer}
                    controls
                    playsInline
                    aria-label={`${exhibition.name} flyer video`}
                  />
                ) : (
                  <img
                    className={styles.flyerImage}
                    src={exhibition.flyer}
                    alt={`${exhibition.name} flyer`}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
