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
import DefaultButton from '../../Components/Button/Button';
import { InputForm } from './SmartInput';
import UserAuthData from '../../Components/Login/Auth';
import { faM } from '@fortawesome/free-solid-svg-icons';
const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

const Suggestion = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [milestoneData, setMilestoneData] = useState<
    { id: string; title: string; date: Date; member: string; image: string }[]
  >([]);
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [calendarData, setCalendarData] = useState<Todo[]>([]);
  const moment = require('moment');
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
    membersArray,
    memberRolesArray,
  } = UserAuthData();
  // useEffect(() => {
  //   async function fetchData() {
  //     const familyDocRef = collection(db, 'Family', familyId, 'Milestone');
  //     try {
  //       const querySnapshot = await getDocs(familyDocRef);
  //       const data = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //       }));
  //       console.log(data);
  //       setMilestoneData(
  //         data as {
  //           id: string;
  //           title: string;
  //           date: Date;
  //           member: string;
  //           image: string;
  //         }[]
  //       );
  //     } catch (error) {
  //       console.error('Error fetching data from Firestore: ', error);
  //     }
  //   }

  //   fetchData();
  // }, [familyId]);

  const getTodosData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'todo');
    const querySnapshot = await getDocs(familyDocRef);
    const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return todosData;
  };

  interface Todo {
    id: string;
    title: string;
    completed: boolean;
  }

  // useEffect(() => {
  //   console.log(familyId);
  //   const fetchTodosData = async () => {
  //     const todoData = await getTodosData();
  //     console.log(todoData);
  //     setTodoData(
  //       todoData as {
  //         id: string;
  //         title: string;
  //         completed: boolean;
  //       }[]
  //     );
  //   };
  //   fetchTodosData();
  // }, [familyId]);

  // useEffect(() => {
  //   const fetchCalendarData = async () => {
  //     const calendarData: any = await getCalendarData();
  //     console.log(calendarData);
  //     setCalendarData(calendarData);
  //   };
  //   fetchCalendarData();
  // }, [familyId]);
  console.log(todoData, calendarData);

  useEffect(() => {
    console.log(familyId);

    const fetchTodosData = async () => {
      const todoData = await getTodosData();
      console.log(todoData);
      setTodoData(todoData as Todo[]);
    };

    const fetchCalendarData = async () => {
      const calendarData = await getCalendarData();
      console.log(calendarData);
      setCalendarData(calendarData);
    };

    Promise.all([fetchTodosData(), fetchCalendarData()]).then(() => {
      console.log(calendarData, todoData);
      runPrompt();
    });
  }, [familyId]);

  const getCalendarData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(familyDocRef);
    const calendarData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return calendarData;
  };

  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    console.log(calendarData);

    const prompt = ` 
   ,這是我家庭的資料庫，裡面有以下資料：
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    ,從以上資料判斷,今天是 ${formattedDate},今天到下週有什麼事情嗎?(20字以內, 時間不需要年份)
      `;
    console.log(prompt);
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是我的家庭助理`,
        },
        {
          role: 'user',
          content: `${prompt}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });
    // const parsableJSONresponse = response.data.choices[0].text;
    console.log(response);
    console.log(response.data.choices[0].message.content);
    // const parsedResponse = JSON.parse(parsableJSONresponse);
    // console.log('parsedResponse:', parsedResponse);
    setResponseValue(response.data.choices[0].message.content);
    //console.log('Responses: ', parsedResponse.R);
  };

  useEffect(() => {
    console.log(todoData, calendarData);
    runPrompt();
  }, [todoData, calendarData]);

  return (
    <Card>
      {/* <BoxText
        style={{
          fontSize: '20px;',
        }}
      >
        Suggestions
      </BoxText> */}

      <Response>
        {todoData.length > 0 && calendarData.length > 0 ? (
          <div>{responseValue}</div>
        ) : (
          <div>Loading...</div>
        )}
      </Response>
    </Card>
  );
};

const Card = styled.div`
  max-width: 240px;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
  font-size: 24px;

  background-color: transparent;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  color: #414141;
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
`;

const Response = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 120px;
  min-height: 80px;
  font-weight: bold;
  margin-top: 70px;
  color: #414141;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
`;

export default Suggestion;
