import styled, { keyframes } from 'styled-components/macro';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/Nav/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import UserAuthData from '../../Components/Login/Auth';
import { AuthContext } from '../../config/Context/authContext';
import LoadingAnimation from '../../Components/loading';
import {
  DefaultButton,
  CancelButton,
  CloseButton,
} from '../../Components/Button/Button';
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

const Wrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  flex: 2;
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

const CategoryWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  justify-content: center; /* centers child elements along the horizontal axis */
  align-items: center;
`;

const Button = styled.button`
  background-color: #eaeaea;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 32px;
  color: #555;
`;

export const InputForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: baseline;
  margin-bottom: 10px;
  margin-top: 0px;
  width: 100%;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: fixed;
  background-color: #5981b0;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const InputLabel = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
`;

const InputField = styled.input`
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #0077cc;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #005ea8;
  }
`;

const ResponseDisplay = styled.div`
  border-radius: 4px;
  padding: 1rem;
`;

const CategoryButton = styled(DefaultButton)<{ active?: boolean }>`
  font-size: 16px;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 25px;
  cursor: pointer;

  ${(props) =>
    props.active &&
    `
    background-color: #3467a1;
    color: #F6F8F8;
  `}
`;

const CategorySelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin: 30px;
  //box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
`;

const Instruction = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  // box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
`;

const Card = styled.div`
  max-width: 600px;
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

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;
const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  width: 100%;
  justify-content: space-between;
`;

const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);
//const [membersArray, setMembersArray] = useState<string[]>([]);
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
  onSelectMember: (selectedMembers: string) => void;
  selectedMembers?: string[] | string;
}

//console.log(formatDate(date));

export const MembersSelector = ({ onSelectMember }: MembersSelectorProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  // const {
  //   user,
  //   userName,
  //   googleAvatarUrl,
  //   userEmail,
  //   hasSetup,
  //   setHasSetup,
  //   membersArray,
  //   memberRolesArray,
  // } = UserAuthData();

  const { familyId, memberRolesArray } = useContext(AuthContext);
  console.log(memberRolesArray);

  console.log(selectedMember);
  const onMemberSelect = (member: string) => {
    setSelectedMember(member);
    onSelectMember(member);
  };
  console.log(memberRolesArray);
  console.log(selectedMember);

  return (
    <CategoryWrap>
      {memberRolesArray.map((member) => (
        <DefaultButton
          key={member}
          style={{
            background: selectedMember === member ? '#3467a1' : '#F6F8F8',
            color: selectedMember === member ? '#F6F8F8' : '#3467a1',
            padding: '5px 10px',
            margin: '5px',
            borderRadius: '25px',
            cursor: 'pointer',
          }}
          onClick={() => onMemberSelect(member)}
        >
          {member}
        </DefaultButton>
      ))}
    </CategoryWrap>
  );
};

const SmartInput = ({ onClose }: any) => {
  const [inputValue, setInputValue] = useState('');
  const [member, setMember] = useState<string | string[]>('');
  const [responseValue, setResponseValue] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  const [selectedMembers, setSelectedMembers] = useState(memberRolesArray);
  const handleCategorySelect = (category: string) => {
    // event.preventDefault();
    setCategory(category);
  };

  const handleSelectMember = (member: string | string[]) => {
    // event.preventDefault();

    setMember(member);
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
        "member": ${member},
        "type": ${category},
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
      setIsLoading(false);
    }
    if (category === '#Todo') {
      console.log('todo');
      let prompt = `
      
      使用者輸入: ${inputValue}
  今天日期是 ${formattedDate}
  請依照繁體中文格式，生成以下 JSON 回應：

  
  {
    "text": "任務描述",
    "type": ${category},
    "due": "截止時間 (YYYY-MM-DD)",
    "member": ${member},
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
      setIsLoading(false); // Set isLoading back to false
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
      setIsLoading(false);
    }
    if (category === '#Milestone') {
      console.log('milestone');
      let prompt = `
    使用者輸入：${inputValue}
    今天是${formattedDate}。

    請生成一個包含以下字段的JSON回應：

    
    {
      "title": "里程碑描述",
      "type": ${category},
      "date": "里程碑日期（YYYY-MM-DD）",
      "member": ${member},
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
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await runPrompt();
  };

  type HandleNewEventSubmit = (responseValue: string) => Promise<void>;

  const handleNewEventSubmit: any = async (
    responseValue: string,
    onClose: () => void
  ) => {
    console.log(category);
    console.log(responseValue);
    alert(JSON.parse(responseValue).response);
    setInputValue('');
    //onClose();

    if (category === '#Calendar') {
      console.log('calendar');

      const postEventToFirestore = async (data: EventData) => {
        const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
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
        const todoRef = doc(db, 'Family', familyId, 'todo', 'todo');
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
        const eventsRef = collection(db, 'Family', familyId, 'Milestone');
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

  const ResponseDisplay = ({ children, onClose }: any) => {
    console.log(responseValue);
    const parsedResponse = JSON.parse(responseValue);
    let sentence = '';
    if (parsedResponse) {
      if (category === '#Calendar') {
        sentence = `${parsedResponse.type} "${parsedResponse.title}" on ${parsedResponse.date} from ${parsedResponse.time} to ${parsedResponse.endTime}, member:${parsedResponse.member}.`;
        console.log(sentence);
      }
      if (category === '#Todo') {
        sentence = `${parsedResponse.type} "${parsedResponse.text}" due ${parsedResponse.due} , member:${parsedResponse.member}.`;
        console.log(sentence);
      }
      if (category === '#Milestone') {
        sentence = `${parsedResponse.type} "${parsedResponse.title}" on ${parsedResponse.date}, member:${parsedResponse.member}.`;
        console.log(sentence);
      }
    }

    return (
      <Wrap>
        {children}
        {sentence && <Text>{sentence}</Text>}
        <DefaultButton
          onClick={() => handleNewEventSubmit(responseValue, onClose)}
        >
          add this event?
        </DefaultButton>
      </Wrap>
    );
  };

  const handleRedo = () => {
    setInputValue(''); // reset input value
    setResponseValue(''); // reset response value
    setSelectedMembers([]); // reset selected members
    setSelectedCategory(''); // reset selected category
    setIsLoading(false);
  };

  const fadeInOut = keyframes`
from {
  opacity: 1;
}
to {
  opacity: 0;
}
`;

  return (
    <Wrapper>
      <Card>
        {/* <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          智慧輸入
        </p> */}
        <ColumnWrap>
          <ColumnWrap>
            <Instruction>First, choose your category</Instruction>
            <CategorySelector onSelect={handleCategorySelect} />
          </ColumnWrap>
          <ColumnWrap>
            <Instruction>Choose your family member</Instruction>
            <MembersSelector onSelectMember={handleSelectMember} />
          </ColumnWrap>
        </ColumnWrap>

        <InputForm onSubmit={handleSubmit}>
          <InputField
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Input event, e.g: 今天晚上九點要去看電影"
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DefaultButton type="submit" style={{ marginRight: '10px' }}>
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </DefaultButton>
          </div>
        </InputForm>

        {isLoading ? (
          <LoadingAnimation />
        ) : responseValue ? (
          <ResponseDisplay onClose={onClose}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DefaultButton onClick={handleRedo} style={{ margin: '10px' }}>
                <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
              </DefaultButton>
            </div>
          </ResponseDisplay>
        ) : null}
      </Card>
    </Wrapper>
  );
};

export default SmartInput;
