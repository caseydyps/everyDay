import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';
import SignIn from '../Login/SignInNav';
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
    color: #f6f8f8;
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
          EVERYDAY
          {/* <img style={{ width: '200px' }} src={logo} alt="EVERYDAY" /> */}
        </Logo>
        {/* <NavList open={open}>
          <NavItem>
            <NavLink to="/dashboard">DASHBOARD</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar">CALENDAR</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/todo">TODO</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/ai">AI</NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/whiteboard">Stick n' Draw</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gallery">GALLERY</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/chat">CHAT</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/milestone">TIME MACHINE</NavLink>
          </NavItem>
        </NavList>
        <NavMenu onClick={toggleNav}>
          {open ? (
            <CloseIcon icon={faTimes} />
          ) : (
            <HamburgerIcon icon={faBars} />
          )}
        </NavMenu> */}
        <div style={{ position: 'absolute', right: '30px', top: '6px' }}>
          {!user && <SignIn />}
        </div>

        <UserSetting>
          <AvatarContainer onClick={handleAvatarClick}>
            <UserAvatar />
          </AvatarContainer>

          {isMenuOpen && (
            <PopoutMenuContainer>
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
            </PopoutMenuContainer>
          )}
        </UserSetting>
      </Nav>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  height: 50px;
  top: 0;
  left: 0;
  width: 100vw;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  z-index: 8;
  background-color: transparent;
  /* backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  //box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75); */
`;

const Nav = styled.div`
  background: #5981b0;
  // box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100%;
`;

const Logo = styled(Link)`
  width: 220px;
  height: 48px;
  color: #f6f8f8;
  text-align: center;
  font-weight: bold;
  margin: auto 0;
  margin-top: 10px;
  font-family: 'Braah One';
  text-decoration: none;
  align-items: center;
  justify-content: center;
  font-size: 30px;
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

  background: transparent;

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
    background: #253c54;
  }
`;

export const NavItem = styled.li`
  margin: 0px;
  /* media query for screens narrower than 768px */
  @media screen and (max-width: 767px) {
    margin: 10px 0;
  }
`;

const Triangle = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #5981b0;
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

const PopoutMenuContainer = styled.div`
  position: relative;
  display: flex;
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
  font-size: 16px;
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
  font-weight: 900px;
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
  top: -2px;
  right: 15px;
  background-color: #5981b0;
  border-radius: 15px;
  padding: 10px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s;

  /* Add a triangle-shaped border to the top */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 15px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #5981b0 transparent;
  }

  /* Show a shadow when the menu is hovered */
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const MenuButton = styled(Link)`
  display: block;
  width: auto;

  border: none;
  background-color: transparent;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  margin: 20px 10px;
  font-weight: bold;
  &:hover {
    background-color: #3467a1;
  }
`;

export default Navbar;
