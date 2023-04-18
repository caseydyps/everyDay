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

function WelcomePage() {
  const [user] = useAuthState(auth);
  const userName = user ? user.displayName : null;
  const avatarUrl = user ? user.photoURL : null;
  const userEmail = user ? user.email : null;
  const [hasSetup, setHasSetup] = useState(null);
  useEffect(() => {
    async function checkIfUserExists() {
      if (userEmail) {
        console.log('has email');
        const familyCollection = collection(db, 'Family');
        const queryUser = where('users', '==', userEmail);
        const matchingDocs = await getDocs(query(familyCollection, queryUser));
        if (matchingDocs.size > 0) {
          // A document with the user's email address exists
          setHasSetup(true);
          console.log('has setup');
        } else {
          // No document with the user's email address exists
          setHasSetup(false);
          console.log('not yet setup');
        }
      }
    }
    checkIfUserExists();
  }, [userEmail]);

  return (
    <Container>
      {user ? (
        <>
          {hasSetup ? (
            <>
              <WelcomeMessage>歡迎回家, {userName}</WelcomeMessage>
              <ColumnWrap>
                <RowWrap>
                  <Wording style={{ fontSize: 72 }}>
                    你可以: <br />
                  </Wording>
                  <LinkButton to="/dashboard" style={{ fontSize: 60 }}>
                    Straight to Dashboard
                  </LinkButton>
                </RowWrap>
                <ColumnWrap>
                  <RowWrap>
                    <Wording style={{ fontSize: 72 }}>
                      或者, <br />
                    </Wording>
                    <LinkButton to="/ai" style={{ fontSize: 60 }}>
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
            </>
          ) : (
            <>
              <WelcomeMessage style={{ marginTop: '300px' }}>
                您似乎還未設定家庭成員, 請點選下方進行設定
              </WelcomeMessage>
              <LinkButton style={{ fontSize: '64px' }} to="/family">
                設定家庭成員
              </LinkButton>
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
              {avatarUrl && <Avatar src={avatarUrl} alt="" />}
            </NavLink>
            <Slogan>Login in seconds!</Slogan>
            <SignIn />
          </ColumnWrap>
        </CircleButton>
      )}
    </Container>
  );
}

const WelcomeMessage = styled.h1`
  color: white;
  font-size: 128px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 50px;
`;

const gradientAnimation = keyframes`
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

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  );
  display: flex;
  border-top: 4px solid white;
  flex-direction: column;
  justify-content: center;
  animation: ${gradientAnimation} 20s ease-in-out infinite;
  background-size: 200% 500%;
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

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  margin: auto;
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
  font-size: 32px;
  font-weight: bold;
  margin: auto;
`;

const AiInput = styled.input`
  min-width: 800px;
  height: 100px;
  margin: 50px auto;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 48px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #629dda;
  }
`;

const NavLink = styled(Link)``;

export default WelcomePage;
