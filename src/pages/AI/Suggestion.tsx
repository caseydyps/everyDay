import styled from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/SideBar/SideBar';
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
  useEffect(() => {
    const familyDocRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'Milestone'
    );

    async function fetchData() {
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
    const familyDocRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'todo'
    );
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
  }, []);

  const calendarData = [
    {
      event: 'Doctor Appointment',
      category: '#Calendar',
      startTime: moment('2023-04-07 11:00').toDate(),
      endTime: moment('2023-04-07 12:00').toDate(),
      members: ['mom', 'baby'],
      response: 'Appointment scheduled',
    },
    {
      event: 'Playgroup',
      category: '#Calendar',
      startTime: moment('2023-04-10 10:00').toDate(),
      endTime: moment('2023-04-10 11:30').toDate(),
      members: ['dad', 'baby'],
      response: 'Playgroup scheduled',
    },
    {
      event: 'Baby Shower',
      category: '#Calendar',
      startTime: moment('2023-04-15 14:00').toDate(),
      endTime: moment('2023-04-15 16:00').toDate(),
      members: ['mom', 'dad'],
      response: 'Shower scheduled',
    },
  ];

  const stickyNotesData = [
    {
      title: 'Grocery List',
      category: '#StickyNotes',
      content: 'Milk\nEggs\nBread',
      response: 'Note added',
    },
    {
      title: 'To-do List',
      category: '#StickyNotes',
      content: 'Buy baby clothes\nSchedule daycare tour\nResearch strollers',
      response: 'Note added',
    },
    {
      title: 'Important Dates',
      category: '#StickyNotes',
      content: 'Due date: 2023-07-01\nBaby shower: 2022-04-15',
      response: 'Note added',
    },
  ];

  console.log(`這是我的家庭資料庫，包含了以下資料：
  行事曆資料庫:${JSON.stringify(todoData)}`);
  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    console.log(calendarData);
    if (inputValue === '智慧建議') {
      console.log('智慧建議');
      const prompt = `  
      這是我家庭的資料庫，裡面有以下資料：
     
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    - 記事本資料庫: ${JSON.stringify(stickyNotesData)}
    - 里程碑資料庫: ${JSON.stringify(milestoneData)}
    請使用以上資料庫,並用下方方式回答
    
1. ${formattedDate}有哪些行程安排？附上今天的事件/時間/參與者。
2.1. 從${formattedDate}開始的七天有哪些行程安排？附上未來七天的事件/時間/參與者還有${formattedDate}跟${formattedDate}七天後日期。

以下請用自然語言格式回答：

{
  "Q1": "今日行程：...",
  "Q2": "未來七天行程：...",
}
   
    
      `;

      // 2. 下週有哪些行程安排？請附上下週的事件/時間/參與者。
      // 3. 是否有任何待辦事項需要處理？請附上未完成事件/到期時間/參與者。
      // 4. 是否有任何重要日期或事件即將到來？請附上建議的回應。
      // "Q2": "下週行程安排是：...",
      // "Q3": "待辦事項有：...",
      // "Q4": "重要日期或事件是：..."

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });

      // const parsableJSONresponse = response.data.choices[0].text;
      console.log(response.data.choices[0].text);
      // const parsedResponse = JSON.parse(parsableJSONresponse);
      // console.log('parsedResponse:', parsedResponse);
      setResponseValue(response.data.choices[0].text);
      //console.log('Responses: ', parsedResponse.R);
    } else {
      const prompt = ` 這是我家庭的資料庫，裡面有以下資料：
      今天是 ${formattedDate}
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    - 記事本資料庫: ${JSON.stringify(stickyNotesData)}
    - 里程碑資料庫: ${JSON.stringify(milestoneData)}
    請依照資料庫回答使用者的問題:${inputValue},請設定自己是個家庭管家的口吻
   
    
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
            content: `${prompt}
        請用幽默的口吻,依照資料庫回答使用者的問題:${inputValue}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });
      // const parsableJSONresponse = response.data.choices[0].text;
      console.log(response);
      console.log(response.data.choices[0].message.content);
      // const parsedResponse = JSON.parse(parsableJSONresponse);
      // console.log('parsedResponse:', parsedResponse);
      setResponseValue(response.data.choices[0].message.content);
      //console.log('Responses: ', parsedResponse.R);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log('inputValue:', inputValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runPrompt();
  };

  return (
    <Container>
      <Wrapper>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ed143d',
            marginBottom: '20px',
          }}
        >
          Everyday AI
        </p>
        <form onSubmit={handleSubmit}>
          <InputLabel>
            Input:
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </InputLabel>
          <SubmitButton type="submit">Submit</SubmitButton>
        </form>
        <Response>
          <p>Response:</p>
          <p>{responseValue}</p>
        </Response>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  background-color: #242424;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 1000px;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
  background-color: #1d1d1d;
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 5px;
  border: none;
  margin-left: 10px;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  background-color: #3c3c3c;
  color: #fff;
  width: 300px;

  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #7f7f7f;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #ed143d;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c90d31;
  }
`;

const Response = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

export default Suggestion;
