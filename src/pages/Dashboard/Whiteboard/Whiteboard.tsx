import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import DrawingTool from '../../../Components/drawingtool';

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
  font-size: 16px;
  border: none;

  outline: none;
  margin-top: 10px;
  width: 100%;
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

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Whiteboard = () => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [newStickerColor, setNewStickerColor] = useState<string>('yellow');
  const stickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [stickerText, setStickerText] = useState<string[]>(
    Array(stickers.length).fill('')
  );

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

  const deleteSticker = (index: number) => {
    const newStickers = [...stickers];
    newStickers.splice(index, 1);
    setStickers(newStickers);

    const newStickerText = [...stickerText];
    newStickerText.splice(index, 1);
    setStickerText(newStickerText);
  };

  // //change sticker color
  // const changeStickerColor = (index: number, color: string) => {
  //   const newStickers = [...stickers];
  //   newStickers[index] = {
  //     ...newStickers[index],
  //     color: color,
  //   };
  //   setStickers(newStickers);
  // };
  console.log(stickers);
  console.log(newStickerColor);

  return (
    <Wrapper>
      {stickers.map((sticker, index) => (
        <Sticker
          key={sticker.id}
          color={sticker.color}
          onMouseDown={(e) => onStickerMouseDown(index, e)}
          ref={(el) => (stickerRefs.current[index] = el)}
          style={{
            left: sticker.x - (dragging === index ? offset.x : 0),
            top: sticker.y - (dragging === index ? offset.y : 0),
          }}
        >
          <StickerInput
            type="text"
            value={stickerText[index]}
            onChange={(e) => {
              const newStickerText = [...stickerText];
              newStickerText[index] = e.target.value;
              setStickerText(newStickerText);
            }}
          />
          <DeleteButton onClick={() => deleteSticker(index)}>X</DeleteButton>
        </Sticker>
      ))}
      {/* <AddButton onClick={addSticker}>Add Sticker</AddButton> */}
      <RowWrap>
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

      <DrawingTool />
    </Wrapper>
  );
};
export default Whiteboard;
