import { useEffect, useState } from 'react';
import styled from 'styled-components';
import React from 'react';
const SlideshowContainer = styled.div`
  position: relative;
  height: 200px;
  width: 233px;
  overflow: hidden;
`;

const SlideshowImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  opacity: 0;
  transition: opacity 2s ease-in-out;

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

const Slideshow = ({ interval = 3000, photos }: SlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((activeIndex + 1) % photos.length);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeIndex, interval, photos]);

  return (
    <div>
      <SlideshowContainer>
        {photos.map((photo, index) => (
          <StyledLink href="/gallery">
            <SlideshowImage
              key={index}
              src={photo.url}
              alt={`Slide ${index}`}
              className={index === activeIndex ? 'active' : ''}
            />
          </StyledLink>
        ))}
      </SlideshowContainer>
    </div>
  );
};

const StyledLink = styled.a`
  text-decoration: none;
`;
export default Slideshow;
