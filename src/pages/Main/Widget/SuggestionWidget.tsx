import 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { AuthContext } from '../../../config/Context/authContext';
import { db } from '../../../config/firebase.config';
import React from 'react';
const configJs = require('../../../config/config.js');
const { Configuration, OpenAIApi } = require('openai');
const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});
const openai = new OpenAIApi(config);

const Suggestion = () => {
  const [responseValue, setResponseValue] = useState('');
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [calendarData, setCalendarData] = useState<any>([]);
  const { familyId } = useContext(AuthContext);
  interface Todo {
    id: string;
    title: string;
    completed: boolean;
    items: any;
    done: boolean;
  }

  const getCalendarData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(familyDocRef);
    const calendarData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return calendarData;
  };

  const getTodosData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'todo');
    const querySnapshot = await getDocs(familyDocRef);
    const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return todosData;
  };

  useEffect(() => {
    const fetchTodosData = async () => {
      const todoData = await getTodosData();
      setTodoData(todoData as Todo[]);
    };

    const fetchCalendarData = async () => {
      const calendarData = await getCalendarData();
      setCalendarData(calendarData);
    };

    Promise.all([fetchTodosData(), fetchCalendarData()]).then(() => {});
  }, [familyId]);

  useEffect(() => {
    if (calendarData.length > 0 && todoData.length > 0) {
      runPrompt();
    }
  }, [todoData, calendarData]);

  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const filteredTodoData = todoData
      .flatMap(({ items }) => items)
      .filter(({ done }) => !done);
    type CalendarData = {
      category: string;
      id: string;
      note: string;
    };
    const { category, id, note, ...newObj }: CalendarData = calendarData;
    const filteredCalendarData = calendarData.map(
      ({ category, id, note, ...newObj }: CalendarData) => newObj
    );
    const upcomingEvents = filteredCalendarData.filter((event: any) => {
      const eventDate = new Date(event.date);
      return (
        eventDate >= today || eventDate.toDateString() === today.toDateString()
      );
    });

    const prompt = ` 
    今天是${formattedDate},你是智能管家，請從行事曆資料庫: ${JSON.stringify(
      upcomingEvents
    )}
    待辦事項資料庫: ${JSON.stringify(filteredTodoData)}
    ,以家庭助理的口吻分析今天到明天有什麼事件(包含行事曆跟代辦事項), 盡量簡單明瞭, 以50字以內簡短回答
      `;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是我的家庭助理, 請用30字以內簡短回答`,
        },
        {
          role: 'user',
          content: `${prompt}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });
    setResponseValue(response.data.choices[0].message.content);
  };

  return (
    <Card>
      <Response>
        {todoData.length > 0 && calendarData.length > 0 ? (
          <div>{responseValue}</div>
        ) : (
          <div></div>
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
  justify-content: start;
  font-size: 14px;
  overflow: auto;
  min-width: 120px;
  min-height: 80px;
  max-height: 120px;
  font-weight: bold;
  margin-top: 55px;
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
