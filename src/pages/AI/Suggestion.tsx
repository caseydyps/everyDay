import styled, { keyframes } from 'styled-components/macro';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../config/Context/authContext';
import axios from 'axios';
import Sidebar from '../../Components/Nav/Navbar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import LoadingAnimation from '../../Components/loading';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
  faPaperPlane,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { ChatContainer } from '@chatscope/chat-ui-kit-react';
const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

const Suggestion = () => {
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [milestoneData, setMilestoneData] = useState<
    { id: string; title: string; date: Date; member: string; image: string }[]
  >([]);
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [calendarData, setCalendarData] = useState<Todo[]>([]);
  const moment = require('moment');
  const [isLoading, setIsLoading] = useState(false);
  // const {
  //   user,
  //   userName,
  //   googleAvatarUrl,
  //   userEmail,
  //   hasSetup,
  //   familyId,
  //   setHasSetup,
  //   membersArray,
  //   memberRolesArray,
  // } = UserAuthData();
  const { familyId, memberRolesArray } = useContext(AuthContext);

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
  }, [familyId]);

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

  const getCalendarData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(familyDocRef);
    const calendarData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return calendarData;
  };

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
  }, [familyId]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      const calendarData: any = await getCalendarData();
      console.log(calendarData);
      setCalendarData(calendarData);
    };
    fetchCalendarData();
  }, [familyId]);

  // const calendarData = [
  //   {
  //     event: 'Doctor Appointment',
  //     category: '#Calendar',
  //     startTime: moment('2023-04-07 11:00').toDate(),
  //     endTime: moment('2023-04-07 12:00').toDate(),
  //     members: ['mom', 'baby'],
  //     response: 'Appointment scheduled',
  //   },
  //   {
  //     event: 'Playgroup',
  //     category: '#Calendar',
  //     startTime: moment('2023-04-10 10:00').toDate(),
  //     endTime: moment('2023-04-10 11:30').toDate(),
  //     members: ['dad', 'baby'],
  //     response: 'Playgroup scheduled',
  //   },
  //   {
  //     event: 'Baby Shower',
  //     category: '#Calendar',
  //     startTime: moment('2023-04-15 14:00').toDate(),
  //     endTime: moment('2023-04-15 16:00').toDate(),
  //     members: ['mom', 'dad'],
  //     response: 'Shower scheduled',
  //   },
  // ];

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
      const prompt = `  
      這是我家庭的資料庫，裡面有以下資料：
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
   
    請使用以上資料庫,並用下方方式回答
    
1. ${formattedDate}有哪些行程安排？附上今天的事件/時間/參與者。
2. 從${formattedDate}開始的七天有哪些行程安排？附上未來七天的事件/時間/參與者還有${formattedDate}跟${formattedDate}七天後日期。

以下請用自然語言格式回答：

{
 "今日行程：...",
"未來七天行程：...",
}
      `;
      console.log('智慧建議' + prompt);

      // 2. 下週有哪些行程安排？請附上下週的事件/時間/參與者。
      // 3. 是否有任何待辦事項需要處理？請附上未完成事件/到期時間/參與者。
      // 4. 是否有任何重要日期或事件即將到來？請附上建議的回應。
      // "Q2": "下週行程安排是：...",
      // "Q3": "待辦事項有：...",
      // "Q4": "重要日期或事件是：..."

      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.5,
      });

      // const parsableJSONresponse = response.data.choices[0].text;
      console.log(response.data.choices[0].text);
      // const parsedResponse = JSON.parse(parsableJSONresponse);
      // console.log('parsedResponse:', parsedResponse);
      setResponseValue(response.data.choices[0].text);
      //console.log('Responses: ', parsedResponse.R);
    } else {
      const conversationHistory = conversation
        .map((message: any) => message.text)
        .join('\n');
      const prompt = ` 這是我家庭的資料庫，裡面有以下資料：
      今天是 ${formattedDate}
    - 行事曆資料庫: ${JSON.stringify(calendarData)}
    - 待辦事項資料庫: ${JSON.stringify(todoData)}
    ${conversationHistory}
    請依照資料庫回答使用者的問題:${inputValue},請設定自己是個家庭管家的口吻,盡量不超過30字,回答時請附上事件發生日期/時間(如果有,不要年份)/參與者(如果有),不用反問使用者
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
            content: `${prompt}
        請依照資料庫回答使用者的問題:${inputValue},回答時請附上事件發生日期/時間(如果有,不要年份)/參與者(如果有)`,
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
      setIsLoading(false);
      //console.log('Responses: ', parsedResponse.R);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log('inputValue:', inputValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = { text: inputValue, sender: 'user' };
    // setConversation([...conversation, message]);
    runPrompt();
    setIsLoading(true);
  };

  const handleRedo = () => {
    setInputValue(''); // reset input value
    setResponseValue(''); // reset response value
    setIsLoading(false);
  };

  return (
    <Container>
      <Card>
        <p style={{ color: '#1E3D6B', fontFamily: 'Braah one' }}>
          Ask anything about your family !
        </p>
        <SuggestionWrap>
          <RowWrap>
            <ColumnWrap>
              <SuggestionItem onClick={() => setInputValue('智慧建議')}>
                智慧建議
              </SuggestionItem>
              <SuggestionItem
                onClick={() => setInputValue('今天的行事曆事件有哪些？')}
              >
                今天的行事曆事件有哪些？
              </SuggestionItem>
              <SuggestionItem
                onClick={() => setInputValue('今天的代辦事項有哪些？')}
              >
                今天的代辦事項有哪些？
              </SuggestionItem>
            </ColumnWrap>
            <ColumnWrap>
              <SuggestionItem onClick={() => setInputValue('這週有什麼事？')}>
                這週有什麼事？
              </SuggestionItem>
              <SuggestionItem
                onClick={() => setInputValue('爸爸今天有什麼事情？')}
              >
                爸爸今天有什麼事情？
              </SuggestionItem>
              <SuggestionItem
                onClick={() => setInputValue('看電影是什麼時候？')}
              >
                看電影是什麼時候？
              </SuggestionItem>
            </ColumnWrap>
          </RowWrap>
        </SuggestionWrap>

        <InputForm onSubmit={handleSubmit}>
          <InputLabel>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="請輸入智慧建議或隨意問問題, Ex:今天有什麼事?"
            />
          </InputLabel>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <DefaultButton
              className={isLoading ? 'fade-enter-active' : ''}
              type="submit"
              style={{ margin: '10px' }}
            >
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </DefaultButton>
          </div>
        </InputForm>

        {isLoading ? (
          <LoadingAnimation />
        ) : responseValue ? (
          <Response>
            <Text>{responseValue}</Text>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DefaultButton onClick={handleRedo} style={{ margin: '10px' }}>
                <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
              </DefaultButton>
            </div>
          </Response>
        ) : null}
      </Card>
    </Container>
  );
};

const Text = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  flex: 1;
`;

const SuggestionWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  flex-wrap: wrap;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  width: 600px;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  //box-shadow: 3px 3px 5px black;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);

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
    /* transform: scale(1.1); */
  }
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;

  font-size: 18px;
  font-weight: bold;
  color: #fff;
  width: 100%;
`;

const SuggestionItem = styled.div`
  background-color: #5981b0;
  border-radius: 25px;
  padding: 4px 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  width: 250px;
  text-align: center;
  &:hover {
    background-color: #3467a1;
  }
`;

const Input = styled.input`
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  background-color: #fff;
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

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;
export default Suggestion;
