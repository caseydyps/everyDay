import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import React from 'react';
const LoadingAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

 

  return (
    <Container>
      {showAnimation ? (
        <LoadingBar>
          <BarWrapper>
            <BarAnimation />
          </BarWrapper>
        </LoadingBar>
      ) : (
        <div />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingBar = styled.div`
  width: 100px;
  height: 10px;
  background-color: #ddd;
  border-radius: 10px;
`;

const BarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
`;

const barAnimation = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const BarAnimation = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: #5981b0;
  animation: ${barAnimation} 2s ease-in-out infinite;
`;

export default LoadingAnimation;
