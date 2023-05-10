import { useEffect, useState } from 'react';
import styled from 'styled-components';
import React from 'react';
const SlideshowContainer = styled.div`
  position: relative;
  height: 320px;
  width: 320px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  //border: 1px solid #d7dde2;
`;

const LargerViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LargerViewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const SlideshowImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 322px;
  width: 322px;
  border-radius: 10px;
  object-fit: cover;

  opacity: 0;
  transition: opacity 2s ease-in-out;

  &.active {
    opacity: 1;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 10px;
  overflow-x: auto;
  width: 320px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Wrap = styled.div``;

const ThumbnailImage = styled.img`
  height: 70px;
  min-width: 70px;
  object-fit: cover;
  margin: 0 5px;
  opacity: 0.5;
  border-radius: 10px;
  transition: opacity 0.5s ease-in-out;

  &.active {
    opacity: 1;
  }
`;

type Photo = {
  src: string;
  alt: string;
  url: string;
};

type SlideshowProps = {
  interval?: number;
  photos: Photo[];
};

const Slideshow = ({ interval = 2000, photos }: SlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((activeIndex + 1) % photos.length);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeIndex, interval, photos]);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showLargerView, setShowLargerView] = useState(false);

  const handleImageClick = () => {
    setShowLargerView(true);
  };

  return (
    <Wrap>
      <SlideshowContainer>
        {photos.map((photo, index) => (
          <SlideshowImage
            key={index}
            src={photo.url}
            alt={`Slide ${index}`}
            className={index === activeIndex ? 'active' : ''}
            style={{ width: '320px', height: '320px' }}
          />
        ))}
      </SlideshowContainer>
      <ThumbnailContainer
        onMouseEnter={() => setShowSlideshow(true)}
        onMouseLeave={() => setShowSlideshow(false)}
      >
        {photos.map((photo, index) => (
          <ThumbnailImage
            key={index}
            src={photo.url}
            alt={`Thumbnail ${index}`}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </ThumbnailContainer>
      {showLargerView && (
        <LargerViewContainer>
          <LargerViewImage
            src={photos[activeIndex].url}
            alt={`Larger view of slide ${activeIndex}`}
          />
          <CloseButton onClick={() => setShowLargerView(false)}>
            Close
          </CloseButton>
        </LargerViewContainer>
      )}
    </Wrap>
  );
};

export default Slideshow;
