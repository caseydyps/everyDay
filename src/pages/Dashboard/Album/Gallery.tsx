import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import Slideshow from './SlideShow';
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
type Album = {
  id: string;
  title: string;
  members: string[];
  description: string;
  date: string;
  favorite: boolean;
  photos: Photo[];
  firstPhotoURL: string;
};

type Photo = {
  id: string;
  url: string;
  title: string;
};

interface AlbumData {
  id: string;
  title: string;
  members: string[];
  description: string;
  date: string;
  isFavorite: boolean;
  photos: Photo[];
}

type PhotoType = Photo & {
  caption: string;
  date: Date;
  location: string;
  tags: string[];
};

type AlbumArray = Album[];

function Gallery() {
  const [file, setFile] = useState<File[] | null>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [albumId, setAlbumId] = useState<string>('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(null);
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const handleAlbumTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumTitle(e.target.value);
  };
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const regularStar = farStar;
  const solidStar = fasStar;

  const handleMembersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMembers(selectedOptions);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile([files.item(0)]);
    }
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
          favorite: false,
          date: date,
        });
      } else {
        // If an album already exists with the same name, use its document reference
        albumDoc = querySnapshot.docs[0].ref;
      }

      // Retrieve the current photos array from Firestore
      const albumData: AlbumData = (await getDoc(albumDoc)).data() as AlbumData;
      const currentPhotos: PhotoType[] = albumData.photos || [];

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
      fetchAlbums();

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

  const handleAlbumSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlbumTitle(e.target.value);
    console.log('Album Title: ', e.target.value);
  };

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

  const handleDeleteAlbum = async (album: Album) => {
    console.log(album.title);

    try {
      const albumsRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'photos'
      );

      const querySnapshot = await getDocs(
        query(albumsRef, where('title', '==', album.title))
      );

      if (querySnapshot.empty) {
        console.log('No matching album found');
        return;
      }
      // Delete the album document
      const albumDoc = querySnapshot.docs[0].ref;
      await deleteDoc(albumDoc);
      console.log('Album deleted successfully!');
      // Reset the selected album state
      const updatedAlbums = albums.filter((a) => a.id !== album.id);
      setAlbums(updatedAlbums);
      setSelectedAlbumId('');
      setSelectedAlbumTitle('');
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album: ', error);
    }
  };

  const handleToggleFavorite = async (album: Album) => {
    console.log('Hi');
    const albumRef = collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'photos');

    try {
      // Update the favorite property of the album document
      const querySnapshot = await getDocs(
        query(albumRef, where('title', '==', album.title))
      );

      if (querySnapshot.empty) {
        console.log('No matching album found');
        return;
      }

      const albumDocRef = querySnapshot.docs[0].ref;
      await updateDoc(albumDocRef, { favorite: !album.favorite });
      console.log('Album favorite status updated successfully!');

      // Update the selected album state
      const updatedAlbums = albums.map((a) => {
        if (a.id === album.id) {
          return {
            ...a,
            favorite: !a.favorite,
          };
        } else {
          return a;
        }
      });
      setAlbums(updatedAlbums);
      fetchAlbums();
    } catch (error) {
      console.error('Error updating album favorite status: ', error);
    }
  };

  const filteredAlbums = albums.filter((album) => {
    let memberMatch = true;
    let dateMatch = true;

    if (selectedMember && !album.members.includes(selectedMember)) {
      memberMatch = false;
    }

    if (selectedDate) {
      const albumDate = new Date(album.date);
      const selectedDateObj = new Date(selectedDate);
      dateMatch =
        albumDate.getFullYear() === selectedDateObj.getFullYear() &&
        albumDate.getMonth() === selectedDateObj.getMonth() &&
        albumDate.getDate() === selectedDateObj.getDate();
    }

    return memberMatch && dateMatch;
  });

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
            {albums.find((album) => album.id === selectedAlbumId)?.title}
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
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        <label>
          Filter by member:
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">All</option>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
            <option value="Charlie">Charlie</option>
            <option value="David">David</option>
          </select>
        </label>
        <br />
        <label>
          Filter by date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <br />
        <ul>
          {filteredAlbums.map((album) => (
            <li key={album.id}>
              <AlbumTitle>{album.title}</AlbumTitle>
              <AlbumMembers>{album.members.join(', ')}</AlbumMembers>
              <div>{album.date}</div>
              {album.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.title}
                  style={{ width: '200px', height: 'auto' }}
                />
              ))}
            </li>
          ))}
        </ul>
      </div>

      <GalleryWrapper>
        {albums.map((album) => (
          <AlbumWrapper key={album.id}>
            <AlbumTitle>{album.title}</AlbumTitle>
            <button onClick={() => handleToggleFavorite(album)}>
              {album.favorite ? (
                <FontAwesomeIcon icon={solidStar} />
              ) : (
                <FontAwesomeIcon icon={regularStar} />
              )}
              Add to Favorites
            </button>
            <Slideshow photos={album.photos} />
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
            <button onClick={() => handleDeleteAlbum(album)}>
              Delete Album
            </button>
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
