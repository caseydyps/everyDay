import Layout from '../../Components/layout';
import styled from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/Nav/Navbar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
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
    <Layout>
      <CenterWrapper>
        <Circle onClick={handleClick1}>
          <AiWrapper>
            <CenteredText>智慧輸入</CenteredText>
          </AiWrapper>
        </Circle>
        {showSmartInput && <SmartInput />}
        {showSuggestion && <Suggestion />}
        <Circle onClick={handleClick2}>
          <AiWrapper>
            <CenteredText>智慧建議</CenteredText>
          </AiWrapper>
        </Circle>
      </CenterWrapper>
    </Layout>
  );
};

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the child element horizontally */
  align-items: center; /* Center the child element vertically */
  margin-top: 70px;
  flex-direction: row;
  height: 100vh;
`;

const Circle = styled.div`
  width: 26vw;
  height: 26vw;
  border-radius: 50%;
  margin: 50px;
  padding: 20px;

  font-size: 0.072vw;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

  @media screen and (max-width: 1200px) {
    background-color: transparent;
  }
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
  height: 100%;
  font-size: 48px;
`;

const AiContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export default AI;
