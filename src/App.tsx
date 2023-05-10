import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components/macro';
import './App.css';
import Navbar from './Components/Nav/Navbar';
import { AuthContextProvider } from './config/Context/authContext';
import { GlobalStyle } from './theme';

const Wrap = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: row;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthContextProvider>
        <Navbar />
        <Wrap>
          <Outlet />
        </Wrap>
      </AuthContextProvider>
    </>
  );
}

export default App;
