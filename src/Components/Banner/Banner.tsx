import styled from 'styled-components/macro';

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

  //border: 3px solid white;
  position: relative; /* Added to set stacking context */
  background: transparent;
  display: flex;
  //box-shadow: 0 0 100px rgba(0, 0, 0, 0.9);
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0% auto;

  /* margin-top: 60px; */
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