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

interface BannerProps {
  title: string;
}

const Banner = ({ title }: BannerProps) => {
  return (
    <BannerWrap>
      <Wrap>
        <Image src={BannerImage} alt="" />
      </Wrap>
      <Title>{title}</Title>
    </BannerWrap>
  );
};

export default Banner;
