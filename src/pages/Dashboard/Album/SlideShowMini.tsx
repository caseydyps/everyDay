import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SlideshowContainer = styled.div`
  position: relative;
  height: 300px;
  width: 300px;
  overflow: hidden;
  margin: 5px 5px;
`;

const SlideshowImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 250px;
  width: 250px;
  border-radius: 10px;
  object-fit: cover;

  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.active {
    opacity: 1;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ThumbnailImage = styled.img`
  height: 70px;
  width: 70px;
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

  return (
    <div>
      <SlideshowContainer>
        {photos.map((photo, index) => (
          <SlideshowImage
            key={index}
            src={photo.url}
            alt={`Slide ${index}`}
            className={index === activeIndex ? 'active' : ''}
            style={{ width: '300px', height: '300px' }}
          />
        ))}
      </SlideshowContainer>
      {/* <ThumbnailContainer
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
      </ThumbnailContainer> */}
    </div>
  );
};

export default Slideshow;
