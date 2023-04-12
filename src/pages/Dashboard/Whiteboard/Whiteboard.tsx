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
import Voting from './Voting';
import Sidebar from '../../../Components/SideBar/SideBar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
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
//import './piece.scss';

type Sticker = {
  x: number;
  y: number;
};

const Wrapper = styled.div`
  position: relative;
  width: 1500px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Sticker = styled.div<{
  dragging: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
}>`
  position: absolute;
  top: ${(props) => props.offsetY}px;
  left: ${(props) => props.offsetX}px;
  background-color: ${({ color }) => color};
  cursor: ${(props) => (props.dragging ? 'grabbing' : 'grab')};
  width: 250px;
  height: 250px;
  border: 0px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
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

const ColorButton = styled.button<{ color: string }>`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 5px;
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
  width: 100%;
  background-color: transparent;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const LockButton = styled.button`
  position: absolute;
  top: 5px;
  right: 15px;
  padding: 5px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  position: relative;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: row;
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
        const newX = e.clientX - offset.x - 344;
        const newY = e.clientY - offset.y;
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
    const index = stickers.findIndex((sticker) => sticker.id === id);

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

  const addSticker = async (color: string) => {
    const newSticker = {
      id: uuidv4(),
      x: 150,
      y: 150,
      content: 'New note',
      color: color,
      member: 'Nina',
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

  const addGif = async (color) => {
    const gifUrl = selectedGif.images.original.url;
    const newSticker = {
      id: uuidv4(),
      x: 150,
      y: 150,
      content: gifUrl,
      color: color,
      member: 'Nina',
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

  const deleteSticker = async (id: string) => {
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
        (sticker) => sticker.id !== stickers[id].id
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

  return (
    <Container>
      <Sidebar />
      <Wrapper id="Wrapper">
        {stickers.map((sticker, index) => (
          <Sticker
            key={sticker.id}
            color={sticker.color}
            onMouseDown={
              lockedStickers[index] ? null : (e) => onStickerMouseDown(index, e)
            }
            ref={(el) => (stickerRefs.current[index] = el)}
            style={{
              left: sticker.x - (dragging === index ? offset.x : 0),
              top: sticker.y - (dragging === index ? offset.y : 0),
            }}
            locked={lockedStickers[index]}
          >
            <StickerInput
              type="text"
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
                    console.log('Sticker text has been updated in Firestore!')
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
              <img
                src={sticker.content}
                alt=""
                style={{ width: '100%', height: '100%' }}
              />
            )}
            <DeleteButton onClick={() => deleteSticker(index)}>X</DeleteButton>
            <LockButton onClick={() => handleLockClick(index)}>
              {lockedStickers[index] ? 'Unlock' : 'Lock'}
            </LockButton>
          </Sticker>
        ))}
        {/* <AddButton onClick={addSticker}>Add Sticker</AddButton> */}

        <div>
          <input type="text" value={searchTerm} onChange={handleInputChange} />
          <button onClick={handleSearch}>Search</button>
        </div>

        <h4>Searched GIF:</h4>

        {showResults && (
          <>
            <div>
              {searchResults.map((result) => (
                <img
                  key={result.id}
                  src={result.images.original.url}
                  alt={result.title}
                  style={{ width: '150px', height: '150px' }}
                  onClick={() => setSelectedGif(result)}
                />
              ))}
            </div>
            <button onClick={() => setShowResults(false)}>Hide Results</button>
          </>
        )}
        <RowWrap>
          <ColorButton onClick={() => addGif('transparent')}>
            Add Gif
          </ColorButton>
          <ColorButton onClick={() => addSticker('#FFF9C4')}>
            Add Yellow Sticker
          </ColorButton>
          <ColorButton onClick={() => addSticker('#EF9A9A')}>
            Add Red Sticker
          </ColorButton>
          <ColorButton onClick={() => addSticker('#81D4FA')}>
            Add Blue Sticker
          </ColorButton>
          <ColorButton onClick={() => addSticker('#A5D6A7')}>
            Add Blue Sticker
          </ColorButton>
          <ColorButton onClick={() => setStickers([])}>Clear</ColorButton>
          <Voting />
        </RowWrap>

        <DrawingTool />
      </Wrapper>
    </Container>
  );
};
export default Whiteboard;
