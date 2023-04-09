import styled from 'styled-components/macro';
import { useState, useEffect, useReducer, useRef } from 'react';
import DragNDrop from './DragNDrop';
import Sidebar from '../../../Components/SideBar/SideBar';

const Wrapper = styled.div`
  width: 80vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const AddListButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  margin: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #4caf50;

  color: white;
  font-size: 16px;
  margin: 10px;
`;

const defaultData = [
  {
    title: '家事🏠',
    items: [
      {
        text: 'take out garbage',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=Sassy&eyebrows=variant01&eyes=variant01&hair=short01&hairProbability=100&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
        done: false,
      },
      {
        text: '洗碗',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=Sassy&eyebrows=variant01&eyes=variant01&hair=long03&hairProbability=100&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
        done: true,
      },
      {
        text: '繳費',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=Sassy&eyebrows=variant01&eyes=variant01&hair=short19&hairProbability=0&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
        done: false,
      },
    ],
  },
  {
    title: '購物清單',
    items: [
      {
        text: 'milk',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=S…lor=f5f5f5&features=blush&featuresProbability=100',
        done: false,
      },
      {
        text: 'Task 2',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=P…lor=f5f5f5&features=blush&featuresProbability=100',
        done: true,
      },
      {
        text: 'Task 3',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=S…or=f5f5f5&features=mustache&featuresProbability=0',
        done: false,
      },
    ],
  },
  {
    title: '家庭活動',
    items: [
      {
        text: 'Task 1',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=S…lor=f5f5f5&features=blush&featuresProbability=100',
        done: false,
      },
      {
        text: 'Task 2',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=P…lor=f5f5f5&features=blush&featuresProbability=100',
        done: true,
      },
      {
        text: 'Task 3',
        due: '2023-04-07',
        member:
          'https://api.dicebear.com/6.x/adventurer/svg?seed=S…or=f5f5f5&features=mustache&featuresProbability=0',
        done: false,
      },
    ],
  },
];

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LIST':
      return [...state, { title: action.payload, items: [] }];
    case 'ADD_ITEM':
      const newItem = {
        text: action.payload.text,
        due: action.payload.due,
        member: action.payload.member,
        done: false,
      };
      return state.map((list, index) =>
        index === action.listIndex
          ? { ...list, items: [...list.items, newItem] }
          : list
      );
    case 'MOVE_ITEM':
      const { source, destination } = action.payload;
      const itemToMove = state[source.droppableId].items[source.index];
      return {
        ...state,
        [source.droppableId]: {
          ...state[source.droppableId],
          items: state[source.droppableId].items.filter(
            (_, index) => index !== source.index
          ),
        },
        [destination.droppableId]: {
          ...state[destination.droppableId],
          items: [
            ...state[destination.droppableId].items.slice(0, destination.index),
            itemToMove,
            ...state[destination.droppableId].items.slice(destination.index),
          ],
        },
      };
    default:
      return state;
  }
};

function Todo() {
  const [data, dispatch] = useReducer(todoReducer, defaultData);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  useEffect(() => {
    localStorage.setItem('List', JSON.stringify(data));
  }, [data]);

  const addList = () => {
    const title = prompt('Enter list title');
    title && dispatch({ type: 'ADD_LIST', payload: title });
  };

  const dueDateRef = useRef(null);

  const addItem = (listIndex) => {
    const text = prompt('Enter item text');
    const dueDateString = dueDateRef.current.value; // "YYYY-MM-DD"
    const due = new Date(dueDateString);

    const member = prompt('Enter member name');
    const done = false;
    if (text && due && member) {
      const newItem = { text, due, member, done };
      dispatch({ type: 'ADD_ITEM', payload: newItem, listIndex });
    }
  };

  return (
    <Container>
      <Sidebar />
      <Wrapper>
        <AddListButton onClick={addList}>Add New List</AddListButton>
        <DragNDrop
          data={data}
          onItemAdd={addItem}
          selectedItemIndex={selectedItemIndex}
          setSelectedItemIndex={setSelectedItemIndex}
        />
      </Wrapper>
    </Container>
  );
}

export default Todo;
