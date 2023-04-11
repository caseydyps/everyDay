import React, { useState } from 'react';
import AlbumList from './AlbumList';
import Photo from './Photo';
import UploadForm from './UploadForm';
import styled from 'styled-components/macro';
import Sidebar from '../../../Components/SideBar/SideBar';

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
    {
      id: 1,
      title: 'Family Vacation',
      photos: [
        {
          id: 1,
          title: 'Beach Day',
          url: 'https://picsum.photos/200/300',
          members: ['John', 'Jane'],
          hashtags: ['beach', 'vacation'],
        },
        {
          id: 2,
          title: 'Hiking Trip',
          url: 'https://picsum.photos/200/300',
          members: ['Bob', 'Jane'],
          hashtags: ['hiking', 'mountains'],
        },
      ],
    },
    {
      id: 2,
      title: 'Graduation Party',
      photos: [
        {
          id: 3,
          title: 'Group Photo',
          url: 'https://picsum.photos/200/300',
          members: ['John', 'Bob', 'Jane'],
          hashtags: ['graduation', 'party'],
        },
        {
          id: 4,
          title: 'Celebration',
          url: 'https://picsum.photos/200/300',
          members: ['Bob', 'Sue'],
          hashtags: ['graduation', 'cake'],
        },
      ],
    },
  ]);

  const handleUpload = (file: File | null, albumId: string) => {
    if (!file) return;
    // Generate a unique ID for the new photo
    const newId = Date.now();
    // Create a new photo object with the file information and ID
    const newPhoto = {
      id: newId,
      title: file.name,
      url: URL.createObjectURL(file),
      members: [], // add empty array
      hashtags: [], // add empty array
    };
    // Find the album with the matching ID

    console.log(albumId);
    const updatedAlbum = albums.find(
      (album) => album.title === String(albumId)
    );
    if (!updatedAlbum) {
      // Handle the case where the album with the given ID doesn't exist
      console.error(`Album with ID ${albumId} not found`);
      return;
    }
    // Add the new photo to the album's photos array
    updatedAlbum.photos.push(newPhoto);
    // Create a new array of albums with the updated album
    const updatedAlbums = albums.map((album) =>
      album.id === Number(albumId) ? updatedAlbum : album
    );
    // Update the state with the new array of albums
    setAlbums(updatedAlbums);
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
