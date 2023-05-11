import { GiphyFetch } from '@giphy/js-fetch-api';
import 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import DefaultButton, { ThreeDButton } from '../../../Components/Button/Button';
import UserAuthData from '../../../Components/Login/Auth';
import DrawingTool from '../../../Components/drawingtoolMini';
import { db } from '../../../config/firebase.config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  //border: 3px solid red;
`;

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
  width: 120px;
  height: 120px;
  border: 0px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`;

const StickerInput = styled.input`
  font-size: 20px;
  border: none;
  height: auto;
  outline: none;
  margin-top: 5px;
  width: 95%;
  background-color: transparent;
  text-align: center;
`;
export const Whiteboard = () => {
  const [newStickerColor, setNewStickerColor] = useState<string>('yellow');
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stickerText, setStickerText] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [lockedStickers, setLockedStickers] = useState(() =>
    Array(stickers.length).fill(false)
  );
  const { familyId } = UserAuthData();

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
          familyId,
          'stickers',
          id.toString()
        );
        const docSnapshot = await getDoc(familyDocRef);

        if (docSnapshot.exists()) {
          const updatedSticker = { ...docSnapshot.data(), x: newX, y: newY };
          await updateDoc(familyDocRef, updatedSticker);
        }
      } catch (error) {
        console.error('Error updating sticker position in Firestore: ', error);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragging !== null) {
        const newX = e.clientX - offset.x - 200;
        const newY = e.clientY - offset.y - 180;
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

  useEffect(() => {
    const fetchStickers = async () => {
      const stickers: any = await getStickers();
      setStickers(stickers);
    };
    fetchStickers();
  }, [familyId]);

  const getStickers = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'stickers');
    const querySnapshot = await getDocs(familyDocRef);

    const stickersData: any = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setStickers(stickersData);
    setStickerText(stickersData.map((sticker: Sticker) => sticker.content));
    return stickersData;
  };

  return (
    <Wrapper id="Wrapper">
      {stickers.map((sticker: any, index: number) => (
        <>
          <Sticker
            key={sticker.id}
            color={sticker.color}
            isSticker={sticker.isSticker}
            draggable="false"
            ref={(el: any) => (stickerRefs.current[index] = el)}
            style={{
              left: sticker.x - 385,
              top: sticker.y - 220,
            }}
            locked={lockedStickers[index]}
          >
            <StickerInput
              as="textarea"
              rows={3}
              value={stickerText[index]}
              disabled={lockedStickers[index]}
            />
            {sticker.isSticker !== true && (
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
          </Sticker>
        </>
      ))}
      <DrawingTool></DrawingTool>
    </Wrapper>
  );
};
export default Whiteboard;
