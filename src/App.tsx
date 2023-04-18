import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './config/Context/authContext';
import { createGlobalStyle } from 'styled-components';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Whiteboard from './pages/Dashboard/Whiteboard/Whiteboard';
import SmartInput from './pages/AI/SmartInput';
import Suggestion from './pages/AI/Suggestion';
import Settings from './pages/Family/FamilyForm';
import styled from 'styled-components';
import Sidebar from './Components/Nav/Navbar';
import { AuthContextProvider } from './config/Context/authContext';
import { GlobalStyle } from './theme';

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
    <>
      <GlobalStyle />
      <AuthContextProvider>
        <Sidebar />
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
