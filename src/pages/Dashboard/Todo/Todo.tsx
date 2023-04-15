import styled from 'styled-components/macro';
import { useState, useEffect, useReducer, useRef } from 'react';
import DragNDrop from './DragNDrop';
import Sidebar from '../../../Components/SideBar/SideBar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  query,
  where,
} from 'firebase/firestore';
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
        due: '2023-04-12',
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
        due: '2023-04-11',
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

type TodoItem = {
  text: string;
  due: string;
  member: string;
  done: boolean;
};

type TodoList = {
  title: string;
  items: TodoItem[];
};

type TodoState = TodoList[];

interface AddListAction {
  type: 'ADD_LIST';
  payload: string;
}

interface AddItemAction {
  type: 'ADD_ITEM';
  payload: {
    text: string;
    due: string;
    member: string;
  };
  listIndex: number;
}

interface MoveItemAction {
  type: 'MOVE_ITEM';
  payload: {
    source: {
      droppableId: number;
      index: number;
    };
    destination: {
      droppableId: number;
      index: number;
    };
  };
}

interface SetDataAction {
  type: 'SET_DATA';
  payload: {
    source: {
      droppableId: number;
      index: number;
    };
    destination: {
      droppableId: number;
      index: number;
    };
  };
}

type TodoAction =
  | AddListAction
  | AddItemAction
  | MoveItemAction
  | SetDataAction;

export const todoReducer = (state: TodoState, action: TodoAction) => {
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
    case 'SET_DATA':
      return action.payload; // update state with todosData
    default:
      return state;
  }
};
const getTodosData = async () => {
  const familyDocRef = collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'todo');
  const querySnapshot = await getDocs(familyDocRef);
  const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
  return todosData;
};

const Todo = () => {
  const [data, dispatch] = useReducer(todoReducer, []);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  console.log(data);
  useEffect(() => {
    localStorage.setItem('List', JSON.stringify(data));
  }, [data]);

  const addList = () => {
    const title = prompt('Enter list title');
    title && dispatch({ type: 'ADD_LIST', payload: title });
  };

  const dueDateRef = useRef<HTMLInputElement>(null);

  const addItem = (listIndex: number) => {
    const text = prompt('Enter item text');
    const dueDateString = dueDateRef.current ? dueDateRef.current.value : '';
    const due = new Date(dueDateString);

    const member = prompt('Enter member name');
    const done = false;
    if (text && due && member) {
      const newItem = { text, due, member, done };
      dispatch({ type: 'ADD_ITEM', payload: newItem, listIndex });
    }
  };

  useEffect(() => {
    const fetchTodosData = async () => {
      const todosData = await getTodosData();
      dispatch({ type: 'SET_DATA', payload: todosData }); // update data state with todosData
    };
    fetchTodosData();
  }, []);

  useEffect(() => {
    const familyDocRef = doc(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9');
    async function updateData() {
      try {
        await updateDoc(familyDocRef, { todo: data });
        console.log('Data has been updated in Firestore!');
      } catch (error) {
        console.error('Error updating data in Firestore: ', error);
      }
    }

    updateData();
  }, [data]);

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
};

export default Todo;
