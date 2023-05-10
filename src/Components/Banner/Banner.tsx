import styled from 'styled-components/macro';
import React from 'react';
const Banner = ({ subTitle }: BannerProps) => {
  return (
    <BannerContainer>
      <BannerSubTitle>{subTitle}</BannerSubTitle>
    </BannerContainer>
  );
};

export default Banner;

interface BannerProps {
  title: string;
  subTitle: string;
}

const BannerContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0% auto;
`;

const BannerSubTitle = styled.h1`
  color: #5981b0;
  font-family: 'Braah One';
  font-weight: bold;
  font-size: 48px;
  width: 800px;
  text-align: center;
  margin-top: 90px;
  z-index: 1;
`;
