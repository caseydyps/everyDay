import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';
import SignIn from '../Login/SignIn';
import LogOut from '../Login/LogOut';

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
  faCircleChevronRight,
  faCircleChevronLeft,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
const SideNav = () => {
  const [user] = useAuthState(auth);
  const userName = user ? user.displayName : null;
  const avatarUrl = user ? user.photoURL : null;
  const userUrl = user ? user.email : null;

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    setIsMenuOpen(false); // Close the menu
    auth.signOut();
  };

  const [open, setOpen] = useState(true);

  const toggleNav = () => {
    setOpen(!open);
  };

  return (
    <NavbarWrapper showNav={open}>
      <Nav>
        <NavList showNav={open}>
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
        <NavToggle showNav={open} onClick={toggleNav}>
          <FontAwesomeIcon
            icon={open ? faCircleChevronLeft : faCircleChevronRight}
          />
        </NavToggle>
      </Nav>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  z-index: 2;
  height: auto;
  margin-left: 0;
  border: 4px solid green;
  max-width: 200px;
  width: ${(props) => (props.showNav ? '200px' : '20px')};
  padding: ${(props) => (props.showNav ? '0px' : '0')};
  transition: width 0.3s ease-out, padding 0.3s ease-out;
`;

const Nav = styled.div`
  background: #3467a1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  height: 100%;
  width: auto;
`;

const Logo = styled(Link)`
  width: 220px;
  height: 48px;
  color: white;
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: ${(props) => (props.showNav ? 'flex' : 'none')};

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

const NavToggle = styled.div`
  cursor: pointer;
  margin-left: auto;
  position: absolute;
  bottom: 150px;
  font-size: 36px;
  color: #ffffff;
  transition: width 0.3s ease-out, padding 0.3s ease-out;
  left: ${(props) => (props.showNav ? '135px' : '0px')};
`;

const UserSetting = styled.div``;

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
  width: 100px;

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

export default SideNav;
