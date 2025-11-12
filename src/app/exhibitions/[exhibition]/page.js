"use client";
import styles from "../../../styles/page.module.css";
import { firestore } from "../../firebase/firebaseConfig";
import Link from "next/link";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import EmblaCarousel from "../../carousel/EmblaCarousel";

export default function Exhibition({ params }) {
  const { exhibition: exhibitionSlug } = params; // Get slug from params
  const [exhibition, setExhibition] = useState(null); // State to store the exhibition data
  const [artistsData, setArtistsData] = useState([]); // State to store the artist details
  const [isCuratorialTextOpen, setIsCuratorialTextOpen] = useState(false); // State for curatorial text visibility

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

  if (exhibition === null) return <p>Loading exhibition data...</p>;
  if (!exhibition) return <p>No exhibition found.</p>;

  const exhibitionSlides = exhibition.gallery.map((gallery) => ({
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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.page_container}>
          <div className={styles.exhibition_page}>
            <h1 className={styles.exhibitionTitle}>{exhibition.name}</h1>
            {exhibition.flyer && (
              <div className={styles.flyerContainer}>
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
            <EmblaCarousel slides={exhibitionSlides} type="picture" />
            <p
              className={styles.paragraph}
              style={{ fontSize: "2rem", margin: "2rem auto", textAlign: "center", lineHeight: "2.25rem" }}
            >
              {exhibition.description}
            </p>
            {exhibition.curatorialTexts && exhibition.curatorialTexts.length > 0 && (
              <div className={styles.artist_page_contents_bio} style={{ position: "relative" }}>
                <p className={styles.title} style={{ marginTop: "3rem", fontWeight: "200" }}>
                  Curatorial Text
                </p>
                {isCuratorialTextOpen &&
                  exhibition.curatorialTexts.map((paragraph, index) => (
                    <div key={index}>
                      <p className={styles.paragraph}>{paragraph}</p>
                    </div>
                  ))}
                <button
                  onClick={() => setIsCuratorialTextOpen(!isCuratorialTextOpen)}
                  className={styles.toggleButton}
                  style={{
                    position: "absolute",
                    bottom: "-45px",
                    left: "1.25rem",
                    transform: "translateX(-50%)",
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "black",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "300",
                  }}
                >
                  {isCuratorialTextOpen ? "Close" : "Read"}
                </button>
              </div>
            )}
            {artistsData.length > 0 && (
              <section className={styles.artistListSection}>
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
            {allArtworks.length > 0 && (
              <section className={styles.artworkGridSection}>
                <h2 className={styles.sectionHeading}>Featured Artworks</h2>
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
          </div>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
