import React, { useState, useEffect, useRef } from 'react';
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
import Slideshow from './SlideShowMini';
import Layout from '../../../Components/layout';
import UserAuthData from '../../../Components/Login/Auth';
import DefaultButton from '../../../Components/Button/Button';
import { MembersSelector } from '../../AI/SmartInput';
import {
  faFilter,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
  faMagnifyingGlass,
  faX,
  faLock,
  faLockOpen,
  faEyeSlash,
  faCloudArrowUp,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
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
  src: string;
  alt: string;
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
  const [file, setFile] = useState<any>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [albumId, setAlbumId] = useState<string>('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const handleAlbumTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumTitle(e.target.value);
  };
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const regularStar = farStar;
  const solidStar = fasStar;
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
    membersArray,
    memberRolesArray,
  } = UserAuthData();
  const handleMembersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMembers(selectedOptions);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('files', files);
    console.log(typeof files);
    if (files && files.length > 0) {
      setFile(files);
      console.log('selectedFiles', files);
    }
  };

  const handleUpload = async () => {
    console.log('handleUpload start');
    if (!file || file.length === 0) {
      console.error('No files selected!');
      return;
    }

    try {
      // Check if an album with the same name already exists in Firestore
      const albumsRef = collection(db, 'Family', familyId, 'photos');
      const querySnapshot = await getDocs(
        query(albumsRef, where('title', '==', albumTitle))
      );
      let albumDoc;
      if (querySnapshot.empty) {
        // If no album exists with the same name, create a new one
        console.log('No album exists with the same name, creating a new one');
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
        console.log(
          "An album already exists with the same name, using it's document reference"
        );
      }

      // Retrieve the current photos array from Firestore
      const albumData: AlbumData = (await getDoc(albumDoc)).data() as AlbumData;
      const currentPhotos: any = albumData.photos || [];
      console.log('currentPhotos', currentPhotos);

      const updatedPhotos = [...currentPhotos];

      // Loop over each selected file
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
        setShowUpdateSection(false);
        // Add the new photo to the album in Firestore
        const newPhoto = {
          id: newId,
          title: currFile.name,
          url: downloadURL,
        };
        updatedPhotos.push(newPhoto);
        console.log('Photo added to updated photos array!');
      }

      // Update the photos array in Firestore
      await updateDoc(albumDoc, { photos: updatedPhotos });
      console.log('Updated photos array in Firestore!');

      // Reset the file input and album form
      setFile(null);
      setAlbumTitle('');
      setAlbumId('');
      setMembers([]);
      setDescription('');

      fetchAlbums();
    } catch (error) {
      console.error('Error uploading file to Firebase: ', error);
    }
  };

  const handleAlbumSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlbumTitle(e.target.value);
    console.log('Album Title: ', e.target.value);
  };

  const fetchAlbums = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'photos');

    const querySnapshot = await getDocs(familyDocRef);
    const albumsData: any = [];

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
      const familyDocRef = collection(db, 'Family', familyId, 'photos');

      const querySnapshot = await getDocs(familyDocRef);
      const albumsData: any = [];

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
  }, [familyId]);

  const handleDeleteAlbum = async (album: Album) => {
    console.log(album.title);

    try {
      const albumsRef = collection(db, 'Family', familyId, 'photos');

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
    const albumRef = collection(db, 'Family', familyId, 'photos');

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
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const galleryRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    const galleryElement: any = galleryRef.current;
    let scrollInterval: any = null;
    if (isScrolling) {
      scrollInterval = setInterval(() => {
        if (galleryElement) {
          galleryElement.scrollLeft += 1;
          if (
            galleryElement.scrollLeft >=
            galleryElement.scrollWidth - galleryElement.clientWidth
          ) {
            galleryElement.scrollLeft = 0;
          }
        }
      }, 30);
    }

    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  const handleStopScrolling = () => {
    setIsScrolling(!isScrolling);
  };

  return (
    <Container>
      <ColumnWrap>
        <GalleryWrapper ref={galleryRef}>
          {filteredAlbums.map((album) => (
            <AlbumWrapper key={album.id}>
              {/* <AlbumTitle>{album.title}</AlbumTitle> */}

              <Slideshow photos={album.photos} />
              {/* <AlbumDescription>{album.description}</AlbumDescription> */}
            </AlbumWrapper>
          ))}
        </GalleryWrapper>
        <Button onClick={handleStopScrolling}>
          <FontAwesomeIcon icon={isScrolling ? faPause : faPlay} />
        </Button>
      </ColumnWrap>
    </Container>
  );
}

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  object-fit: cover;

  opacity: 0;
  transition: opacity 2s ease-in-out;

  &.active {
    opacity: 1;
  }
`;

const GalleryWrapper = styled.div`
  display: flex;
  width: 233px;
  gap: 20px;
  height: 100%;
  object-fit: cover;
  overflow-x: scroll;
  scrollbar-width: 0;
  scrollbar-color: transparent;

  &::-webkit-scrollbar {
    width: 0px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 0px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

  width: auto;
  height: auto;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const AlbumTitle = styled.h4`
  font-size: 20px;
  margin: 20px;
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

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  text-align: center;
  color: white;
  display: flex;
  flex-direction: row;

  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
`;

const Button = styled(DefaultButton)`
  background-color: transparent;
  padding: 0px;
  color: rgba(255, 255, 255, 0.5);
  border: none;
  box-shadow: none;
  :hover {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.75);
  }
  position: absolute;
  bottom: 0px;
`;

export default Gallery;
