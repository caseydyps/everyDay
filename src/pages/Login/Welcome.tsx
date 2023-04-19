import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from '../../Components/Login/SignIn';
import LogOut from '../../Components/Login/LogOut';
import styled, { keyframes } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { color, backgroundColor } from '../../theme';
import { NavList, NavItem } from '../../Components/Nav/Navbar';
import { db, storage } from '../../config/firebase.config';
import 'firebase/firestore';
import firebase from 'firebase/app';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import UserAuthData from '../../Components/Login/Auth';
import checkIfUserExists from '../../Components/Login/Auth';
import DefaultButton from '../../Components/Button/Button';

const { v4: uuidv4 } = require('uuid');

function WelcomePage() {
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    hasCreateFamily,
    setHasCreateFamily,
    handleFamilyCreate,
  } = UserAuthData();
  // const [loggedfamilyId, setLoggedFamilyId] = useState<string | null>(null);
  const familyId: string = uuidv4();

  console.log('user', user);
  console.log('hasSetup', hasSetup);
  console.log('hasCreateFamily', hasCreateFamily);

  return (
    <Container>
      {user ? (
        <>
          {hasSetup ? (
            <Wrap>
              <WelcomeMessage>歡迎回家, {userName}</WelcomeMessage>
              <ColumnWrap>
                <RowWrap>
                  <Wording>
                    您可以: <br />
                  </Wording>
                  <LinkButton to="/dashboard">Straight to Dashboard</LinkButton>
                </RowWrap>
                <ColumnWrap>
                  <RowWrap>
                    <Wording>
                      或者, <br />
                    </Wording>
                    <LinkButton to="/ai">
                      Ask anything about your family!
                    </LinkButton>
                  </RowWrap>
                  <AiInput
                    type="text"
                    placeholder="今天有什麼事嗎?"
                    style={{ paddingLeft: '30px' }}
                  ></AiInput>
                </ColumnWrap>
              </ColumnWrap>
            </Wrap>
          ) : (
            <>
              <WelcomeMessage style={{ marginTop: '300px' }}>
                您似乎還未完成家庭成員設定, 請點選下方進行設定
              </WelcomeMessage>
              {hasCreateFamily ? (
                <LinkButton to="/family" style={{ fontSize: '64px' }}>
                  進行家庭成員設定
                </LinkButton>
              ) : (
                <LinkButton
                  onClick={() =>
                    handleFamilyCreate(userName, userEmail, familyId)
                  }
                  style={{ fontSize: '64px' }}
                >
                  建立家庭
                </LinkButton>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <WelcomeMessage>Welcome, how's your day?</WelcomeMessage>
        </>
      )}
      {!user && (
        <CircleButton>
          <ColumnWrap>
            <NavLink to="/family">
              {googleAvatarUrl && <Avatar src={googleAvatarUrl} alt="" />}
            </NavLink>
            <Slogan>Login in seconds!</Slogan>
            <SignIn />
          </ColumnWrap>
        </CircleButton>
      )}
    </Container>
  );
}

const WelcomeMessage = styled.div`
  text-align: center;
  margin: auto;
  font-size: 5vw;
  font-weight: bold;
  color: white;
  padding: 20vh;
  flex: 1;
`;

export const GradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  
`;

export const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 50px);
  margin-top: 70px;
  background: linear-gradient(
    45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  );

  flex-direction: column;
  justify-content: center;
  animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 200% 500%;
`;

const CircleButton = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%; /* half of width or height */
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
  flex: 1;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  margin: auto;
`;

const Wrap = styled.div`
  flex-wrap: wrap;
`;

const Slogan = styled.h2`
  color: white;
  background-color: #629dda;
  border-radius: 5px;
  font-size: 36px;
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

const LinkButton = styled(Link)`
  background-color: #transparent;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 32px;
  font-weight: bold;
  margin: auto;
  &:hover {
    transform: scale(1.05);
  }
`;

const Wording = styled.div`
  background-color: #transparent;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw;
  font-weight: bold;
  margin: auto;
`;

const AiInput = styled.input`
  min-width: 500px;
  height: 60px;
  margin: 50px auto;
  padding: 5px;
  border: none;
  border-radius: 25px;
  font-size: 2.5vw;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #629dda;
  }
`;

const ConfirmButton = styled(DefaultButton)`
  background-color: blue;
  color: white;
`;

const CancelButton = styled(DefaultButton)`
  background-color: white;
  color: blue;
`;

const EditButton = styled(DefaultButton)`
  background-color: gray;
  color: white;
`;

const NavLink = styled(Link)``;

export default WelcomePage;
