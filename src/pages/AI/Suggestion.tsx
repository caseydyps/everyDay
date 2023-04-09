import styled from 'styled-components';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/SideBar/SideBar';

const Wrapper = styled.div`
  width: 100vw;
  height: 300px;
  border: 2px solid black;
`;

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
`;

const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

const Suggestion = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const moment = require('moment');

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

  const todoData = [
    {
      task: 'Buy diapers',
      category: '#Todo',
      dueTime: moment('2023-04-07 17:00').toDate(),
      members: ['mom'],
      completed: false,
      response: 'Task assigned',
    },
    {
      task: 'Schedule doctor checkup',
      category: '#Todo',
      dueTime: moment('2023-04-12 17:00').toDate(),
      members: ['dad'],
      completed: false,
      response: 'Task assigned',
    },
    {
      task: 'Research car seats',
      category: '#Todo',
      dueTime: moment('2023-04-17 17:00').toDate(),
      members: ['mom', 'dad'],
      completed: false,
      response: 'Task assigned',
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

  const milestoneData = [
    {
      milestone: 'First steps',
      category: '#Milestone',
      date: '2022-06-01',
      members: ['mom', 'dad'],
      response: 'Congratulations on the milestone!',
    },
    {
      milestone: 'First words',
      category: '#Milestone',
      date: '2022-07-01',
      members: ['mom'],
      response: 'Congratulations on the milestone!',
    },
    {
      milestone: 'First tooth',
      category: '#Milestone',
      date: '2022-05-01',
      members: ['dad'],
      response: 'Congratulations on the milestone!',
    },
  ];

  console.log(`這是我的家庭資料庫，包含了以下資料：
  行事曆資料庫:${JSON.stringify(calendarData)}`);
  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    console.log(calendarData);
    if (inputValue === '智慧建議') {
      console.log('智慧建議');
      const prompt = `  today is ${formattedDate}
      這是我家庭的資料庫，裡面有以下資料：
     
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    - 記事本資料庫: ${JSON.stringify(stickyNotesData)}
    - 里程碑資料庫: ${JSON.stringify(milestoneData)}
    請使用家庭資料庫,並用下方方式回答
1. 這週有哪些行程安排？請附上事件/時間/參與者。
2. 下週有哪些行程安排？請附上事件/時間/參與者。
3. 是否有任何待辦事項需要處理？請附上事件/到期時間/參與者。
4. 是否有任何重要日期或事件即將到來？請附上建議的回應。

以下請用自然語言格式回答：

{
  "Q1": "這週行程安排是：...",
  "Q2": "下週行程安排是：...",
  "Q3": "待辦事項有：...",
  "Q4": "重要日期或事件是：..."
}
   
    
      `;

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

    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    - 記事本資料庫: ${JSON.stringify(stickyNotesData)}
    - 里程碑資料庫: ${JSON.stringify(milestoneData)}
    請依照資料庫回答${inputValue},
   
    
      `;

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
    }
  };

  const handleInputChange = (event: string) => {
    setInputValue(event.target.value);
    console.log('inputValue:', inputValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    runPrompt();
  };

  return (
    <Container>
      <Sidebar />
      <Wrapper>
        <p>輸入問題:</p>
        <form onSubmit={handleSubmit}>
          <label>
            Input:
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <div>
          <p>Response:</p>
          <p>{responseValue}</p>
        </div>
      </Wrapper>
    </Container>
  );
};

export default Suggestion;
