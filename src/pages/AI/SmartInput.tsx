import styled from 'styled-components/macro';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/Nav/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
const Wrapper = styled.div`
  width: 80vw;
  height: autp;
  border: 2px solid black;
`;
const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
`;

const HastagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #eaeaea;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 32px;
  color: #555;
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  margin-bottom: 0.5rem;
`;

const InputField = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #0077cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #005ea8;
  }
`;

const ResponseDisplay = styled.div`
  background-color: #f2f2f2;
  border-radius: 4px;
  padding: 1rem;
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  font-size: 18px;
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #007aff;
    color: #fff;
  `}
`;

const CategorySelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

interface CategorySelectorProps {
  onSelect: (category: string) => void;
}

const CategorySelector = ({ onSelect }: CategorySelectorProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = [
    '#Calendar',
    '#Todo',
    // '#Album',
    // '#AI',
    // '#StickyNotes',
    '#Milestone',
  ];

  const onCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelect(category);
  };

  return (
    <CategorySelectorContainer>
      {categories.map((category) => (
        <CategoryButton
          key={category}
          active={selectedCategory === category}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </CategoryButton>
      ))}
    </CategorySelectorContainer>
  );
};

interface MembersSelectorProps {
  onSelectMember: (selectedMembers: string[]) => void;
  selectedMembers?: string[];
}
const members = ['Daddy', 'Mom', 'Baby'];
const MembersSelector = ({
  selectedMembers = ['Daddy', 'Mom', 'Baby'],
  onSelectMember,
}: MembersSelectorProps) => {
  console.log(selectedMembers);

  const handleSelectMember = (member: string) => {
    if (selectedMembers.includes(member)) {
      onSelectMember(selectedMembers.filter((m) => m !== member));
    } else {
      onSelectMember([...selectedMembers, member]);
    }
  };

  return (
    <div>
      {members.map((member) => (
        <button
          key={member}
          style={{
            background: selectedMembers.includes(member) ? 'blue' : 'grey',
            color: 'white',
            padding: '5px 10px',
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => handleSelectMember(member)}
        >
          {member}
        </button>
      ))}
    </div>
  );
};

const SmartInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([
    'Daddy',
    'Mom',
    'Baby',
  ]);
  const handleCategorySelect = (category: string) => {
    setCategory(category);
  };

  const handleSelectMember = (
    selectedMembers: string[],
    member: string,
    memberIndex: number
  ) => {
    const updatedSelectedMembers = selectedMembers.includes(member)
      ? selectedMembers.filter((m) => m !== member)
      : [...selectedMembers, member];
    setSelectedMembers(updatedSelectedMembers);
  };

  const handleClick = (category: string) => {
    setSelectedCategory(category);
  };

  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    let categoryFeedback = '';
    console.log(category);
    if (category === '#Calendar') {
      console.log('calendar');
      console.log(formattedDate);
      let prompt = `
      User input: ${inputValue}
      today is ${formattedDate}
      
      請依照傳統行事曆格式，生成以下 JSON回應：

      {
        "title": "事件名稱",
        "category": "類別:work, personal, school",
        "date": "開始日期 (YYYY-MM-DD)",
        "endDate": "結束日期 (YYYY-MM-DD)",
        "time": "開始時間 (HH:MM)",
        "endTime": "結束時間 (HH:MM)",
        "member": ${selectedMembers},
        "event": ${category},
        "response": "${categoryFeedback} 回應訊息"
      }
    `;

      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      console.log(response.data);
      setResponseValue(response.data.choices[0].text);
    }
    if (category === '#Todo') {
      console.log('todo');
      let prompt = `
      
      使用者輸入: ${inputValue}
  今天日期是 ${formattedDate}
  請依照繁體中文格式，生成以下 JSON 回應：

  
  {
    "text": "任務描述",
    "event": ${category},
    "due": "截止時間 (YYYY-MM-DD)",
    "member": ${selectedMembers},
    "done": false,
    "response": "完成任務後，請不要忘記將其標記為完成。回應訊息"
  }
    `;

      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      console.log(response.data);
      setResponseValue(response.data.choices[0].text);
    }
    if (category === '#StickyNotes') {
      console.log('sticky notes');
      let prompt = `
      使用者輸入: ${inputValue}
  今天日期是 ${formattedDate}
  請依照繁體中文格式，生成以下 JSON 回應：

  
  // {
  //   "id": ${uuidv4()},
  //   "event": ${category},
  //   "content": "便利貼內容",
  //   "color": "便利貼顏色",
  //   "response": "此便利貼已添加到您的便利貼列表。回應訊息",
  //   "x":150,
  //   "y":150,
  // }
    `;
      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      console.log(response.data);
      setResponseValue(response.data.choices[0].text);
    }
    if (category === '#Milestone') {
      console.log('milestone');
      let prompt = `
    使用者輸入：${inputValue}
    今天是${formattedDate}。

    請生成一個包含以下字段的JSON回應：

    
    {
      "title": "里程碑描述",
      "event": ${category},
      "date": "里程碑日期（YYYY-MM-DD）",
      "member": ${selectedMembers},
      "image": "里程碑圖片",
      "response": "恭喜您達成里程碑！回應信息"
    }
  `;
      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      console.log(response.data);
      setResponseValue(response.data.choices[0].text);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runPrompt();
  };

  type HandleNewEventSubmit = (responseValue: string) => Promise<void>;

  const handleNewEventSubmit: HandleNewEventSubmit = async (responseValue) => {
    console.log(category);
    console.log(responseValue);

    if (category === '#Calendar') {
      console.log('calendar');

      const postEventToFirestore = async (data: EventData) => {
        const familyDocRef = collection(
          db,
          'Family',
          'Nkl0MgxpE9B1ieOsOoJ9',
          'Calendar'
        );
        try {
          const docRef = await addDoc(familyDocRef, data);
          console.log('Document written with ID: ', docRef.id);
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      };
      const isMultiDay =
        JSON.parse(responseValue).date !== JSON.parse(responseValue).endDate;
      const newEvent = {
        title: JSON.parse(responseValue).title,
        date: JSON.parse(responseValue).date,
        endDate: JSON.parse(responseValue).endDate,
        category: JSON.parse(responseValue).category,
        member: JSON.parse(responseValue).member,
        id: uuidv4(),
        multiDay: isMultiDay,
        time: JSON.parse(responseValue).time,
        endTime: JSON.parse(responseValue).endTime,
        note: '',
      };
      postEventToFirestore(newEvent);
    } else if (category === '#Todo') {
      console.log('#Todo');
      const newItem = {
        text: JSON.parse(responseValue).text,
        due: JSON.parse(responseValue).due,
        member: JSON.parse(responseValue).member,
        done: false,
      };
      const postEventToFirestore = async (data: EventData) => {
        const todoRef = doc(
          db,
          'Family',
          'Nkl0MgxpE9B1ieOsOoJ9',
          'todo',
          'todo'
        );
        try {
          // Get the existing items array from the todo document
          console.log('here');
          const todoDoc = await getDoc(todoRef);
          const items = todoDoc.exists() ? todoDoc.data().items : [];

          const updatedItems = [...items, newItem];

          // Update the items array in the todo document
          await setDoc(todoRef, {
            items: updatedItems,
            title: 'todo',
          });
        } catch (error) {
          console.error('Error saving item to Firestore: ', error);
        }
      };

      postEventToFirestore(newItem);
    } else if (category === '#StickyNotes') {
      console.log('#StickyNotes');
    } else if (category === '#Milestone') {
      const newEvent = {
        id: uuidv4(),
        title: JSON.parse(responseValue).title,
        date: JSON.parse(responseValue).date,
        member: JSON.parse(responseValue).member,
        image: JSON.parse(responseValue).image || null,
      };

      try {
        const eventsRef = collection(
          db,
          'Family',
          'Nkl0MgxpE9B1ieOsOoJ9',
          'Milestone'
        );
        await addDoc(eventsRef, newEvent);
        console.log('New event has been added to Firestore!');
      } catch (error) {
        console.error('Error adding new event to Firestore: ', error);
      }
    } else {
    }
  };

  type EventData =
    | {
        title: string;
        date: string;
        endDate: string;
        category: string;
        member: string;
        id: string;
        multiDay: boolean;
        time: string;
        endTime: string;
        note: string;
      }
    | {
        text: string;
        due: string;
        member: string;
        done: boolean;
      }
    | {
        id: string;
        title: string;
        date: string;
        member: string;
        image: string | null;
      };

  return (
    <Container>
      <Wrapper>
        <CategorySelector onSelect={handleCategorySelect} />
        <MembersSelector
          onSelectMember={(selectedMembers: string[]) =>
            handleSelectMember(
              selectedMembers,
              selectedMembers[0],
              selectedMembers.indexOf(selectedMembers[0])
            )
          }
          selectedMembers={selectedMembers.map(String)}
        />

        <InputForm onSubmit={handleSubmit}>
          <InputLabel>
            Input:
            <InputField
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </InputLabel>
          <SubmitButton type="submit">Submit</SubmitButton>
        </InputForm>
        {responseValue && (
          <ResponseDisplay>
            <p>Response:</p>
            <p>{responseValue}</p>
            <button onClick={() => handleNewEventSubmit(responseValue)}>
              {' '}
              add this event?
            </button>
          </ResponseDisplay>
        )}

        {/* <iframe
          allow="microphone;"
          width="1000"
          height="1000"
          src="https://console.dialogflow.com/api-client/demo/embedded/ffb168b2-33cb-451d-9a1b-fe91dc74bd4e"
        ></iframe> */}
      </Wrapper>
    </Container>
  );
};

export default SmartInput;
