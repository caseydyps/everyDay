import { keyframes } from 'styled-components';
import styled from 'styled-components';
import Milestone from './7.png';
import BannerImage from './banner.png';
import Dashboard from './6.png';
const Wrap = styled.div`
  width: 100vw;
  height: 300px;
  margin-top: 30px;
  margin-bottom: 100px;
  border: 3px solid #red;
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 24px;
  color: #3467a1;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const BannerWrap = styled.div`
  position: relative;
`;

const Title = styled.div`
  position: absolute;
  top: 32%;
  right: 37%;
  font-size: 72px;
`;

const BannerContainer = styled.div`
  width: 100vw;
  height: 500px;
  position: relative; /* Added to set stacking context */
  background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(
      -45deg,
      #e5f2f2,
      #e6f2ff,
      #f2e5e6,
      #e5f2f2,
      #f2e5e6,
      #f4f4f4
    );
  display: flex;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.9);
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
`;

const BannerTitle = styled.h1`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  border: 3px solid white;
  padding: 20px;

  z-index: 2; /* Increased z-index value */
`;

const BannerSubTitle = styled.h2`
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
  text-align: center;
  z-index: 1;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Gradient = styled.div`
  --size: 50px;
  --speed: 20s;
  --easing: cubic-bezier(0.8, 0.2, 0.2, 0.8);

  width: 600px;
  height: 300px;
  filter: blur(calc(var(--size) / 5));
  background-image: linear-gradient(
    hsl(158, 82%, 57%, 85%),
    hsl(252, 82%, 57%)
  );

  animation: ${rotate} var(--speed) var(--easing) alternate infinite;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

  @media (min-width: 720px) {
    --size: 500px;
  }
`;

interface BannerProps {
  title: string;
  subTitle: string;
}

const Banner = ({ title, subTitle }: BannerProps) => {
  return (
    <BannerContainer>
      <Gradient />
      <BannerTitle>{title}</BannerTitle>
      <BannerSubTitle>{subTitle}</BannerSubTitle>
    </BannerContainer>
  );
};

export default Banner;
