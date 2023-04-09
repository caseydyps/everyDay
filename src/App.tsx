import React from 'react';
import { createGlobalStyle } from 'styled-components';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Whiteboard from './pages/Dashboard/Whiteboard/Whiteboard';
import SmartInput from './pages/AI/SmartInput';
import Suggestion from './pages/AI/Suggestion';
import Settings from './pages/Family/Family';
import styled from 'styled-components';
import Sidebar from './Components/SideBar/SideBar';
const Content = styled.div`
  width: auto;

  border: 2px solid black;
`;

const Wrap = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: row;
`;

function App() {
  return (
    <Wrap>
      <Sidebar />
      {/* <Header /> */}
      <Content>
        <SmartInput />
        <Suggestion />
        <Whiteboard />
        <Dashboard />
        {/* <Settings /> */}
      </Content>

      {/* <Footer /> */}
    </Wrap>
  );
}

export default App;
