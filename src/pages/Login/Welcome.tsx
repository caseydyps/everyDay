import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from '../../Components/Login/SignIn';
import LogOut from '../../Components/Login/LogOut';
import styled, { keyframes } from 'styled-components/macro';
import { Link } from 'react-router-dom';
// import { color, backgroundColor } from '../../theme';
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
import LoadingAnimation from '../../Components/loading';
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
              <CurveSection>
                <h1>Welcome home,</h1>
                <ColumnWrap>
                  <RowWrap>
                    <LinkButton to="/dashboard">
                      Straight to Dashboard
                    </LinkButton>
                  </RowWrap>
                  <ColumnWrap>
                    <RowWrap>
                      <Wording>or,</Wording>
                      <LinkButton to="/ai">
                        Ask anything about your family!
                      </LinkButton>
                    </RowWrap>
                  </ColumnWrap>
                </ColumnWrap>

                <Curve></Curve>
              </CurveSection>

              <Section></Section>
            </Wrap>
          ) : (
            <>
              {/* <LoadingAnimation /> */}
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
        <Section style={{ backgroundColor: 'transparent' }}>
          <h1 style={{ color: 'white' }}>Welcome to EVERYDAY!</h1>
          <p style={{ color: 'white' }}>Your everyday family assistant</p>
        </Section>
      )}

      {!user && (
        <>
          <CurveSection>
            <h1>Arrange your family with ease</h1>

            <p>
              Love in a family is like a flame. The more it is fueled by
              kindness and care, the warmer and stronger it grows.
            </p>
            <ColumnWrap></ColumnWrap>
            <Curve></Curve>
          </CurveSection>
          <Section>
            <h1 style={{ color: 'white' }}>Can't wait? Login in seconds!</h1>
            {/* <NavLink to="/family">{googleAvatarUrl}</NavLink> */}
            <SignIn />
          </Section>
          {/* <CircleButton></CircleButton> */}
        </>
      )}
      {/* <LoadingAnimation /> */}
    </Container>
  );
}

const WelcomeMessage = styled.h1`
  text-align: center;
  margin: auto;

  font-weight: bold;
  color: white;

  flex: 1;
`;

const WelcomeSubMessage = styled.h1`
  text-align: center;
  margin: auto;
  font-size: 28px;
  font-weight: bold;
  color: white;

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

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  padding-top: 100px;
  background: #1e3d6b;
  max-width: 100vw;
`;

const BubbleSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  padding-top: 100px;
  background: #1e3d6b;
  max-width: 100vw;

  &::after {
    content: '';
    border-top-left-radius: 50% 100%;
    border-top-right-radius: 50% 100%;
    position: absolute;
    bottom: 0;
    z-index: -1;
    width: 100%;
    background-color: #0f0f10;
    height: 85%;
  }
`;

const CurveSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  padding-top: 100px;
  background: #5995dd;
  margin-top: 0px;

  &::before {
    content: '';
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 25%;
    height: 100%;
    transform: translate(65%, 60%);
    background-color: #5995dd;
  }
`;

const Curve = styled.div`
  position: absolute;
  height: 250px;
  width: 100%;
  bottom: 0;
  text-align: center;

  &::before {
    content: '';
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 55%;
    height: 100%;
    transform: translate(85%, 60%);
    background-color: #1e3d6b;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 55%;
    height: 100%;
    background-color: #5995dd;
    transform: translate(-4%, 40%);
    z-index: 1;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: auto;
  margin-top: 70px;
  /* background: linear-gradient(
    45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  ); */

  flex-direction: column;
  justify-content: center;
  //animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 200% 500%;
`;

const CircleButton = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%; /* half of width or height */
  background-color: #3467a1;
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
  height: 100%;
  width: 100vw;
  margin: 0 auto;
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

const LinkButton: any = styled(Link)`
  background-color: transparent;
  color: #fff;
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 28px;
  font-weight: bold;
  margin: auto;
  z-index: 3;
  &:hover {
    transform: scale(1.05);
  }
`;

const Wording = styled.div`
  background-color: transparent;
  color: #fff;
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
