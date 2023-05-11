import 'firebase/firestore';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import {
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { AuthContext } from '../../../../config/Context/authContext';
import { db } from '../../../../config/firebase.config';
import DragNDrop from './TodoItem';
import React from 'react';
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 150px;
  max-width: 200px;
`;

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
      payload: string;
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
      return action.payload;
    default:
      return state;
    case 'ADD_LIST':
      return [...state, { title: action.payload, items: [] }];
  }
};

const Todo = () => {
  const { familyId, membersArray } = useContext(AuthContext);
  const [data, dispatch] = useReducer<any>(todoReducer, []);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
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
      const familyDocRef = collection(db, 'Family', familyId, 'todo');
      const querySnapshot = await getDocs(familyDocRef);
      const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      dispatch({ type: 'SET_DATA', payload: todosData });
    };
    fetchTodosData(dispatch);
  }, [familyId]);

  useEffect(() => {
    async function updateData() {
      const familyDocRef = doc(db, 'Family', familyId);
      try {
        await updateDoc(familyDocRef, { todo: data });
      } catch (error) {
        console.error('Error updating data in Firestore: ', error);
      }
    }

    updateData();
  }, [data, familyId]);

  return (
    <Container>
      <Wrapper>
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
