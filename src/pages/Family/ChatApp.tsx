import React from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import SmartInput from '../AI/SmartInput';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from '../../Components/layout';
import styled from 'styled-components/macro';
const CenterWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the child element horizontally */
  align-items: center; /* Center the child element vertically */
  margin-top: 20px;
  flex-direction: column;
  height: 100vh;
`;

function ChatApp() {
  const [user] = useAuthState(auth);
  //  console.log(user)
  return (
    <Layout>
      <CenterWrapper>
        {/* Navbar */}
        <Navbar />
        {user ? <Chat /> : null}
      </CenterWrapper>
    </Layout>
  );
}

export default ChatApp;
