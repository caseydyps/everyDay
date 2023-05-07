import styled from 'styled-components/macro';
import {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  Dispatch,
} from 'react';
import { AuthContext } from '../../../config/Context/authContext';
import DragNDrop from './DragNDrop';
import { nanoid } from 'nanoid';
import Sidebar from '../../../Components/Nav/Navbar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import SideNav from '../../../Components/Nav/SideNav';
import Banner from '../../../Components/Banner/Banner';
import Layout from '../../../Components/layout';
import SmartInput from '../../AI/SmartInput';
import { ChatMini } from '../Dashboard';
import DefaultButton, { AddButton } from '../../../Components/Button/Button';
import { CloseButton } from '../../../Components/Button/Button';
import UserAuthData from '../../../Components/Login/Auth';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
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
} from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  //border: 3px solid red;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 80px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
  //border: gold solid 3px;
`;

const AddListButton: any = styled(DefaultButton)`
  padding: 5px;
  margin-left: 20px;
  width: 120px;
  height: 50px;
  position: sticky;
  border-radius: 25px;
  color: #5981b0;
  background-color: #f6f8f8;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #4caf50;

  color: white;
  font-size: 16px;
  margin: 10px;
`;

const defaultList = [
  {
    title: 'Todo',
    items: [],
  },
  {
    title: 'Doing',
    items: [],
  },
  {
    title: 'Done',
    items: [],
  },
];

const defaultData = defaultList.map((list) => ({
  ...list,
  id: nanoid(),
}));

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
type ActionType =
  | {
      type: 'ADD_ITEM';
      payload: {
        text: string;
        due: Date;
        member: string;
        done: boolean;
      };
      listIndex: number;
    }
  | {
      type: 'ADD_LIST';
      payload: { title: string; items: never[] };
    }
  | {
      type: 'SET_DATA';
      payload: any;
    };

type TodoAction =
  | AddListAction
  | AddItemAction
  | MoveItemAction
  | SetDataAction;

export const todoReducer = (state: TodoState, action: TodoAction) => {
  switch (action.type) {
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
    case 'ADD_LIST':
      return [...state, { title: action.payload, items: [] }];
  }
};
const getTodosData = async () => {
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
  console.log(familyId);
  const familyDocRef = collection(db, 'Family', familyId, 'todo');
  const querySnapshot = await getDocs(familyDocRef);
  const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
  console.log(todosData);
  return todosData;
};

const Todo = () => {
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
  //const { membersArray } = useContext(AuthContext);
  const [data, dispatch] = useReducer<any>(todoReducer, [defaultData]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  console.log(data);
  // useEffect(() => {
  //   localStorage.setItem('List', JSON.stringify(data));
  // }, [data]);

  const addList = async (dispatch: Dispatch<ActionType>) => {
    const title = prompt('Enter the title for the new list:');

    if (title) {
      const listRef = doc(db, 'Family', familyId, 'todo', title);
      const newItem = {
        title: title,
        items: [],
      };

      try {
        await setDoc(listRef, newItem);
        console.log('New list created in Firestore!');
        dispatch({ type: 'ADD_LIST', payload: newItem });
      } catch (error) {
        console.error('Error creating new list in Firestore: ', error);
      }
    }
  };

  const dueDateRef = useRef<HTMLInputElement>(null);

  const addItem = (listIndex: number, dispatch: Dispatch<ActionType>) => {
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
    const fetchTodosData = async (dispatch: Dispatch<ActionType>) => {
      console.log(familyId);
      const familyDocRef = collection(db, 'Family', familyId, 'todo');
      const unsubscribe = onSnapshot(familyDocRef, (querySnapshot) => {
        const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
        console.log(todosData);

        // Always ensure todosData is an array
        const todosArray = Array.isArray(todosData) ? todosData : [];

        dispatch({ type: 'SET_DATA', payload: todosArray });
      });

      return () => unsubscribe();
    };
    fetchTodosData(dispatch);
  }, [familyId]);

  useEffect(() => {
    async function updateData() {
      console.log(familyId);
      const familyDocRef = doc(db, 'Family', familyId);
      try {
        await updateDoc(familyDocRef, { todo: data });
        console.log('Data has been updated in Firestore!');
      } catch (error) {
        console.error('Error updating data in Firestore: ', error);
      }
    }

    updateData();
  }, [data, familyId]);

  const [showSmartInput, setShowSmartInput] = useState(false);
  const handleButtonClick = () => {
    setShowSmartInput(!showSmartInput);
  };

  const SmartInputContainer = styled.div`
    max-width: 800px;
    position: fixed;
    z-index: 6;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(10px);

    // border: 2px solid black;
  `;

  const RowWrap = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const InputButton = styled(AddButton)`
    position: absolute;
    bottom: 90px;
    right: 10px;
  `;
  const AddListButton = styled(AddButton)`
    position: absolute;
    bottom: 170px;
    right: 10px;
  `;

  return (
    <Container>
      <SideNav></SideNav>
      <Wrapper>
        <ChatMini />
        <AddListButton onClick={() => addList(dispatch)}>
          Add List
          {/* <FontAwesomeIcon icon={faPlus} beat></FontAwesomeIcon> */}
        </AddListButton>
        <InputButton onClick={handleButtonClick}>Smart Input</InputButton>
        <Banner title="Todo" subTitle="Get Things Done"></Banner>

        {showSmartInput && (
          <SmartInputContainer>
            <CloseButton
              style={{
                zIndex: '5',
                position: 'absolute',
                top: '10px',
                left: '10px',
              }}
              onClick={handleButtonClick}
            ></CloseButton>
            <SmartInput onClose={handleButtonClick}></SmartInput>
          </SmartInputContainer>
        )}

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
