"use client";
import { useEffect, useState, useRef } from "react";
import { firestore, storage } from "./firebaseConfig";
import { getDocs, addDoc, collection, doc, updateDoc, Timestamp, arrayUnion, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import styles from "../../styles/uploader.module.css";
import imageCompression from 'browser-image-compression';

export default function ArtistUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [existingArtworks, setExistingArtworks] = useState([]);
  const [deletedArtworks, setDeletedArtworks] = useState([]);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    bio: [],
    manifesto: [],
    web: "",
    slug: "",
    profilePicture: "",
    cvUrl: "",
    birthDate: null,
  });

  const [newArtwork, setNewArtwork] = useState({
    file: null,
    images: [],
    title: "",
    date: "",
    medium: "",
    measurements: "",
    description: "",
    price: "",
    availability_status: "NOT_FOR_SALE",
    extras: [],
  });

  const [newExtra, setNewExtra] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [artworkImageUpdates, setArtworkImageUpdates] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCvDragOver, setIsCvDragOver] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistSnapshot = await getDocs(collection(firestore, "artists"));
        const artistsData = artistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArtists(artistsData);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const handleArtistSelection = async (artistId) => {
    setSelectedArtist(artistId);
    setDeletedArtworks([]); // Clear deleted artworks when selecting artist
    if (!artistId) {
      resetForm();
      return;
    }

    try {
      const artistDoc = await getDoc(doc(firestore, "artists", artistId));
      if (artistDoc.exists()) {
        const data = artistDoc.data();
        setFormData({
          ...data,
          birthDate: data.birthDate?.toDate() || null,
          bio: data.bio || [],
          manifesto: data.manifesto || []
        });

        // Load profile picture preview
        setProfilePicturePreview(data.profilePicture || null);

        // Fetch artworks
        if (data.artworks?.length > 0) {
          const artworksData = await Promise.all(
            data.artworks.map(async artworkId => {
              const artworkDoc = await getDoc(doc(firestore, "artworks", artworkId));
              if (!artworkDoc.exists()) return null;
              
              const artworkData = artworkDoc.data();
              return {
                id: artworkDoc.id,
                title: artworkData.title,
                date: artworkData.date,
                medium: artworkData.medium,
                measurements: artworkData.measurements,
                description: artworkData.description,
                price: artworkData.price || null,
                availability_status: artworkData.availability_status || "NOT_FOR_SALE",
                url: artworkData.url,  // Ensure this matches Firestore field name
                images: artworkData.images || artworkData.detailImages || [],  // Handle both field names
                extras: artworkData.extras || []
              };
            })
          );
          setExistingArtworks(artworksData.filter(artwork => artwork !== null));
        }
      }
    } catch (error) {
      console.error("Error loading artist data:", error);
      setError("Failed to load artist data.");
    }
  };

  const compressImage = async (file, options) => {
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Compression error:", error);
      throw error;
    }
  };

  const uploadProfilePicture = async (artistId) => {
    if (!(profilePictureFile instanceof File)) {
      return formData.profilePicture; // Return existing URL if no new file
    }
  
    try {
      const compressedFile = await imageCompression(profilePictureFile, {
        maxSizeMB: 0.25,
        maxWidthOrHeight: 800
      });
      
      const profilePicRef = ref(storage, `artists/${artistId}/profilePicture/${generateSlug(formData.name)}_profilePicture`);
      await uploadBytes(profilePicRef, compressedFile);
      return await getDownloadURL(profilePicRef);
    } catch (error) {
      console.error("Profile picture upload failed:", error);
      throw error;
    }
  };

  const uploadArtworkImages = async (artistId, artworkId, artworkData) => {
    try {
      if (!(artworkData.file instanceof File)) {
        throw new Error("Invalid main artwork file");
      }
  
      // Upload main artwork image
      const compressedMain = await imageCompression(artworkData.file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true
      });
      
      const mainRef = ref(storage, `artists/${artistId}/artworks/${artworkId}/${artworkId}`);
      await uploadBytes(mainRef, compressedMain);
      const mainUrl = await getDownloadURL(mainRef);
  
      // Upload detail images
      const detailUrls = [];
      for (let imgIndex = 0; imgIndex < artworkData.images.length; imgIndex++) {
        const imageFile = artworkData.images[imgIndex];
        const compressedDetail = await imageCompression(imageFile, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2000,
          useWebWorker: true
        });
        
        const detailRef = ref(
          storage, 
          `artists/${artistId}/artworks/${artworkId}/details/${artworkId}_detail_${imgIndex + 1}`
        );
        await uploadBytes(detailRef, compressedDetail);
        const detailUrl = await getDownloadURL(detailRef);
        detailUrls.push(detailUrl);
      }
  
      return { mainUrl, detailUrls };
    } catch (error) {
      console.error("Artwork upload failed:", error);
      throw error;
    }
  };

  const updateArtworkImages = async (artistId, artworkId, imageUpdates, currentArtwork) => {
    try {
      const updateData = {};
      
      // Handle main image update
      if (imageUpdates.mainImage instanceof File) {
        // Delete old main image if it exists
        if (currentArtwork.url) {
          try {
            const oldMainRef = ref(storage, currentArtwork.url);
            await deleteObject(oldMainRef);
          } catch (deleteError) {
            console.warn("Could not delete old main image:", deleteError);
          }
        }
        
        const compressedMain = await imageCompression(imageUpdates.mainImage, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2000,
          useWebWorker: true
        });
        
        const mainRef = ref(storage, `artists/${artistId}/artworks/${artworkId}/${artworkId}`);
        await uploadBytes(mainRef, compressedMain);
        const mainUrl = await getDownloadURL(mainRef);
        updateData.url = mainUrl;
      }
      
      // Handle detail images update
      if (imageUpdates.detailImages && imageUpdates.detailImages.length > 0) {
        // Delete old detail images if they exist
        if (currentArtwork.images && currentArtwork.images.length > 0) {
          for (const oldDetailUrl of currentArtwork.images) {
            try {
              const oldDetailRef = ref(storage, oldDetailUrl);
              await deleteObject(oldDetailRef);
            } catch (deleteError) {
              console.warn("Could not delete old detail image:", deleteError);
            }
          }
        }
        
        const detailUrls = [];
        for (let imgIndex = 0; imgIndex < imageUpdates.detailImages.length; imgIndex++) {
          const imageFile = imageUpdates.detailImages[imgIndex];
          const compressedDetail = await imageCompression(imageFile, {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 2000,
            useWebWorker: true
          });
          
          const detailRef = ref(
            storage, 
            `artists/${artistId}/artworks/${artworkId}/details/${artworkId}_detail_${imgIndex + 1}`
          );
          await uploadBytes(detailRef, compressedDetail);
          const detailUrl = await getDownloadURL(detailRef);
          detailUrls.push(detailUrl);
        }
        updateData.images = detailUrls;
      }
      
      // Update the artwork document in Firestore
      if (Object.keys(updateData).length > 0) {
        await updateDoc(doc(firestore, "artworks", artworkId), updateData);
      }
      
      return updateData;
    } catch (error) {
      console.error("Artwork image update failed:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const { name, origin, bio, manifesto, web } = formData;
      if (!name || !origin) throw new Error("Name and origin are required");
  
      const slug = generateSlug(name);
      const artistId = selectedArtist || doc(collection(firestore, "artists")).id;
  
      // Upload profile picture
      const profilePicUrl = await uploadProfilePicture(artistId);
  
      // Upload CV
      let cvUrl = formData.cvUrl || "";
      if (cvFile instanceof File) {
        const cvRef = ref(storage, `artists/${artistId}/cv/${generateSlug(formData.name)}_cv`);
        await uploadBytes(cvRef, cvFile);
        cvUrl = await getDownloadURL(cvRef);
      }
  
      // Process artworks
      const artworkIds = [];
      
      // Delete artworks that were removed from the collection
      for (const deletedArtwork of deletedArtworks) {
        if (deletedArtwork.id) {
          try {
            // Delete from artworks collection
            await deleteDoc(doc(firestore, "artworks", deletedArtwork.id));
            
            // Delete images from storage if they exist
            if (deletedArtwork.url) {
              try {
                const mainImageRef = ref(storage, deletedArtwork.url);
                await deleteObject(mainImageRef);
              } catch (storageError) {
                console.warn("Could not delete main image from storage:", storageError);
              }
            }
            
            // Delete detail images from storage
            if (deletedArtwork.images && deletedArtwork.images.length > 0) {
              for (const detailUrl of deletedArtwork.images) {
                try {
                  const detailImageRef = ref(storage, detailUrl);
                  await deleteObject(detailImageRef);
                } catch (storageError) {
                  console.warn("Could not delete detail image from storage:", storageError);
                }
              }
            }
          } catch (deleteError) {
            console.error("Error deleting artwork:", deleteError);
            // Continue with other operations even if deletion fails
          }
        }
      }
      
      // Process existing artworks
      for (const artwork of existingArtworks) {
        if (!artwork.id) { // New artwork added in form
          const artworkId = doc(collection(firestore, "artworks")).id;
          const { mainUrl, detailUrls } = await uploadArtworkImages(artistId, artworkId, artwork);
          
          const artworkDoc = {
            artistId,
            artistSlug: slug,
            artworkSlug: artworkId, // Use artwork ID for consistency with migrated data
            title: artwork.title,
            date: artwork.date,
            medium: artwork.medium,
            measurements: artwork.measurements,
            description: artwork.description,
            price: artwork.price ? parseFloat(artwork.price) : null,
            availability_status: artwork.availability_status || "NOT_FOR_SALE",
            extras: artwork.extras || [],
            url: mainUrl,
            images: detailUrls,
            exhibitions: [],
            fairs: [],
            createdAt: Timestamp.now()
          };
  
          await setDoc(doc(firestore, "artworks", artworkId), artworkDoc);
          artworkIds.push(artworkId);
        } else {
          // Update existing artwork if data has changed
          try {
            const artworkUpdateData = {
              title: artwork.title,
              date: artwork.date,
              medium: artwork.medium,
              measurements: artwork.measurements,
              description: artwork.description,
              price: artwork.price ? parseFloat(artwork.price) : null,
              availability_status: artwork.availability_status || "NOT_FOR_SALE",
              extras: artwork.extras || []
            };
            
            // Check if there are image updates for this artwork
            const imageUpdates = artworkImageUpdates[artwork.id];
            if (imageUpdates) {
              const imageUpdateData = await updateArtworkImages(artistId, artwork.id, imageUpdates, artwork);
              Object.assign(artworkUpdateData, imageUpdateData);
            }
            
            await updateDoc(doc(firestore, "artworks", artwork.id), artworkUpdateData);
            artworkIds.push(artwork.id);
          } catch (updateError) {
            console.error("Error updating artwork:", updateError);
            // Still include the artwork ID even if update fails
            artworkIds.push(artwork.id);
          }
        }
      }
  
      // Update/Create artist document
      const artistData = {
        name,
        origin,
        bio,
        manifesto,
        web,
        slug,
        profilePicture: profilePicUrl,
        cvUrl,
        birthDate: formData.birthDate ? Timestamp.fromDate(formData.birthDate) : null,
        artworks: artworkIds
      };
  
      if (selectedArtist) {
        await updateDoc(doc(firestore, "artists", selectedArtist), artistData);
        setSuccess("Artist updated successfully!");
      } else {
        const artistRef = doc(firestore, "artists", artistId);
        await setDoc(artistRef, artistData);
        setSelectedArtist(artistId);
        setSuccess("Artist created successfully!");
      }
  
      // Clear deleted artworks after successful submission
      setDeletedArtworks([]);
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Profile Picture Drag and Drop Handlers
  const handleProfilePictureFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleProfilePictureFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleProfilePictureFile(file);
    }
  };

  // CV Drag and Drop Handlers
  const handleCvFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleCvDragOver = (e) => {
    e.preventDefault();
    setIsCvDragOver(true);
  };

  const handleCvDragLeave = (e) => {
    e.preventDefault();
    setIsCvDragOver(false);
  };

  const handleCvDrop = (e) => {
    e.preventDefault();
    setIsCvDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleCvFile(files[0]);
    }
  };

  const handleCvFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCvFile(file);
    }
  };


  const resetForm = () => {
    if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
    if (newArtwork.file) URL.revokeObjectURL(URL.createObjectURL(newArtwork.file));
    newArtwork.images.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));

    setFormData({
      name: "",
      origin: "",
      bio: [],
      manifesto: [],
      web: "",
      slug: "",
      profilePicture: "",
      cvUrl: "",
      birthDate: null,
    });
    setNewArtwork({
      file: null,
      images: [],
      title: "",
      date: "",
      medium: "",
      measurements: "",
      description: "",
      price: "",
      availability_status: "NOT_FOR_SALE",
      extras: [],
    });
    setExistingArtworks([]);
    setDeletedArtworks([]);
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setCvFile(null);
    setArtworkImageUpdates({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
    };
  }, [profilePicturePreview]);


  const deleteArtwork = async (index) => {
    try {
      const artworkToDelete = existingArtworks[index];
      
      // Add to deleted artworks list
      setDeletedArtworks(prev => [...prev, artworkToDelete]);
      
      // Remove from existing artworks
      setExistingArtworks(prev => prev.filter((_, i) => i !== index));
      
    } catch (error) {
      console.error("Error deleting artwork:", error);
      setError("Failed to delete artwork");
    }
  };

  const handleExistingArtworkChange = (index, field, value) => {
    setExistingArtworks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleExistingArtworkExtrasChange = (index, extras) => {
    setExistingArtworks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        extras: extras
      };
      return updated;
    });
  };

  const handleArtworkMainImageChange = (artworkId, file) => {
    if (file instanceof File) {
      setArtworkImageUpdates(prev => ({
        ...prev,
        [artworkId]: {
          ...prev[artworkId],
          mainImage: file
        }
      }));
    }
  };

  const handleArtworkDetailImagesChange = (artworkId, files) => {
    const fileArray = Array.from(files).filter(file => file instanceof File);
    if (fileArray.length > 0) {
      setArtworkImageUpdates(prev => ({
        ...prev,
        [artworkId]: {
          ...prev[artworkId],
          detailImages: fileArray
        }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBirthDateChange = (e) => {
    setFormData({ ...formData, birthDate: new Date(e.target.value) });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setError("Invalid profile picture file");
    }
  };
  
  const handleNewArtworkFileChange = (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      setNewArtwork(prev => ({ ...prev, file }));
    } else {
      setError("Please select a valid main artwork file");
    }
  };
  
  const handleArtworkImagesChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file instanceof File);
    setNewArtwork(prev => ({ ...prev, images: files }));
  };

  const handleNewArtworkChange = (field, value) => {
    setNewArtwork((prevArtwork) => ({
      ...prevArtwork,
      [field]: value,
    }));
  };

  const addArtwork = () => {
    if (!(newArtwork.file instanceof File)) {
      setError("Please select a valid main image file");
      return;
    }
    if (!newArtwork.title.trim() || !newArtwork.medium.trim()) {
      setError("Title and Medium are required fields");
      return;
    }
  
    setExistingArtworks(prev => [...prev, newArtwork]);
    setNewArtwork({
      file: null,
      images: [],
      title: "",
      date: "",
      medium: "",
      measurements: "",
      description: "",
      price: "",
      availability_status: "NOT_FOR_SALE",
      extras: [],
    });
  };





  const handleCvChange = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
  };

  const addExtra = (index) => {
    if (newExtra.trim()) {
      handleExtraChange(index, newExtra.trim());
      setNewExtra("");
    }
  };

  const handleExtraChange = (index, value) => {
    setExistingArtworks(prev => {
      const updated = [...prev];
      if (!updated[index].extras) {
        updated[index].extras = [];
      }
      updated[index].extras.push(value);
      return updated;
    });
  };

  const removeExtra = (artworkIndex, extraIndex) => {
    setExistingArtworks(prev => {
      const updated = [...prev];
      updated[artworkIndex].extras.splice(extraIndex, 1);
      return updated;
    });
  };

  const uploadCv = async (artistId) => {
    if (!cvFile) return null;
    const cvRef = ref(storage, `artists/${artistId}/cv/${generateSlug(formData.name)}_cv`);
    await uploadBytes(cvRef, cvFile);
    return await getDownloadURL(cvRef);
  };

  return (
    <div className={styles.form}>
      <div>
      <p className={styles.subtitle}>SELECT ARTIST TO EDIT</p>
        <select
          value={selectedArtist || ""}
          onChange={(e) => handleArtistSelection(e.target.value)}
        >
          <option value="">Create New Artist</option>
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>
      {/* Artist ID Display */}
      {selectedArtist && (
        <div className={styles.artistIdDisplay}>
          <span className={styles.artistIdLabel}>Artist ID:</span>
          <span className={styles.artistIdValue}>{selectedArtist}</span>
        </div>
      )}

      {/* Artist Information Container */}
      <div className={styles.artistInfoContainer}>
        {/* Profile Picture and Basic Info Row */}
        <div className={styles.profileAndBasicInfoRow}>
          {/* Profile Picture Upload */}
          <div className={styles.profilePictureContainer}>
            <p className={styles.subtitle}>PROFILE PICTURE</p>
            <div
              className={`${styles.profilePictureDropZone} ${isDragOver ? styles.dragOver : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePicturePreview ? (
                <div className={styles.profilePicturePreview}>
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile Preview" 
                    className={styles.profilePreviewImage}
                  />
                  <div className={styles.profilePictureOverlay}>
                    <span>Click or drag to change</span>
                  </div>
                </div>
              ) : (
                <div className={styles.profilePicturePlaceholder}>
                  <p>Drag & drop an image here</p>
                  <p>or click to browse</p>
                  <small>Max size: 500px width</small>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Basic Information Container */}
          <div className={styles.basicInfoContainer}>
          <div className={styles.inputGroup}>
            <p className={styles.subtitle}>NAME</p>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.subtitle}>ORIGIN</p>
            <input
              name="origin"
              placeholder="Origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.subtitle}>BIRTH DATE</p>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : ''}
              onChange={handleBirthDateChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <p className={styles.subtitle}>WEBSITE</p>
            <input
              name="web"
              placeholder="Website"
              value={formData.web}
              onChange={(e) => setFormData({ ...formData, web: e.target.value })}
            />
          </div>
          </div>
        </div>

        {/* Bio Paragraphs Input */}
        <div>
          <p className={styles.subtitle}>BIO</p>
          <textarea
            placeholder="Add Bio Text (one paragraph per line)"
            value={formData.bio.join('\n')}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value.split('\n').filter(p => p.trim()) })}
          />
          <p className={styles.helpText}>Each line will become a separate paragraph. Press Enter to create new paragraphs.</p>
        </div>

        {/* Manifesto Paragraphs Input */}
        <div>
          <p className={styles.subtitle}>MANIFESTO</p>
          <textarea
            placeholder="Add Manifesto Text (one paragraph per line)"
            value={formData.manifesto.join('\n')}
            onChange={(e) => setFormData({ ...formData, manifesto: e.target.value.split('\n').filter(p => p.trim()) })}
          />
          <p className={styles.helpText}>Each line will become a separate paragraph. Press Enter to create new paragraphs.</p>
        </div>

        {/* CV File Input */}
        <div>
          <p className={styles.subtitle}>CV (PDF)</p>
          <div
            className={`${styles.cvDropZone} ${isCvDragOver ? styles.dragOver : ''}`}
            onDragOver={handleCvDragOver}
            onDragLeave={handleCvDragLeave}
            onDrop={handleCvDrop}
            onClick={() => document.getElementById('cv-file-input')?.click()}
          >
            {cvFile ? (
              <div className={styles.cvFileSelected}>
                <p>{cvFile.name}</p>
                <span>Click or drag to change</span>
              </div>
            ) : (
              <div className={styles.cvFilePlaceholder}>
                <p>Drag & drop a PDF here</p>
                <p>or click to browse</p>
                <small>PDF files only</small>
              </div>
            )}
          </div>
          <input
            id="cv-file-input"
            type="file"
            name="cv"
            accept=".pdf"
            onChange={handleCvFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Gallery Images Input */}
      <p className={styles.subtitle}>Artworks</p>
                {/* Current Artwork Preview */}

      {/* Display Previews for Selected Images */}
      <div className={styles.artworkFormSection}>
        <h3>Add New Artwork</h3>
        
        {/* Artwork Metadata Inputs */}
        <div className={styles.artworkMetadata}>
          <input
            type="text"
            placeholder="Title *"
            value={newArtwork.title}
            onChange={(e) => handleNewArtworkChange('title', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Date *"
            value={newArtwork.date}
            onChange={(e) => handleNewArtworkChange('date', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Medium *"
            value={newArtwork.medium}
            onChange={(e) => handleNewArtworkChange('medium', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Measurements"
            value={newArtwork.measurements}
            onChange={(e) => handleNewArtworkChange('measurements', e.target.value)}
          />
          <textarea
            placeholder="Description *"
            value={newArtwork.description}
            onChange={(e) => handleNewArtworkChange('description', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newArtwork.price}
            onChange={(e) => handleNewArtworkChange('price', e.target.value)}
          />
          <select
            value={newArtwork.availability_status}
            onChange={(e) => handleNewArtworkChange('availability_status', e.target.value)}
          >
            <option value="NOT_FOR_SALE">Not For Sale</option>
            <option value="FOR_SALE">For Sale</option>
            <option value="ON_AUCTION">On Auction</option>
            <option value="SOLD">Sold</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          
          {/* Extras Input */}
          <div className={styles.extrasInput}>
            <input
              type="text"
              placeholder="Add extra information"
              value={newExtra}
              onChange={(e) => setNewExtra(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => {
                if (newExtra.trim()) {
                  setNewArtwork(prev => ({
                    ...prev,
                    extras: [...(prev.extras || []), newExtra.trim()]
                  }));
                  setNewExtra("");
                }
              }}
            >
              Add Extra
            </button>
          </div>
          
          {/* Display Extras */}
          {newArtwork.extras && newArtwork.extras.length > 0 && (
            <div className={styles.extrasList}>
              {newArtwork.extras.map((extra, index) => (
                <span key={index} className={styles.extraTag}>
                  {extra}
                  <button 
                    type="button" 
                    onClick={() => setNewArtwork(prev => ({
                      ...prev,
                      extras: prev.extras.filter((_, i) => i !== index)
                    }))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image Upload Sections */}
        <div className={styles.imageUploadSection}>
          <div className={styles.uploadGroup}>
            <label>Main Artwork Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNewArtworkFileChange}
              required
            />
          </div>

          <div className={styles.uploadGroup}>
            <label>Detail Images (Multiple allowed)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleArtworkImagesChange}
            />
          </div>

          {/* Preview Section */}
          <div className={styles.previews}>
          {newArtwork.file && (
            <div className={styles.mainPreview}>
              <p>Main Image Preview:</p>
              <img
                src={URL.createObjectURL(newArtwork.file)}
                alt="Main artwork preview"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(newArtwork.file))}
              />
            </div>
          )}
            
            {newArtwork.images.length > 0 && (
              <div className={styles.detailPreviews}>
                <p>Detail Images Preview:</p>
                <div className={styles.detailImages}>
                  {newArtwork.images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Detail preview ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          onClick={addArtwork}
          disabled={!newArtwork.file || !newArtwork.title || !newArtwork.medium}
        >
          Add Artwork to Collection
        </button>
      </div>

      {existingArtworks.map((artwork, index) => (
        <div key={index} className={styles.artwork}>
          <p>Artwork {index + 1}</p>
          
          {/* Main Image Preview */}
            <img 
              src={artwork.url} 
              alt="Main Artwork Preview" 
              className={styles.artworkPreviewImage} 
            />

          {/* Detail Images Preview */}
          <div className={styles.detailImagesContainer}>
            {artwork.images?.map((imgUrl, imgIndex) => (
              <img
                key={imgIndex}
                src={imgUrl}
                alt={`Detail ${imgIndex + 1}`}
                className={styles.detailPreviewImage}
              />
            ))}
          </div>

          {/* Editable Fields */}
          <input
            type="text"
            placeholder="Title"
            value={artwork.title}
            onChange={(e) => handleExistingArtworkChange(index, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Date"
            value={artwork.date}
            onChange={(e) => handleExistingArtworkChange(index, 'date', e.target.value)}
          />
          <input
            type="text"
            placeholder="Medium"
            value={artwork.medium}
            onChange={(e) => handleExistingArtworkChange(index, 'medium', e.target.value)}
          />
          <input
            type="text"
            placeholder="Measurements"
            value={artwork.measurements}
            onChange={(e) => handleExistingArtworkChange(index, 'measurements', e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={artwork.description}
            onChange={(e) => handleExistingArtworkChange(index, 'description', e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={artwork.price || ""}
            onChange={(e) => handleExistingArtworkChange(index, 'price', e.target.value)}
          />
          <select
            value={artwork.availability_status || "NOT_FOR_SALE"}
            onChange={(e) => handleExistingArtworkChange(index, 'availability_status', e.target.value)}
          >
            <option value="NOT_FOR_SALE">Not For Sale</option>
            <option value="FOR_SALE">For Sale</option>
            <option value="ON_AUCTION">On Auction</option>
            <option value="SOLD">Sold</option>
            <option value="ON_HOLD">On Hold</option>
          </select>

          {/* Extras for Existing Artworks */}
          <div className={styles.extrasInput}>
            <input
              type="text"
              placeholder="Add extra information"
              value={newExtra}
              onChange={(e) => setNewExtra(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => addExtra(index)}
            >
              Add Extra
            </button>
          </div>
          
          {/* Display Extras for Existing Artworks */}
          {artwork.extras && artwork.extras.length > 0 && (
            <div className={styles.extrasList}>
              {artwork.extras.map((extra, extraIndex) => (
                <span key={extraIndex} className={styles.extraTag}>
                  {extra}
                  <button 
                    type="button" 
                    onClick={() => removeExtra(index, extraIndex)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Image Update Section */}
          <div className={styles.imageUpdateSection}>
            <h4>Update Images</h4>
            
            {/* Main Image Update */}
            <div className={styles.uploadGroup}>
              <label>Update Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleArtworkMainImageChange(artwork.id, e.target.files[0])}
              />
              {artworkImageUpdates[artwork.id]?.mainImage && (
                <div className={styles.imagePreview}>
                  <p>New Main Image Preview:</p>
                  <img
                    src={URL.createObjectURL(artworkImageUpdates[artwork.id].mainImage)}
                    alt="New main image preview"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>

            {/* Detail Images Update */}
            <div className={styles.uploadGroup}>
              <label>Update Detail Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleArtworkDetailImagesChange(artwork.id, e.target.files)}
              />
              {artworkImageUpdates[artwork.id]?.detailImages && artworkImageUpdates[artwork.id].detailImages.length > 0 && (
                <div className={styles.imagePreview}>
                  <p>New Detail Images Preview:</p>
                  <div className={styles.detailImages}>
                    {artworkImageUpdates[artwork.id].detailImages.map((file, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={URL.createObjectURL(file)}
                        alt={`New detail preview ${imgIndex + 1}`}
                        className={styles.previewImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="button" onClick={() => deleteArtwork(index)}>
            Delete
          </button>
        </div>
      ))}

      {/* Error Message */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Success Message */}
      {success && <p className={styles.success}>{success}</p>} {/* Optional: Add CSS for success messages */}

      {/* Submit Button */}
      <button type="button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : selectedArtist ? "Update Artist" : "Create Artist"}
      </button>
    </div>
  );
}