import { keyframes } from 'styled-components';
import styled from 'styled-components/macro';
import Milestone from './time.png';
import Calendar from './calendar.png';
import Todo from './todo.png';
import Gallery from './gallery.png';
import Ai from './ai.png';
import Chat from './chat.png';
import Sticker from './sticker.png';

const StyledAll = styled.div`
  * {
    border: 2px solid black;
  }
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

const BannerTitle = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  //border: 3px solid white;
  padding: 20px;
  font-size: 48px;
  text-align: center;
  z-index: 2; /* Increased z-index value */
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

const BannerPic = ({ picUrl, maxWidth, maxHeight }) => {
  const BannerImg = styled.img`
    position: absolute;
    width: auto;
    height: 250px;
    object-fit: cover;
    right: 50px;
  `;
  return <BannerImg src={picUrl} alt="Banner" />;
};

const Banner = ({ title, subTitle }: BannerProps) => {
  let picUrl;
  if (title === 'Todo') {
    picUrl = Todo;
  } else if (title === 'Calendar') {
    picUrl = Calendar;
  } else if (title === 'Gallery') {
    picUrl = Gallery;
  } else if (title === 'AI') {
    picUrl = Ai;
  } else if (title === 'Time Machine') {
    picUrl = Milestone;
  } else if (title === `Stick'n Draw`) {
    picUrl = Sticker;
  } else if (title === 'Chat') {
    picUrl = Chat;
  } else {
    picUrl = './default.png';
  }
  return (
    <BannerContainer>
      {/* <Gradient /> */}
      {/* <BannerTitle>{title}</BannerTitle> */}
      <BannerSubTitle>{subTitle}</BannerSubTitle>
    </BannerContainer>
  );
};

export default Banner;
