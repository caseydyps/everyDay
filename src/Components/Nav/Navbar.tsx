import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';
import SignIn from '../Login/SignIn';
import LogOut from '../Login/LogOut';
import logo from './logo.png';
import { color, backgroundColor } from '../../theme';
import UserAvatar from './Avatar';
import googleSignIn from '../Login/SignIn';
const Navbar = () => {
  const [user] = useAuthState(auth);
  const userName = user ? user.displayName : null;
  const avatarUrl = user ? user.photoURL : null;
  const userUrl = user ? user.email : null;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    setIsMenuOpen(false); // Close the menu
    auth.signOut();
  };

  return (
    <NavbarWrapper>
      <Nav>
        <Logo to="/" />
        <NavList>
          <NavItem>
            <NavLink to="/dashboard">Dashboard</NavLink>
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
        <UserSetting>
          <AvatarContainer onClick={handleAvatarClick}>
            <UserAvatar />
          </AvatarContainer>

          {isMenuOpen && (
            <PopoutMenu>
              <UserName>Hi, {userName}</UserName>
              <UserEmail>{userUrl}</UserEmail>
              <SplitLine></SplitLine>
              <MenuButton to="/family" onClick={googleSignIn}>
                切換帳號
              </MenuButton>
              <MenuButton to="/family">設定家庭成員</MenuButton>
              <MenuButton to="/family">通知</MenuButton>
              <NavButton onClick={handleLogout}>
                {user ? <LogOut /> : <SignIn />}
              </NavButton>
            </PopoutMenu>
          )}
        </UserSetting>
      </Nav>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  background-color: #629dda;
  height: 50px;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 10px;
  position: fixed;
  z-index: 3;
`;

const Nav = styled.div`
  background-color: #629dda;
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
`;

const Logo = styled(Link)`
  width: 220px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;
  &:hover {
    transform: scale(1.2);
  }

  @media screen and (max-width: 1279px) {
    width: 129px;
    height: 24px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: auto;
  display: flex;
`;

export const NavItem = styled.li`
  margin: 0px;
`;

const NavButton = styled.div`
  margin: 0;
`;

const UserSetting = styled.div``;

const SplitLine = styled.div`
  width: 90%;
  margin: auto;
  border-top: 2px solid #e2dada;
`;

const UserName = styled.div`
  color: #1e1f26;
  margin: 10px;
`;
const UserEmail = styled.div`
  color: grey;
  font-size: 1.2rem;
  margin: 10px;
`;

const AvatarContainer = styled.div`
  margin: 20px;
  margin-top: 30px;
`;

export const NavLink = styled(Link)`
  display: block;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  padding: 10px;

  &:hover {
    background-color: #9bb9de;
    transform: scale(1.1);
  }

  &.active {
    background-color: #ffffff;
  }
`;

const PopoutMenu = styled.div`
  position: absolute;
  top: 90px;
  right: 30px;
  background-color: #9bb9de;

  border-radius: 15px;
  padding: 10px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const MenuButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 16px 20px;
  border: none;
  background-color: transparent;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.5rem;
  font-weight: bold;
  &:hover {
    background-color: #3467a1;
  }
`;

export default Navbar;
