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
  useEffect(() => {
    async function fetchData() {
      const familyDocRef = collection(db, 'Family', familyId, 'Milestone');
      try {
        const querySnapshot = await getDocs(familyDocRef);
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        console.log(data);
        setMilestoneData(
          data as {
            id: string;
            title: string;
            date: Date;
            member: string;
            image: string;
          }[]
        );
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }
    }

    fetchData();
  }, []);

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

  useEffect(() => {
    const fetchTodosData = async () => {
      const todoData = await getTodosData();
      console.log(todoData);
      setTodoData(
        todoData as {
          id: string;
          title: string;
          completed: boolean;
        }[]
      );
    };
    fetchTodosData();
    runPrompt();
  }, []);

  const calendarData = [
    {
      event: '看醫生',
      category: '#Calendar',
      startTime: '2023-04-24 11:00',
      endTime: '2023-04-24 12:00',
      members: '女兒',
    },
    {
      event: '看電影',
      category: '#Calendar',
      startTime: '2023-04-26 10:00',
      endTime: '2023-04-26 11:30',
      members: '爸爸',
    },
    {
      event: '聚餐',
      category: '#Calendar',
      startTime: '2023-04-27 14:00',
      endTime: '2023-04-27 16:00',
      members: '媽媽',
    },
  ];

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
    - 里程碑資料庫: ${JSON.stringify(
      milestoneData
    )},從以上資料判斷,今天是 ${formattedDate},今天到下週有什麼事情嗎?(50字以內建議)
      `;

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

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        本週建議:
      </div>
      {responseValue && (
        <Response>
          <div>{responseValue}</div>
        </Response>
      )}
    </Card>
  );
};

const Card = styled.div`
  width: auto;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  background-color: #transparent;
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
`;

const Response = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default Suggestion;
