import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
function Gallery() {
  const [file, setFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState('');
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [albums, setAlbums] = useState([]);

  const handleAlbumTitleChange = (e) => {
    setAlbumTitle(e.target.value);
  };

  const handleMembersChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMembers(selectedOptions);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No files selected!');
      return;
    }

    try {
      // Create a new album document within the 'albums' subcollection
      const albumRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'photos'
      );
      const newAlbum = {
        title: albumTitle,
        members: members,
        description: description,
        photos: [],
      };
      const albumDoc = await addDoc(albumRef, newAlbum);

      for (let i = 0; i < file.length; i++) {
        const currFile = file[i];
        // Generate a unique ID for the new photo
        const newId = Date.now();
        // Upload the file to Firebase Storage
        const storageRef = ref(
          storage,
          `${albumTitle}/${Date.now()}_${currFile.name}`
        );
        await uploadBytes(storageRef, currFile);
        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File uploaded to Firebase Storage: ', downloadURL);
        // Add the new photo to the album in Firestore
        const albumData = {
          id: albumDoc.id,
          ...newAlbum,
        };
        const newPhoto = {
          id: newId,
          title: currFile.name,
          url: downloadURL,
        };
        const updatedPhotos = [...albumData.photos, newPhoto];
        console.log('Updated photos: ', updatedPhotos);
        await updateDoc(albumDoc, { photos: updatedPhotos });
        console.log('Photo added to album data in Firestore!');
      }
      // Reset the file input and album form
      setFile(null);
      setAlbumTitle('');
      setAlbumId('');
      setMembers([]);
      setDescription('');
    } catch (error) {
      console.error('Error uploading file to Firebase: ', error);
    }
  };

  const handleAlbumSelect = (e) => {
    setAlbumId(e.target.value);
  };

  return (
    <div>
      <h3>Upload a Photo</h3>
      <input type="file" onChange={handleFileChange} multiple />
      <br />
      <h3>Create an Album</h3>
      <label>
        Select album:
        <select value={albumId} onChange={handleAlbumSelect}>
          <option value="">-- Select an album --</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title:
        <input
          type="text"
          value={albumTitle}
          onChange={handleAlbumTitleChange}
        />
      </label>
      <br />
      <label>
        Members:
        <select multiple value={members} onChange={handleMembersChange}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
          <option value="Charlie">Charlie</option>
          <option value="David">David</option>
        </select>
      </label>
      <br />
      <label>
        Description:
        <textarea value={description} onChange={handleDescriptionChange} />
      </label>
      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Gallery;
