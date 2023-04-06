import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import DrawingTool from '../../../Components/drawingtool';
import axios from 'axios';
import TenorGif from './Giphy';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { Grid } from '@giphy/react-components';
import Voting from './Voting';

//import './piece.scss';

type Sticker = {
  x: number;
  y: number;
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
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

  const handleSearch = async () => {
    const { data } = await giphyFetch.search(searchTerm, { limit: 10 });
    setSearchResults(data.slice(0, 10));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem('stickers', JSON.stringify(stickers));
    localStorage.setItem('stickerText', JSON.stringify(stickerText));
  }, [stickers, stickerText]);

  useLayoutEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging !== null) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        const newStickers = [...stickers];
        newStickers[dragging] = { ...newStickers[dragging], x: newX, y: newY };
        setStickers(newStickers);
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
    if (rect) {
      const offsetX = isNaN(rect.offsetLeft) ? 0 : e.clientX - rect.offsetLeft;
      const offsetY = isNaN(rect.offsetTop) ? 0 : e.clientY - rect.offsetTop;
      setOffset({ x: offsetX, y: offsetY });
    }
  };

  const addSticker = (color) => {
    const newSticker = {
      id: Date.now(),
      x: 150,
      y: 150,
      content: 'New note',
      color: color,
    };

    setStickers([...stickers, newSticker]);
    setStickerText([...stickerText, '']);
  };

  const addGif = async (color) => {
    const gifUrl = selectedGif.images.original.url;

    const newSticker = {
      id: Date.now(),
      x: 150,
      y: 150,
      content: gifUrl,
      color: color,
    };

    setStickers([...stickers, newSticker]);
    setStickerText([...stickerText, '']);
  };

  const addVote = async (color) => {
    const gifUrl = selectedGif.images.original.url;

    const newSticker = {
      id: Date.now(),
      x: 150,
      y: 150,
      content: gifUrl,
      color: color,
    };

    setStickers([...stickers, newSticker]);
    setStickerText([...stickerText, '']);
  };

  const deleteSticker = (index: number) => {
    const newStickers = [...stickers];
    newStickers.splice(index, 1);
    setStickers(newStickers);

    const newStickerText = [...stickerText];
    newStickerText.splice(index, 1);
    setStickerText(newStickerText);
  };

  const handleLockClick = (index) => {
    const newLockedStickers = [...lockedStickers];
    newLockedStickers[index] = !newLockedStickers[index];
    setLockedStickers(newLockedStickers);
  };

  console.log(stickers);
  console.log(newStickerColor);

  return (
    <Wrapper>
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
      <RowWrap>
        <ColorButton onClick={() => addGif('transparent')}>Add Gif</ColorButton>
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
      </RowWrap>
      <div>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h4>Selected GIF:</h4>
      <h4>Searched GIF:</h4>
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((result) => (
            <img
              key={result.id}
              src={result.images.original.url}
              alt={result.title}
              style={{ width: '200px', height: '200px' }}
              onClick={() => setSelectedGif(result)}
            />
          ))}
        </div>
      )}
      <Voting />
      <DrawingTool />
    </Wrapper>
  );
};
export default Whiteboard;
