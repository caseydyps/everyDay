import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './config/Context/authContext';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components/macro';
import './App.css';
import Footer from './Components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import Whiteboard from './pages/Dashboard/Whiteboard/Whiteboard';
import SmartInput from './pages/AI/SmartInput';
import Suggestion from './pages/AI/Suggestion';
import Settings from './pages/Family/FamilyForm';
import Navbar from './Components/Nav/Navbar';
import SideNav from './Components/Nav/SideNav';
import { AuthContextProvider } from './config/Context/authContext';
import { GlobalStyle } from './theme';
import Layout from './Components/layout';

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
  //const [isSideNavOpen, setIsSideNavOpen] = useState(false);
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
