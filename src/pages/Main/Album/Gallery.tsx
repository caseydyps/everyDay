import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase.config';
import 'firebase/firestore';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import Slideshow from './SlideShow';
import { ChatToggle } from '../../../Components/Chat/ChatToggle';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../../config/Context/authContext';
import { UpdatePhoto } from './UpdatePhoto';
import DefaultButton, {
  ThreeDButton,
  AddButton,
  CloseButton,
} from '../../../Components/Button/Button';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
import Banner from '../../../Components/Banner/Banner';
import {
  faFilter,
  faTrashCan,
  faCircleInfo,
  faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  updateDoc,
  getDocs,
  addDoc,
  getDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import SideNav from '../../../Components/Nav/SideNav';

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

function Gallery() {
  const [file, setFile] = useState<any>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string>('');
  const [showFavorite, setShowFavorite] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | string[] | any>(
    ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const regularStar = farStar;
  const solidStar = fasStar;
  const [canUpload, setCanUpload] = useState(false);

  useEffect(() => {
    if (file && albumTitle !== null && date !== null) {
      setCanUpload(true);
    } else {
      setCanUpload(false);
    }
  }, [file, selectedAlbumId, albumTitle, selectedMember, date]);

  const { familyId } = useContext(AuthContext);
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
  }, [familyId, albums]);

  const handleDeleteAlbum = async (album: Album) => {
    try {
      const albumsRef = collection(db, 'Family', familyId, 'photos');
      const querySnapshot = await getDocs(
        query(albumsRef, where('title', '==', album.title))
      );
      if (querySnapshot.empty) {
        return;
      }
      const albumDoc = querySnapshot.docs[0].ref;
      await deleteDoc(albumDoc);
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
    const albumRef = collection(db, 'Family', familyId, 'photos');
    try {
      const querySnapshot = await getDocs(
        query(albumRef, where('title', '==', album.title))
      );
      if (querySnapshot.empty) {
        return;
      }
      const albumDocRef = querySnapshot.docs[0].ref;
      await updateDoc(albumDocRef, { favorite: !album.favorite });
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
    let favoriteMatch = true;
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
    if (showFavorite && !album.favorite) {
      favoriteMatch = false;
    }
    return memberMatch && dateMatch && favoriteMatch;
  });
  const [showFilterSection, setShowFilterSection] = useState(false);
  const handleFilterMember = (member: string | string[]) => {
    setSelectedMember(member);
  };
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Container>
      <SideNav />
      <Wrap>
        <Banner title="Gallery" subTitle="Say Cheese!"></Banner>
        <ColumnWrap>
          <RowWrap>
            <UploadButton
              onClick={() => {
                console.log('clicked');
                setShowUpdateSection(!showUpdateSection);
                console.log(showUpdateSection);
                setShowFilterSection(false);
              }}
            >
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </UploadButton>
            <UploadButton
              onClick={() => {
                setShowFilterSection(!showFilterSection);
                setShowUpdateSection(false);
              }}
            >
              <FontAwesomeIcon icon={faFilter} />
            </UploadButton>
          </RowWrap>
          {showUpdateSection && (
            <UpdatePhoto setShowUpdateSection={setShowUpdateSection} />
          )}
          {showFilterSection && (
            <FilterSection>
              <FilterButton onClick={() => setShowFilterSection(false)}>
                <FontAwesomeIcon icon={faXmarkCircle} />
              </FilterButton>
              <Text>
                Filter by member:
                <DefaultButton
                  onClick={() => {
                    setSelectedMember('');
                  }}
                  className={selectedMember === '' ? 'active' : ''}
                >
                  All
                </DefaultButton>
                <MembersSelector onSelectMember={handleFilterMember} />
              </Text>
              <br />
              <Text>
                Filter by date:
                <StyledDateInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Text>
              <br />
              <br />
              <Text>
                Filter by favorite:
                <FavoriteButton
                  onClick={() => setShowFavorite(!showFavorite)}
                  className={showFavorite ? 'active' : ''}
                >
                  {showFavorite ? 'Show all' : 'Show only favorites'}
                </FavoriteButton>
              </Text>
              <br />
            </FilterSection>
          )}
          <GalleryWrapper>
            <ChatToggle />
            <TooltipWrapper
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {
                <InfoButton>
                  <FontAwesomeIcon icon={faCircleInfo} />
                </InfoButton>
              }
              {showTooltip && (
                <Tooltip>{'[Tips] Click album to view details'}</Tooltip>
              )}
            </TooltipWrapper>
            {filteredAlbums.map((album) => (
              <AlbumWrapper key={album.id}>
                <RowWrap>
                  <DefaultButton onClick={() => handleToggleFavorite(album)}>
                    {album.favorite ? (
                      <FontAwesomeIcon icon={solidStar} />
                    ) : (
                      <FontAwesomeIcon icon={regularStar} />
                    )}
                  </DefaultButton>
                  <DefaultButton onClick={() => handleDeleteAlbum(album)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </DefaultButton>
                </RowWrap>
                <AlbumTitle>{album.title}</AlbumTitle>
                <AlbumDescription>{album.description}</AlbumDescription>
                <AlbumMembers>{album.members}</AlbumMembers>
                {!showSlideshow && (
                  <AlbumCover
                    src={album.firstPhotoURL}
                    alt={album.title}
                    onClick={() => {
                      setSelectedAlbumId(album.id);
                      setShowSlideshow(!showSlideshow);
                    }}
                  />
                )}
                {showSlideshow && (
                  <>
                    <ShowSlideShowButton
                      onClick={() => {
                        setShowSlideshow(!showSlideshow);
                      }}
                    >
                      Close
                    </ShowSlideShowButton>
                    <Slideshow photos={album.photos} />
                  </>
                )}
              </AlbumWrapper>
            ))}
          </GalleryWrapper>
        </ColumnWrap>
      </Wrap>
    </Container>
  );
}

const GalleryWrapper = styled.div`
  display: flex;
  max-width: auto;
  gap: 20px;
  height: auto;
  flex-wrap: wrap;

  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3467a1;
    border-radius: 1px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  @media screen and (max-width: 767px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    overflow-y: scroll;
  }

  @media screen and (min-width: 768px) and (max-width: 991px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    overflow-y: scroll;
  }
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border: 1px solid #3467a1;
  width: 320px;
  height: auto;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
`;

const AlbumTitle = styled.h4`
  font-size: 20px;
  margin: 20px;
  margin-bottom: 10px;
  color: #414141;
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
  height: auto;
  object-fit: cover;
  width: 320px;
  height: 320px;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UploadButton = styled(ThreeDButton)`
  width: 90px;
  margin: 20px;
  padding: 10px;
  border-radius: 25px;
  border: 2px solid #5981b0;
  background-color: #5981b0;
  color: #f6f8f8;
  :hover {
    background-color: #3467a1;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 25px;
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.3);
  max-width: 700px;
  padding: 20px;
  position: absolute;
  color: #3467a1;
  top: 20%;
  right: 50%;
  transform: translate(+50%, 0%);
  z-index: 3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
`;

const Text = styled.div`
  color: black;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  &:hover {
  }
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const InfoButton = styled(ThreeDButton)`
  position: absolute;
  padding: 10px;
  left: 400px;
  top: -50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilterButton = styled(DefaultButton)`
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 20px;
  background: transparent;
`;
const TooltipWrapper = styled.div`
  position: absolute;
  top: 220px;
  left: 600px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 50px;
  left: 220px;
  background-color: #414141;
  color: #fff;
  padding: 20px;
  border-radius: 15px;
  z-index: 2;
  width: 200px;
`;

const ShowSlideShowButton = styled(DefaultButton)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const FavoriteButton = styled(DefaultButton)`
  background: #b7cce2;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledDateInput = styled.input.attrs({
  type: 'date',
})`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5981b0;
    box-shadow: 0 0 0 2px rgba(52, 103, 161, 0.3);
  }
`;

export default Gallery;
