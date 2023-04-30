import { NavLink, Link } from 'react-router-dom';
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
  faTable,
  faCalendarDays,
  faListCheck,
  faRobot,
  faPalette,
  faImage,
  faComments,
  faTimeline,
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
            <StyledNavLink activeClassName="active" to="/dashboard">
              <FontAwesomeIcon icon={faTable} />

              <Text> Dashboard</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/calendar">
              <FontAwesomeIcon icon={faCalendarDays} />
              <Text> Calendar</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/todo">
              <FontAwesomeIcon icon={faListCheck} />
              <Text> Todo</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/ai">
              <FontAwesomeIcon icon={faRobot} />
              <Text> AI</Text>
            </StyledNavLink>
          </NavItem>

          <NavItem>
            <StyledNavLink activeClassName="active" to="/whiteboard">
              <FontAwesomeIcon icon={faPalette} />
              <Text>Stick'n Draw</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/gallery">
              <FontAwesomeIcon icon={faImage} />

              <Text> Gallery</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/chat">
              <FontAwesomeIcon icon={faComments} />
              <Text> Chat</Text>
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink activeClassName="active" to="/milestone">
              <FontAwesomeIcon icon={faTimeline} /> Milestone
            </StyledNavLink>
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
  margin-top: 60px;
  margin-left: 5px;

  width: ${(props) => (props.showNav ? '180px' : '20px')};
  padding: ${(props) => (props.showNav ? '0px' : '0')};
  transition: width 0.3s ease-out, padding 0.3s ease-out;
`;

const Nav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: fixed;
  height: 100%;
  width: 160px;
`;

const Text = styled.span`
  margin-left: 5px;
`;

const Logo = styled(Link)`
  width: 150px;
  height: 28px;
  color: #5981b0;
  text-align: center;
  font-weight: bold;
  margin: auto 0;
  margin-top: 0px;
  font-family: 'Braah One';
  text-decoration: none;
  align-items: center;
  position: absolute;
  top: 40px;
  left: 010px;
  justify-content: center;
  font-size: 24px;
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
  padding: 5px;
  margin: auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: ${(props) => (props.showNav ? 'flex' : 'none')};
  top: 50px;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  //border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);

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
    background: #5981b0;
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
  position: fixed;
  bottom: 150px;

  font-size: 36px;
  color: #ffffff;
  transition: width 0.3s ease-out, padding 0.3s ease-out;
  left: ${(props) => (props.showNav ? '150px' : '0px')};
`;

const UserSetting = styled.div``;

const AvatarContainer = styled.div`
  margin: 20px;
  margin-top: 30px;
`;

export const StyledNavLink = styled(NavLink)`
  display: block;
  color: #6a6a6a;
  font-size: 14px;
  text-align: left;
  border-radius: 15px;
  text-decoration: none;
  margin: 10px;
  width: 120px;
  &.${(props) => props.activeClassName} {
    color: #f6f8f8;
    background-color: #5981b0;
  }
  padding: 10px;

  &:hover {
    transform: scale(1.05);
    border-bottom: 4px solid #f6f8f8;
  }

  &.active {
    border-bottom: 4px solid #5981b0;
    transition: all 0.3s ease;
  }
  /* media query for screens narrower than 768px */
  @media screen and (max-width: 767px) {
    padding: 5px;
    font-size: 14px;
  }
`;

export default SideNav;
