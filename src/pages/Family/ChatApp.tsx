import React from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import SmartInput from '../AI/SmartInput';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from '../../Components/layout';
import styled from 'styled-components/macro';
import Banner from '../../Components/Banner/Banner';
import SideNav from '../../Components/Nav/SideNav';
const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  //border: 3px solid red;
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

  //border: 3px solid gold;
`;

function ChatApp() {
  const [user] = useAuthState(auth);
  //  console.log(user)
  return (
    <Container>
      <SideNav></SideNav>
      <CenterWrapper>
        {/* Navbar */}
        <Banner title="Chat" subTitle="Family Time, Anytime"></Banner>
        {/* <Navbar /> */}
        {user ? <Chat /> : null}
      </CenterWrapper>
    </Container>
  );
}

export default ChatApp;
