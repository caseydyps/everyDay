import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import Slideshow from './SlideShow';
import Layout from '../../../Components/layout';
import UserAuthData from '../../../Components/Login/Auth';
import DefaultButton, {
  ThreeDButton,
  AddButton,
  CloseButton,
} from '../../../Components/Button/Button';
import { MembersSelector } from '../../AI/SmartInput';
import Banner from '../../../Components/Banner/Banner';
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
  faCircleInfo,
  faCloudArrowUp,
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

type AlbumArray = Album[];

function Gallery() {
  const [file, setFile] = useState<any>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [members, setMembers] = useState<string[] | string>([]);
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
  const [selectedMember, setSelectedMember] = useState<string | string[] | any>(
    ''
  );
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
  const handleEditMember = (member: string | string[]) => {
    setMembers(member);
  };

  const handleFilterMember = (member: string | string[]) => {
    setSelectedMember(member);
  };
  const [showSlideshow, setShowSlideshow] = useState(false);
  const InfoButton = styled(ThreeDButton)`
    position: absolute;
    width: 30px;
    height: 30px;
    left: 400px;
    top: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
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
                setShowUpdateSection(!showUpdateSection);
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
            <UpdateSection>
              <h4>上傳照片</h4>
              <CloseButton
                onClick={() => {
                  setShowUpdateSection(false);
                }}
                style={{ position: 'absolute', right: '10px', top: '10px' }}
              />
              <StyledFileInput
                type="file"
                onChange={handleFileChange}
                multiple
              />

              <FileInputLabel>
                <StyledSelect
                  value={selectedAlbumId || ''}
                  onChange={handleAlbumSelect}
                >
                  <option value="">-- Select an album --</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </StyledSelect>
              </FileInputLabel>
              {selectedAlbumId ? (
                <p>
                  選擇相簿:{' '}
                  {albums.find((album) => album.id === selectedAlbumId)?.title}
                </p>
              ) : (
                <FileInputLabel>
                  相簿名稱
                  <StyledInput
                    type="text"
                    value={albumTitle}
                    onChange={handleAlbumTitleChange}
                    placeholder='e.g. "Trip to Japan"'
                  />
                </FileInputLabel>
              )}
              <br />
              <MembersSelector onSelectMember={handleEditMember} />
              {/* <FileInputLabel>
                選擇成員:
                <select multiple value={members} onChange={handleMembersChange}>
                  <option value="Alice">Alice</option>
                  <option value="Bob">Bob</option>
                  <option value="Charlie">Charlie</option>
                  <option value="David">David</option>
                </select>
              </FileInputLabel> */}
              <br />
              {/* <FileInputLabel>
                敘述:
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </FileInputLabel> */}
              <FileInputLabel>
                Date:
                <StyledDateInput
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FileInputLabel>

              <AddButton onClick={handleUpload}>Upload</AddButton>
            </UpdateSection>
          )}
          {showFilterSection && (
            <FilterSection>
              <DefaultButton
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  fontSize: '20px',
                  background: 'transparent',
                }}
                onClick={() => setShowFilterSection(false)}
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
              </DefaultButton>
              <Text>
                Filter by member:
                <DefaultButton
                  onClick={() => {
                    setSelectedMember('');
                  }}
                  className={selectedMember === '' ? 'active' : ''}
                  style={{
                    background: '#B7CCE2',
                    color: 'white',
                    padding: '5px 10px',
                    margin: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
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
            </FilterSection>
          )}

          <GalleryWrapper>
            <div
              style={{ position: 'absolute', top: '220px', left: '600px' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {
                <InfoButton>
                  <FontAwesomeIcon icon={faCircleInfo} />
                </InfoButton>
              }
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    left: '220px',
                    backgroundColor: '#414141',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '15px',
                    zIndex: 2,
                    width: '200px',
                  }}
                >
                  {'[Tips] Click album to view details'}
                </div>
              )}
            </div>
            {/* {filteredAlbums.map((album) => (
              <div key={album.id}>
                <AlbumTitle>{album.title}</AlbumTitle> */}
            {/* <AlbumMembers>{album.members.join(', ')}</AlbumMembers> */}
            {/* <div>{album.date}</div>
                {album.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.title}
                    style={{ width: '200px', height: 'auto' }}
                  />
                ))}
              </div>
            ))} */}

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
                    style={{ width: '320px', height: '320px' }}
                  />
                )}

                {showSlideshow && (
                  <>
                    <DefaultButton
                      onClick={() => {
                        setShowSlideshow(!showSlideshow);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                      }}
                    >
                      Close
                    </DefaultButton>

                    <Slideshow photos={album.photos} />
                  </>
                )}

                {/* {selectedAlbumId === album.id && (
                  <div>
                    <h3>Photos in {album.title}</h3>
                    <div>
                      {album.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.url}
                          alt={photo.title}
                          style={{ width: '200px', height: '300px' }}
                        />
                      ))}
                    </div>
                  </div>
                )} */}
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
  //overflow-x: scroll;
  //scrollbar-width: narrow;
  //border: 1px solid black;
  justify-content: center;
  align-items: center;

  //scrollbar-color: #3467a1 transparent;

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
`;

const NoPhotosText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UploadButton = styled(DefaultButton)`
  width: 70px;
  margin: 20px;
  border: 2px solid #5981b0;
`;

const UpdateSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 25px;

  max-width: 700px;
  padding: 20px;
  color: black;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 10%;
  right: 50%;
  transform: translate(+50%, 0%);
  z-index: 3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
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
  //sborder: gold solid 3px;
`;

const StyledFileInput = styled.input`
  padding: 10px;
  background-color: #f6f8f8;
  border: 1px solid #d7dde2;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  color: #414141;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &::file-selector-button {
    padding: 10px;
    background-color: #5981b0;
    border: none;
    color: #f6f8f8;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #3467a1;
      color: #f6f8f8;
    }
  }
`;

const FileInputLabel = styled.label`
  color: black;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  &:hover {
    background-color: #5981b0;
  }
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

const StyledInput = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3467a1;
    box-shadow: 0 0 0 2px rgba(52, 103, 161, 0.3);
  }
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #d7dde2;
  border-radius: 4px;
  margin-left: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5981b0;
    box-shadow: 0 0 0 2px rgba(52, 103, 161, 0.3);
  }
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

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  // border: 3px solid red;
  margin-top: 30px;
  padding: 20px;
`;

export default Gallery;
