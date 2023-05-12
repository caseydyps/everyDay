import React from 'react';
import DefaultButton from '../../../Components/Button/Button';
import styled from 'styled-components/macro';
import {
  faEyeSlash,
  faPlusCircle,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Results = ({
  searchResults,
  selectedGif,
  setSelectedGif,
  setShowResults,
  addSticker,
}) => {
  return (
    <ResultsContainer>
      {searchResults.map((result) => (
        <GifImage
          key={result.id}
          src={result.images.original.url}
          alt={result.title}
          selected={selectedGif && selectedGif.id === result.id}
          onClick={() => setSelectedGif(result)}
        />
      ))}
      <RowWrap>
        <ColorButton color="#fff5c9" onClick={() => setShowResults(false)}>
          <FontAwesomeIcon icon={faEyeSlash} />
        </ColorButton>
        <ColorButton
          color="#fff5c9"
          disabled={!selectedGif}
          onClick={() => {
            if (selectedGif) {
              addSticker('transparent', false, selectedGif.images.original.url);
            }
            setShowResults(false);
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </ColorButton>
      </RowWrap>
    </ResultsContainer>
  );
};

const GifImage = styled.img`
  border-radius: 25px;
  width: 110px;
  height: 110px;
  margin: 5px;
  border: ${(props) => (props.selected ? '5px solid #fff5c9' : 'none')};
  box-shadow: ${(props) => (props.selected ? '0px 0px 10px #3467a1' : 'none')};
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

const ResultsContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(128, 128, 128, 0.3);
  border-radius: 25px;
  max-width: 900px;
  z-index: 5;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

export default Results;
