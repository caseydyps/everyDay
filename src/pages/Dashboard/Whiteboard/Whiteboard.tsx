import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import DrawingTool from '../../../Components/drawingtool';
import axios from 'axios';
import TenorGif from './Giphy';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { Grid } from '@giphy/react-components';
import Sidebar from '../../../Components/Nav/Navbar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import DefaultButton from '../../../Components/Button/Button';
import Layout from '../../../Components/layout';
import 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  updateDoc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

type Sticker = {
  x: number;
  y: number;
  id: number;
  color: string;
  content: string;
  member: string[];
};

const Wrapper = styled.div`
  position: relative;
  max-width: 100%;
  flex: 1;
  height: 600px;
  display: flex;
  margin: 20px;
  background-color: 'transparent';
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type StickerType = {
  dragging: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
  isSticker: boolean;
};

const Sticker: any = styled.div<{
  dragging: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
  isSticker: boolean;
}>`
  position: absolute;
  top: ${(props) => props.offsetY}px;
  left: ${(props) => props.offsetX}px;
  background-color: ${({ color }) => color};
  cursor: ${(props) => (props.dragging ? 'grabbing' : 'grab')};
  width: 200px;
  height: 200px;
  border: 0px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: ${(props) =>
    props.isSticker ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const AddButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: lightgreen;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ColorButton = styled(DefaultButton)<{ color: string }>`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 15px;
  cursor: pointer;
  color: black;
  &:hover {
    opacity: 0.8;
  }
`;
const StickerInput = styled.input`
  font-size: 32px;
  border: none;
  height: auto;
  outline: none;
  margin-top: 10px;
  width: 90%;
  background-color: transparent;
  text-align: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  font-size: 18px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: rgba(128, 128, 128, 0.5);
  &:hover {
    color: black;
  }
`;

const LockButton = styled.button`
  position: absolute;
  top: 5px;
  right: 25px;
  padding: 5px;
  font-size: 18px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: rgba(128, 128, 128, 0.5);
  &:hover {
    color: black;
  }
`;

const HideButton = styled(DefaultButton)`
  margin-left: 30px;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const StickerRowWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 25px;
  bottom: 70px;
`;

const GifWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-wrap: wrap;
  width: auto;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const Container = styled.div`
  position: relative;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: row;
  margin-top: 80px;

  height: 100vh;

  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
`;

const Centered = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Results = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(128, 128, 128, 0.3);
  border-radius: 25px;
  max-width: 800px;
  z-index: 5;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  position: absolute;
  bottom: 0;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  width: 300px;
`;

const SearchButton = styled.button`
  background-color: #fff5c9;
  color: #3467a1;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #005a9e;
    color: #fff5c9;
  }
`;

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh');

export const Whiteboard = () => {
  const [stickers, setStickers] = useState(() => {
    const savedStickers = localStorage.getItem('stickers');
    return savedStickers ? JSON.parse(savedStickers) : [];
  });
  const [newStickerColor, setNewStickerColor] = useState<string>('yellow');
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [stickerText, setStickerText] = useState<string[]>(() => {
    const savedStickerText = localStorage.getItem('stickerText');
    return savedStickerText
      ? JSON.parse(savedStickerText)
      : Array(stickers.length).fill('');
  });
  const [image, setImage] = useState(null);
  const [gifUrl, setGifUrl] = useState<string>('');
  const [gif, setGif] = useState<IGif | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const [searchResults, setSearchResults] = useState<IGif[]>([]);
  const [locked, setLocked] = useState(false);
  const [lockedStickers, setLockedStickers] = useState(() =>
    Array(stickers.length).fill(false)
  );
  // <button onClick={() => voteSticker(name)}>Vote</button>;
  const [count, setCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    const { data } = await giphyFetch.search(searchTerm, { limit: 10 });
    setSearchResults(data.slice(0, 10));
    setShowResults(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setShowResults(false);
  };

  useEffect(() => {
    localStorage.setItem('stickers', JSON.stringify(stickers));
    localStorage.setItem('stickerText', JSON.stringify(stickerText));
  }, [stickers, stickerText]);

  useLayoutEffect(() => {
    const container = document.getElementById('Wrapper');
    const updateStickerPosition = async (
      id: number,
      newX: number,
      newY: number
    ) => {
      try {
        const familyDocRef = doc(
          db,
          'Family',
          'Nkl0MgxpE9B1ieOsOoJ9',
          'stickers',
          id.toString()
        );
        const docSnapshot = await getDoc(familyDocRef);

        if (docSnapshot.exists()) {
          const updatedSticker = { ...docSnapshot.data(), x: newX, y: newY };
          await updateDoc(familyDocRef, updatedSticker);
          console.log('Sticker position has been updated in Firestore!');
        }
      } catch (error) {
        console.error('Error updating sticker position in Firestore: ', error);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragging !== null) {
        const newX = e.clientX - offset.x - 100;
        const newY = e.clientY - offset.y - 180;
        console.log(
          'newX:',
          newX,
          'newY:',
          newY,
          'offset.x:',
          offset.x,
          'offset.y:',
          offset.y
        );
        updateStickerPosition(stickers[dragging].id, newX, newY);
        const newStickers = [...stickers];
        newStickers[dragging] = { ...newStickers[dragging], x: newX, y: newY };
        window.requestAnimationFrame(() => setStickers(newStickers));
      }
    };

    const onMouseUp = () => {
      setDragging(null);
      setOffset({ x: 0, y: 0 });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, offset, stickers]);

  const onStickerMouseDown = (id: number, e: React.MouseEvent) => {
    if (locked) return;
    setDragging(id);
    const index = stickers.findIndex((sticker: Sticker) => sticker.id === id);

    const rect = stickerRefs.current[index]?.getBoundingClientRect();
    console.log('rect:', rect);
    if (rect) {
      setOffset({
        x: e.clientX - (rect.left + window.pageXOffset),
        y: e.clientY - (rect.top + window.pageYOffset),
      });
    }
  };

  useEffect(() => {
    const fetchStickers = async () => {
      const stickers = await getStickers();
      console.log(stickers);
      setStickers(stickers);
    };
    fetchStickers();
  }, []);

  const getStickers = async () => {
    const familyDocRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'stickers'
    );
    const querySnapshot = await getDocs(familyDocRef);

    const stickersData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    console.log(stickersData);
    return stickersData;
  };

  const addSticker = async (
    color: string,
    isSticker: boolean,
    content: string
  ) => {
    const newSticker = {
      id: uuidv4(),
      x: 150,
      y: 0,
      content: content,
      color: color,
      member: 'Nina',
      isSticker: isSticker,
    };

    try {
      const familyDocRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'stickers',
        newSticker.id
      );
      await setDoc(familyDocRef, newSticker);
      console.log('Sticker has been added to Firestore!');
      setStickers([...stickers, newSticker]);
      setStickerText([...stickerText, '']);
    } catch (error) {
      console.error('Error adding sticker to Firestore: ', error);
    }
  };

  const addGif = async (color: string, isSticker: boolean) => {
    console.log(selectedGif);
    const gifUrl = selectedGif ? selectedGif.images.original.url : '';
    const newSticker = {
      id: uuidv4(),
      x: 150,
      y: 150,
      content: gifUrl,
      color: color,
      member: 'Nina',
      isSticker: isSticker,
    };

    try {
      const familyDocRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'stickers',
        newSticker.id
      );
      await setDoc(familyDocRef, newSticker);
      console.log('Sticker has been added to Firestore!');
      setStickers([...stickers, newSticker]);
      setStickerText([...stickerText, '']);
    } catch (error) {
      console.error('Error adding sticker to Firestore: ', error);
    }
  };

  const deleteSticker = async (id: number) => {
    console.log(id);
    console.log(stickers);

    try {
      const familyDocRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'stickers',
        stickers[id].id
      );
      await deleteDoc(familyDocRef);
      console.log('Sticker has been deleted from Firestore!');
      const newStickers = stickers.filter(
        (sticker: Sticker) => sticker.id !== stickers[id].id
      );
      setStickers(newStickers);
    } catch (error) {
      console.error('Error deleting sticker from Firestore: ', error);
    }
  };

  const handleLockClick = (index: number) => {
    const newLockedStickers = [...lockedStickers];
    newLockedStickers[index] = !newLockedStickers[index];
    setLockedStickers(newLockedStickers);
  };

  console.log(stickers);
  console.log(newStickerColor);

  //gifUrl = selectedGif ? selectedGif.images.original.url : '';

  return (
    <Layout>
      <Container>
        <Wrapper id="Wrapper">
          {/* <AddButton onClick={addSticker}>Add Sticker</AddButton> */}

          {stickers.map((sticker: any, index: number) => (
            <>
              <Sticker
                key={sticker.id}
                color={sticker.color}
                isSticker={sticker.isSticker}
                onMouseDown={
                  lockedStickers[index]
                    ? null
                    : (e: React.MouseEvent<HTMLDivElement>) =>
                        onStickerMouseDown(index, e)
                }
                ref={(el: any) => (stickerRefs.current[index] = el)}
                style={{
                  left: sticker.x - (dragging === index ? offset.x : 0),
                  top: sticker.y - (dragging === index ? offset.y : 0),
                }}
                locked={lockedStickers[index]}
              >
                <StickerInput
                  as="textarea"
                  rows={3}
                  value={stickerText[index]}
                  onChange={(e) => {
                    const newStickerText = [...stickerText];
                    newStickerText[index] = e.target.value;
                    setStickerText(newStickerText);

                    const stickerId = stickers[index].id;
                    const familyDocRef = doc(
                      db,
                      'Family',
                      'Nkl0MgxpE9B1ieOsOoJ9',
                      'stickers',
                      stickerId
                    );
                    updateDoc(familyDocRef, { content: e.target.value })
                      .then(() =>
                        console.log(
                          'Sticker text has been updated in Firestore!'
                        )
                      )
                      .catch((error) =>
                        console.error(
                          'Error updating sticker text in Firestore: ',
                          error
                        )
                      );
                  }}
                  disabled={lockedStickers[index]}
                />
                {sticker.content !== 'New note' && (
                  <>
                    <img
                      src={sticker.content}
                      alt=""
                      style={{
                        borderRadius: '20px',
                        width: '100%',
                        height: '100%',
                      }}
                      draggable="false"
                    />
                  </>
                )}
                <DeleteButton onClick={() => deleteSticker(index)}>
                  <FontAwesomeIcon icon={faX} />
                </DeleteButton>
                <LockButton onClick={() => handleLockClick(index)}>
                  {lockedStickers[index] ? (
                    <FontAwesomeIcon icon={faLock} />
                  ) : (
                    <FontAwesomeIcon icon={faLockOpen} />
                  )}
                </LockButton>
              </Sticker>
            </>
          ))}
          <DrawingTool></DrawingTool>
          <StickerRowWrap>
            <ColorButton
              color="white"
              onClick={() => addSticker('transparent', false, 'New note')}
            >
              文字
            </ColorButton>
            <ColorButton
              color="#FFF9C4"
              onClick={() => addSticker('#FFF9C4', true, 'New note')}
            ></ColorButton>
            <ColorButton
              color="#EF9A9A"
              onClick={() => addSticker('#EF9A9A', true, 'New note')}
            ></ColorButton>
            <ColorButton
              color="#81D4FA"
              onClick={() => addSticker('#81D4FA', true, 'New note')}
            ></ColorButton>
            <ColorButton
              color="#A5D6A7"
              onClick={() => addSticker('#A5D6A7', true, 'New note')}
            ></ColorButton>
            <ColorButton color="grey" onClick={() => setStickers([])}>
              Clear
            </ColorButton>
          </StickerRowWrap>
          <SearchContainer>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="搜尋GIF"
            />
            <SearchButton onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </SearchButton>
          </SearchContainer>

          {showResults && (
            <Results>
              <GifWrap>
                <div>
                  {searchResults.map((result) => (
                    <img
                      key={result.id}
                      src={result.images.original.url}
                      alt={result.title}
                      style={{
                        borderRadius: '25px',
                        width: '120px',
                        height: '120px',
                        margin: '5px',
                        border:
                          selectedGif && selectedGif.id === result.id
                            ? '5px solid #fff5c9'
                            : 'none',
                        boxShadow:
                          selectedGif && selectedGif.id === result.id
                            ? '0px 0px 10px #3467a1'
                            : 'none',
                      }}
                      onClick={() => setSelectedGif(result)}
                    />
                  ))}
                </div>

                <RowWrap>
                  <ColorButton
                    color="#fff5c9"
                    onClick={() => setShowResults(false)}
                  >
                    <FontAwesomeIcon icon={faEyeSlash} />
                  </ColorButton>
                  <ColorButton
                    color="#fff5c9"
                    disabled={!selectedGif}
                    onClick={() => {
                      if (selectedGif) {
                        addSticker(
                          'transparent',
                          false,
                          selectedGif.images.original.url
                        );
                      }
                      setShowResults(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </ColorButton>
                </RowWrap>
              </GifWrap>
            </Results>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};
export default Whiteboard;
