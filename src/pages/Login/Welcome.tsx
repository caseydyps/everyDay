import React, { useState } from 'react';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from '../../Components/Login/SignIn';
import LogOut from '../../Components/Login/LogOut';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { color, backgroundColor } from '../../theme';
import { NavList, NavItem } from '../../Components/Nav/Navbar';
interface LoginFormProps {
  onSubmit: (username: string, password: string, rememberMe: boolean) => void;
}

interface WelcomePageProps {
  onLoginFormSubmit: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => void;
}

function WelcomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [user] = useAuthState(auth);
  console.log(user);
  const userName = user ? user.displayName : null;
  const avatarUrl = user ? user.photoURL : null;
  return (
    <Container>
      {user ? (
        <>
          <WelcomeMessage>
            {' '}
            {userName}, how can we make your day better?
          </WelcomeMessage>
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
        </>
      ) : (
        <>
          <WelcomeMessage>Welcome, how's your day?</WelcomeMessage>
        </>
      )}
      <CircleButton>
        <ColumnWrap>
          <NavLink to="/family">
            {avatarUrl && <Avatar src={avatarUrl} alt="" />}
          </NavLink>

          {user ? (
            <Slogan>Welcome back, {userName}!</Slogan>
          ) : (
            <Slogan>Login in seconds!</Slogan>
          )}
          {user ? <LogOut /> : <SignIn />}
        </ColumnWrap>
      </CircleButton>
    </Container>
  );
}

const WelcomeMessage = styled.h1`
  color: white;
  font-size: 128px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 100px;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #629dda;
  display: flex;
  border: 1px solid black;
  flex-direction: column;
  justify-content: center;
`;

const CircleButton = styled.div`
  width: 700px;
  height: 700px;
  border-radius: 350px; /* half of width or height */
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
  margin: auto;
  &:hover {
    transform: scale(1.1);
  }
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Slogan = styled.h2`
  color: white;
  background-color: #629dda;
  border-radius: 5px;
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  padding: 5px;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: auto;
  &:hover {
    transform: scale(1.1);
  }
  border: 6px solid #629dda;
`;

const NavLink = styled(Link)``;

export default WelcomePage;
