import Chat from './Chat';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components/macro';
import Banner from '../../Components/Banner/Banner';
import SideNav from '../../Components/Nav/SideNav';
import React from 'react';
function ChatApp() {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <SideNav></SideNav>
      <CenterWrapper>
        <Banner title="Chat" subTitle="Family Time, Anytime"></Banner>
        {user ? <Chat /> : null}
      </CenterWrapper>
    </Container>
  );
}

const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
`;

export default ChatApp;
