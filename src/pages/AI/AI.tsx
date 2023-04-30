import Layout from '../../Components/layout';
import styled, { keyframes } from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/Nav/Navbar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import SideNav from '../../Components/Nav/SideNav';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
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
import SmartInput from './SmartInput';
import Banner from '../../Components/Banner/Banner';
import Suggestion from './Suggestion';

const AI = () => {
  const [showSmartInput, setShowSmartInput] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleClick1 = () => {
    setShowSmartInput(!showSmartInput);
    if (showSuggestion) {
      setShowSuggestion(!showSuggestion);
    }
  };

  const handleClick2 = () => {
    setShowSuggestion(!showSuggestion);
    if (showSmartInput) {
      setShowSmartInput(!showSmartInput);
    }
  };
  return (
    <Container>
      <SideNav></SideNav>
      <Wrapper>
        <Banner title={'AI'} subTitle="Smart input, smart advice"></Banner>

        <AiRowWrap>
          <Circle onClick={handleClick1}>
            <AiWrapper>
              <CenteredText>Smart Input</CenteredText>
              <CenteredSubText>Add event via natural language</CenteredSubText>
            </AiWrapper>
          </Circle>
          <SmartInput />
        </AiRowWrap>
        <AiRowWrap>
          <Suggestion />
          <Circle onClick={handleClick2}>
            <AiWrapper>
              <CenteredText>Smart Advice</CenteredText>
              <CenteredSubText>
                Suggestions from digital assistant
              </CenteredSubText>
            </AiWrapper>
          </Circle>
        </AiRowWrap>
      </Wrapper>
    </Container>
  );
};

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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
  //border: gold solid 3px;
`;

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the child element horizontally */
  align-items: center; /* Center the child element vertically */
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  //border: 3px solid blue;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  //border: 3px solid red;
  margin-top: 30px;
`;

const Circle = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 20%;
  margin: 40px;
  padding: 20px;
  font-size: 20px;

  background-color: #5981b0;
  position: relative;
  z-index: 1;
  p {
    margin: 0 0 10px;
  }

  img {
    width: 100%;
    height: auto;
    margin-top: 10px;
    border-radius: 50%;
  }
  &:hover {
    transform: scale(1.1);
  }

  /* @media screen and (max-width: 1200px) {
    background-color: transparent;
  } */
`;

const AiWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const CenteredText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 36px;
  color: white;
`;

const CenteredSubText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 20px;
  color: white;
`;

const AiContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  align-items: center;
`;
const AiRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  align-items: center;
  // border: 3px solid green;
  width: 100%;
  height: 400px;
`;
export default AI;
