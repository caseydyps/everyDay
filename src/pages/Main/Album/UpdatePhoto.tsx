import styled from 'styled-components/macro';
import { AddButton, CloseButton } from '../../../Components/Button/Button';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../config/Context/authContext';
import { db, storage } from '../../../config/firebase.config';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  updateDoc,
  getDocs,
  addDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import Swal from 'sweetalert2';

type UpdatePhotoProps = {
  setShowUpdateSection: (show: boolean) => void;
};

export const UpdatePhoto = ({ setShowUpdateSection }: UpdatePhotoProps) => {
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

  const [file, setFile] = useState<any>(null);
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [description, setDescription] = useState<string>('');
  const [albumId, setAlbumId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [members, setMembers] = useState<string[] | string>([]);
  const [canUpload, setCanUpload] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | string[] | any>(
    ''
  );
  const { familyId } = useContext(AuthContext);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files);
    }
  };

  const handleAlbumSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlbumTitle(e.target.value);
  };

  const handleAlbumTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumTitle(e.target.value);
  };

  const handleEditMember = (member: string | string[]) => {
    setMembers(member);
  };

  const handleUpload = async () => {
    if (!file || file.length === 0) {
      console.error('No files selected!');
      return;
    }
    if (!albumTitle || !File || !date) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }
    try {
      const albumsRef = collection(db, 'Family', familyId, 'photos');
      const querySnapshot = await getDocs(
        query(albumsRef, where('title', '==', albumTitle))
      );
      let albumDoc;
      if (querySnapshot.empty) {
        albumDoc = await addDoc(albumsRef, {
          title: albumTitle,
          members: members,
          description: description,
          photos: [],
          favorite: false,
          date: date,
        });
      } else {
        albumDoc = querySnapshot.docs[0].ref;
      }
      const albumData: AlbumData = (await getDoc(albumDoc)).data() as AlbumData;
      const currentPhotos: any = albumData.photos || [];
      const updatedPhotos = [...currentPhotos];
      for (let i = 0; i < file.length; i++) {
        const currFile = file[i];
        const newId = Date.now();
        const storageRef = ref(
          storage,
          `${albumTitle}/${Date.now()}_${currFile.name}`
        );
        await uploadBytes(storageRef, currFile);
        const downloadURL = await getDownloadURL(storageRef);
        setShowUpdateSection(false);
        const newPhoto = {
          id: newId,
          title: currFile.name,
          url: downloadURL,
        };
        updatedPhotos.push(newPhoto);
      }
      await updateDoc(albumDoc, { photos: updatedPhotos });
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
  }, [familyId]);

  useEffect(() => {
    if (file && albumTitle !== null && date !== null) {
      setCanUpload(true);
    } else {
      setCanUpload(false);
    }
  }, [file, selectedAlbumId, albumTitle, selectedMember, date]);

  return (
    <UpdateSection>
      <h4>上傳照片</h4>
      <QuitUpdateButton
        onClick={() => {
          setShowUpdateSection(false);
        }}
      />
      <StyledFileInput type="file" onChange={handleFileChange} multiple />
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
      <br />
      <FileInputLabel>
        Date:
        <StyledDateInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FileInputLabel>
      <AddButton onClick={handleUpload} disabled={!canUpload}>
        Upload
      </AddButton>
    </UpdateSection>
  );
};

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

const QuitUpdateButton = styled(CloseButton)`
  position: absolute;
  right: 10px;
  top: 10px;
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
