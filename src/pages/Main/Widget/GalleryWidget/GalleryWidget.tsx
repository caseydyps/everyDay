import {
  faPause,
  faPlay,
  faStar as fasStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'firebase/firestore';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import DefaultButton from '../../../../Components/Button/Button';
import { AuthContext } from '../../../../config/Context/authContext';
import { db, storage } from '../../../../config/firebase.config';
import Slideshow from './SlideShow';

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

function Gallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { familyId } = useContext(AuthContext);

  useEffect(() => {
    const fetchAlbums = async () => {
      const familyDocRef = collection(db, 'Family', familyId, 'photos');
      const querySnapshot = await getDocs(familyDocRef);
      const albumsData: any = [];
      querySnapshot.docs.forEach((doc) => {});
      for (const albumDoc of querySnapshot.docs) {
        const album = albumDoc.data();
        const firstPhoto = album.photos[0];
        if (firstPhoto) {
          const photoRef = ref(storage, firstPhoto.url);
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
              <Slideshow photos={album.photos} />
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

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
