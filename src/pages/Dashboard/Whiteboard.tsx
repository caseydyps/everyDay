import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components/macro';
//import './piece.scss';

type Sticker = {
  x: number;
  y: number;
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Sticker = styled.div<{
  dragging: boolean;
  offsetX: number;
  offsetY: number;
}>`
  position: absolute;
  top: ${(props) => props.offsetY}px;
  left: ${(props) => props.offsetX}px;
  background-color: ${(props) => (props.dragging ? 'lightblue' : 'yellow')};
  cursor: ${(props) => (props.dragging ? 'grabbing' : 'grab')};
  width: 150px;
  height: 100px;
  border: 2px solid black;
  border-radius: 5px;
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

export const Whiteboard = () => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging !== null) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        const newStickers = [...stickers];
        newStickers[dragging] = { x: newX, y: newY };
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
    setDragging(id);
    const index = stickers.findIndex((sticker) => sticker.id === id);
    const rect = stickerRefs.current[index]?.getBoundingClientRect();
    console.log('rect' + rect);
    if (rect) {
      console.log('here!');
      const offsetX = isNaN(rect.offsetLeft) ? 0 : e.clientX - rect.offsetLeft;
      const offsetY = isNaN(rect.offsetTop) ? 0 : e.clientY - rect.offsetTop;
      setOffset({ x: offsetX, y: offsetY });
    }
  };

  const addSticker = () => {
    const newSticker = { id: Date.now(), x: 150, y: 150 };
    setStickers([...stickers, newSticker]);
  };

  return (
    <Wrapper>
      {stickers.map((position, index) => (
        <Sticker
          key={index}
          className="Piece"
          onMouseDown={(e) => onStickerMouseDown(index, e)}
          ref={(el) => (stickerRefs.current[index] = el)}
          style={{
            left: position.x - (dragging === index ? offset.x : 0),
            top: position.y - (dragging === index ? offset.y : 0),
          }}
        >
          便條紙 {index + 1}
        </Sticker>
      ))}
      <AddButton onClick={addSticker}>Add Sticker</AddButton>
    </Wrapper>
  );
};

export default Whiteboard;
