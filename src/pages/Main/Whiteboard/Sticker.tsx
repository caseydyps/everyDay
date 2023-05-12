import React from 'react';
import styled from 'styled-components/macro';
import { db } from '../../../config/firebase.config';
import { doc } from 'firebase/firestore';
import {
  faCircleInfo,
  faEyeSlash,
  faLock,
  faLockOpen,
  faMagnifyingGlass,
  faPlusCircle,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StickerItem = ({
  sticker,
  index,
  stickerRefs,
  dragging,
  offset,
  stickerText,
  setStickerText,
  familyId,
  updateDoc,
  lockedStickers,
  onStickerMouseDown,
  deleteSticker,
  handleLockClick,
}) => {
  const handleInputChange = (e) => {
    const newStickerText = [...stickerText];
    newStickerText[index] = e.target.value;
    setStickerText(newStickerText);
    const stickerId = sticker.id;
    const familyDocRef = doc(db, 'Family', familyId, 'stickers', stickerId);
    updateDoc(familyDocRef, { content: e.target.value })
      .then(() => console.log('Sticker text has been updated in Firestore!'))
      .catch((error) =>
        console.error('Error updating sticker text in Firestore: ', error)
      );
  };

  return (
    <Sticker
      key={sticker.id}
      color={sticker.color}
      isSticker={sticker.isSticker}
      onMouseDown={
        lockedStickers[index] ? null : (e) => onStickerMouseDown(index, e)
      }
      ref={(el) => (stickerRefs.current[index] = el)}
      locked={lockedStickers[index]}
      left={sticker.x - (dragging === index ? offset.x : 0)}
      top={sticker.y - (dragging === index ? offset.y : 0)}
    >
      <StickerInput
        as="textarea"
        rows={3}
        value={stickerText[index]}
        onChange={handleInputChange}
        disabled={lockedStickers[index]}
      />
      {sticker.isSticker !== true && (
        <StickerImage src={sticker.content} alt="" draggable="false" />
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
  );
};

const StickerImage = styled.img`
  border-radius: 20px;
  width: 100%;
  height: 100%;
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
  color: transparent;
  &:hover {
    color: #414141;
  }
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

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  font-size: 18px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: transparent;
  &:hover {
    color: #414141;
  }
`;

const Sticker: any = styled.div<{
  dragging: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
  isSticker: boolean;
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
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

export default StickerItem;
