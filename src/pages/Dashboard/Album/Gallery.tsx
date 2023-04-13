import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import styled from 'styled-components/macro';

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
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
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
      // Check if an album with the same name already exists in Firestore
      const albumsRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'photos'
      );
      const querySnapshot = await getDocs(
        query(albumsRef, where('title', '==', albumTitle))
      );
      let albumDoc;
      if (querySnapshot.empty) {
        // If no album exists with the same name, create a new one
        albumDoc = await addDoc(albumsRef, {
          title: albumTitle,
          members: members,
          description: description,
          photos: [],
        });
      } else {
        // If an album already exists with the same name, use its document reference
        albumDoc = querySnapshot.docs[0].ref;
      }

      // Retrieve the current photos array from Firestore
      const albumData = (await getDoc(albumDoc)).data();
      const currentPhotos = albumData.photos || [];

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
        const newPhoto = {
          id: newId,
          title: currFile.name,
          url: downloadURL,
        };
        const updatedPhotos = [...currentPhotos, newPhoto];
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
    setAlbumTitle(e.target.value);
    console.log('Album Title: ', e.target.value);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      const familyDocRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'photos'
      );

      const querySnapshot = await getDocs(familyDocRef);
      const albumsData = [];

      querySnapshot.docs.forEach((doc) => {
        console.log(doc.data());
      });
      for (const albumDoc of querySnapshot.docs) {
        const album = albumDoc.data();
        console.log('Album:', album);
        const firstPhoto = album.photos[0];
        console.log('First photo:', firstPhoto);

        if (firstPhoto) {
          const photoRef = ref(storage, firstPhoto.url);
          console.log('Photo ref:', photoRef);
          const downloadURL = await getDownloadURL(photoRef);
          albumsData.push({ ...album, firstPhotoURL: downloadURL });
        } else {
          albumsData.push({ ...album, firstPhotoURL: null });
        }
      }
      setAlbums(albumsData);
    };

    fetchAlbums();
  }, []);

  return (
    <>
      <div>
        <h3>Upload a Photo</h3>
        <input type="file" onChange={handleFileChange} multiple />
        <br />
        <h3>Create an Album</h3>
        <label>
          Select album:
          <select value={selectedAlbumId} onChange={handleAlbumSelect}>
            <option value="">-- Select an album --</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
        </label>
        {selectedAlbumId ? (
          <p>
            Selected album:{' '}
            {albums.find((album) => album.id === selectedAlbumId).title}
          </p>
        ) : (
          <label>
            Title:
            <input
              type="text"
              value={albumTitle}
              onChange={handleAlbumTitleChange}
            />
          </label>
        )}
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
      <GalleryWrapper>
        {albums.map((album) => (
          <AlbumWrapper key={album.id}>
            <AlbumTitle>{album.title}</AlbumTitle>
            <AlbumDescription>{album.description}</AlbumDescription>
            <AlbumMembers>{album.members}</AlbumMembers>
            {album.firstPhotoURL ? (
              <AlbumCover
                src={album.firstPhotoURL}
                alt={album.title}
                onClick={() => setSelectedAlbumId(album.id)}
              />
            ) : (
              <NoPhotosText>No photos in this album</NoPhotosText>
            )}
            <h3>Click for more!</h3>

            {selectedAlbumId === album.id && (
              <div>
                <h3>Photos in {album.title}</h3>
                <div>
                  {album.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.title}
                      style={{ width: '200px', height: 'auto' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </AlbumWrapper>
        ))}
      </GalleryWrapper>
    </>
  );
}

const GalleryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  min-width: 250px;
`;

const AlbumTitle = styled.h4`
  font-size: 20px;
  margin: 0;
  margin-bottom: 10px;
`;

const AlbumDescription = styled.p`
  font-size: 16px;
  margin: 0;
  margin-bottom: 10px;
`;

const AlbumMembers = styled.p`
  font-size: 14px;
  margin: 0;
  margin-bottom: 10px;
`;

const AlbumCover = styled.img`
  width: 100%;
  height: auto;
`;

const NoPhotosText = styled.p`
  font-size: 16px;
  margin: 0;
`;

export default Gallery;
