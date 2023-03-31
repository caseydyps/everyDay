import React from 'react';
import { createGlobalStyle } from 'styled-components';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Whiteboard from './pages/Dashboard/Whiteboard';
import SmartInput from './pages/AI/SmartInput/SmartInput';
import Settings from './pages/Setting/Setting';
import styled from 'styled-components';
const Content = styled.div`
  width: 100vw;
  height: 1000px;
  border: 2px solid black;
`;

function App() {
  return (
    <>
      <Header />
      <Content>
        <SmartInput />
        <Whiteboard />
        <Dashboard />
        {/* <Settings /> */}
      </Content>

      <Footer />
    </>
  );
}

export default App;
