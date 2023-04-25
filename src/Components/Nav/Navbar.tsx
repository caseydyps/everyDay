import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';
import SignIn from '../Login/SignIn';
import LogOut from '../Login/LogOut';
import everyday from './everyday.png';
import logo from './logo.png';
// import { color, backgroundColor } from '../../theme';
import UserAvatar from './Avatar';
import googleSignIn from '../Login/SignIn';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faEdit,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
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

  const [open, setOpen] = useState(false);

  const toggleNav = () => {
    setOpen(!open);
  };

  const HamburgerIcon = styled(FontAwesomeIcon)`
    color: white;
    font-size: 24px;
    cursor: pointer;
  `;

  const CloseIcon = styled(FontAwesomeIcon)`
    color: white;
    font-size: 24px;
    cursor: pointer;
  `;

  return (
    <NavbarWrapper>
      <Nav>
        <Logo to="/">
          {/* EVERYD
          <FontAwesomeIcon icon={faHouse} />Y */}
          <img style={{ width: '200px' }} src={logo} alt="EVERYDAY" />
        </Logo>

        <NavList open={open}>
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
            <NavLink to="/whiteboard">Whiteboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gallery">Gallery</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/chat">Chat</NavLink>
          </NavItem>
        </NavList>
        <NavMenu onClick={toggleNav}>
          {open ? (
            <CloseIcon icon={faTimes} />
          ) : (
            <HamburgerIcon icon={faBars} />
          )}
        </NavMenu>

        <UserSetting>
          <AvatarContainer onClick={handleAvatarClick}>
            <UserAvatar />
          </AvatarContainer>

          {isMenuOpen && (
            <PopoutMenu>
              <UserName>Hi, {userName}</UserName>
              <UserEmail>{userUrl}</UserEmail>
              <SplitLine></SplitLine>
              {/* <MenuButton to="/family" onClick={googleSignIn}>
                切換帳號
              </MenuButton> */}
              <MenuButton to="/family">設定家庭成員</MenuButton>
              {/* <MenuButton to="/family">通知</MenuButton> */}
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
  background-color: #transparent;
  height: 50px;
  top: 0;
  left: 0;
  width: 100vw;

  position: fixed;
  z-index: 3;
`;

const Nav = styled.div`
  background: #3467a1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
`;

const Logo = styled(Link)`
  width: 220px;
  height: 48px;
  color: white;

  font-weight: bold;
  margin: 10px 10px;
  font-family: 'Sigmar', cursive;
  text-decoration: none;
  text-decoration: none;
  display: inline-block;
  &:hover {
    transform: scale(1.05);
  }
  /* media query for screens narrower than 1080px */
`;

interface NavListProps {
  open: boolean; // 添加 open 属性
}
export const NavList = styled.ul<NavListProps>`
  list-style: none;
  padding: 0;
  margin: auto;

  justify-content: flex-start;
  align-items: flex-start;

  display: flex;
  display: ${(props) => (props.open ? 'flex' : 'none')};

  height: auto;

  background: #3467a1;

  @media screen and (max-width: 1075px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: auto;
    margin-left: auto;
    margin-right: 20px;
    position: absolute;
    right: 100px;
    top: 0px;
    z-index: 2;
    background: #629dda;
  }
`;

export const NavItem = styled.li`
  margin: 0px;
  /* media query for screens narrower than 768px */
  @media screen and (max-width: 767px) {
    margin: 10px 0;
  }
`;

const NavMenu = styled.div`
  cursor: pointer;
  margin-left: auto;
  /* media query for screens narrower than 768px */
  @media screen and (max-width: 1075px) {
    display: block;
  }
`;

const NavButton = styled.div`
  margin: 0 autp;
`;

const UserSetting = styled.div``;

const SplitLine = styled.div`
  width: 90%;
  margin: auto;
  border-top: 2px solid #e2dada;
`;

const UserName = styled.div`
  color: #f5f5f5;
  margin: 10px;
`;
const UserEmail = styled.div`
  color: #f5f5f5;
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
    transform: scale(1.1);
    border-bottom: 5px solid #ffffff;
  }

  &.active {
    background-color: #ffffff;
  }
  /* media query for screens narrower than 768px */
  @media screen and (max-width: 767px) {
    padding: 5px;
    font-size: 14px;
  }
`;

const PopoutMenu = styled.div`
  position: absolute;
  top: 90px;
  right: 30px;
  background-color: #3467a1;

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
