import React, { useState, useEffect } from 'react';
import AlbumList from './AlbumList';
import Photo from './Photo';
import UploadForm from './UploadForm';
import styled from 'styled-components/macro';
import Sidebar from '../../../Components/SideBar/SideBar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

type Photo = {
  id: number;
  title: string;
  url: string;
  members: string[];
  hashtags: string[];
};

type Album = {
  id: number;
  title: string;
  photos: Photo[];
};

const Album = () => {
  const [albums, setAlbums] = useState<Album[]>([
    // {
    //   id: 2,
    //   title: 'Graduation Party',
    //   photos: [
    //     {
    //       id: 3,
    //       title: 'Group Photo',
    //       url: 'https://picsum.photos/200/300',
    //       members: ['John', 'Bob', 'Jane'],
    //       hashtags: ['graduation', 'party'],
    //     },
    //     {
    //       id: 4,
    //       title: 'Celebration',
    //       url: 'https://picsum.photos/200/300',
    //       members: ['Bob', 'Sue'],
    //       hashtags: ['graduation', 'cake'],
    //     },
    //   ],
    // },
  ]);

  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumData = await getAlbumData();
      console.log(albumData);
      setAlbums(albumData);
    };
    fetchAlbums();
  }, []);

  const getAlbumData = async () => {
    const familyDocRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'photos'
    );
    const querySnapshot = await getDocs(familyDocRef);
    const albumData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return albumData;
  };

  const handleUpload = (files: FileList | null) => {
    if (!files) return;

    try {
      let updatedAlbums;
      console.log(selectedAlbumId);
      if (selectedAlbumId) {
        // Add the new photos to the selected album's photos array
        console.log(albums);
        console.log(albums[0].photos[0].title);
        console.log(selectedAlbumId);
        console.log(albums.map((album) => album.photos[0].title));
        const updatedAlbum = albums.find(
          (album) => album.photos[0].title === selectedAlbumId
        );
        console.log(updatedAlbum);
        const newPhotos = Array.from(files).map((file) => ({
          id: Date.now(),
          title: file.name,
          url: URL.createObjectURL(file),
          members: [],
          hashtags: [],
        }));
        updatedAlbum.photos = [...updatedAlbum.photos, ...newPhotos];
        // Create a new array of albums with the updated album
        updatedAlbums = albums.map((album) =>
          album.id === Number(selectedAlbumId) ? updatedAlbum : album
        );
      } else if (newAlbumName) {
        // Create a new album with the new album name and the new photos
        const newAlbum = {
          id: Date.now(),
          title: newAlbumName,
          photos: Array.from(files).map((file) => ({
            id: Date.now(),
            title: file.name,
            url: URL.createObjectURL(file),
            members: [],
            hashtags: [],
          })),
        };
        // Add the new album to the array of albums
        updatedAlbums = [...albums, newAlbum];
      } else {
        console.error(
          'Error uploading photos: no album selected or new album name entered.'
        );
        return;
      }

      // Update the state with the new array of albums
      setAlbums(updatedAlbums);
      localStorage.setItem('albums', JSON.stringify(updatedAlbums));
      console.log('Photos saved to localStorage!');
    } catch (error) {
      console.error('Error uploading photos: ', error);
    }
  };

  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const handleAlbumClick = (album: Album) => {
    setCurrentAlbum(album);
  };

  const handlePhotoClick = (photo: Photo) => {
    console.log('Clicked photo:', photo);
  };

  type Album = {
    id: number;
    title: string;
    photos: Photo[];
  };

  type Photo = {
    id: number;
    title: string;
    url: string;
    members: string[];
    hashtags: string[];
  };

  return (
    <Container>
      <Sidebar />
      <ColumnWrap>
        <h1>Photo Albums</h1>

        <AlbumList albums={albums} onAlbumClick={handleAlbumClick} />

        <UploadForm
          albums={albums}
          onUpload={(file, albumId) => handleUpload(file, albumId.toString())}
        />
      </ColumnWrap>
      {currentAlbum ? (
        <div>
          <h2>{currentAlbum.title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {currentAlbum.photos.map((photo: Photo) => (
              <Photo key={photo.id} photo={photo} onClick={handlePhotoClick} />
            ))}
          </div>
        </div>
      ) : (
        albums.map((album: Album) => (
          <div key={album.id}>
            <h2>{album.title}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {album.photos.map((photo: Photo) => (
                <Photo
                  key={photo.id}
                  photo={photo}
                  members={photo.members}
                  hashtags={photo.hashtags}
                  onClick={handlePhotoClick}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default Album;
