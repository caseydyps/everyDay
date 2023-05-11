import 'firebase/firestore';
import styled from 'styled-components/macro';
import Banner from '../../../Components/Banner/Banner';
import SideNav from '../../../Components/Nav/SideNav';
import { ChatToggle } from '../../../Components/Chat/ChatToggle';
import Suggestion from './Suggestion';
import React from 'react';
const AI = () => {
  return (
    <Container>
      <SideNav />
      <Wrapper>
        <Banner title={'AI'} subTitle="Hey AI," />
        <ChatToggle />
        <Section>
          <AiRowWrap>
            <Suggestion />
          </AiRowWrap>
        </Section>
      </Wrapper>
    </Container>
  );
};
const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 250px;
  padding-top: 0px;
  padding-bottom: 20px;
  background: transparent;
  max-width: 100vw;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const AiRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  align-items: center;
  width: 100%;
  height: 370px;
`;
export default AI;
