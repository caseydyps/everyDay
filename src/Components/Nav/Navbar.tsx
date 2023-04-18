import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';
import SignIn from '../Login/SignIn';
import LogOut from '../Login/LogOut';
import logo from './logo.png';
import { color, backgroundColor } from '../../theme';
const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <NavbarWrapper>
      <Nav>
        <Logo to="/" />
        <NavList>
          <NavItem>
            <NavLink to="/welcome">Welcome</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar">Calendar</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/todo">To-Do</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/ai">AI</NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/milestone">Milestone</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/family">Family</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/whiteboard">Whiteboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gallery">Gallery</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/chat">Chat</NavLink>
          </NavItem>
        </NavList>
        <NavButton>{user ? <LogOut /> : <SignIn />}</NavButton>
      </Nav>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  background-color: #629dda;
  height: 100%;
`;

const Nav = styled.div`
  background-color: #629dda;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Logo = styled(Link)`
  width: 220px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;

  @media screen and (max-width: 1279px) {
    width: 129px;
    height: 24px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

export const NavItem = styled.li`
  margin: 0;
`;

const NavButton = styled.div`
  margin: 0;
`;

export const NavLink = styled(Link)`
  display: block;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  padding: 1rem;

  &:hover {
    background-color: #629dda;
    transform: scale(1.2);
  }

  &.active {
    background-color: #ffffff;
  }
`;

export default Navbar;
