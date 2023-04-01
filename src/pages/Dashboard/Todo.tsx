import styled from 'styled-components/macro';
import { useState, useEffect, useReducer } from 'react';
import DragNDrop from './DragNDrop';

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
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

const defaultTodo = [
  { title: 'Todo', items: ['Eat out', 'take out garbage'] },
  { title: 'Doing', items: ['Todo1', 'Todo2', 'Todo3'] },
  { title: 'Done', items: ['Todo3'] },
];

const testData = [
  {
    title: 'Due Today',
    items: [
      { text: 'Task 1', due: '4/1', member: 'John', done: false },
      { text: 'Task 2', due: '4/2', member: 'Jane', done: true },
      { text: 'Task 3', due: '4/3', member: 'Bob', done: false },
    ],
  },
  {
    title: 'Due Tomorrow',
    items: [
      { text: 'Task 4', due: '4/4', member: 'John', done: false },
      { text: 'Task 5', due: '4/5', member: 'Jane', done: true },
      { text: 'Task 6', due: '4/6', member: 'Bob', done: false },
    ],
  },
  {
    title: 'Done',
    items: [
      { text: 'Task 7', due: '4/7', member: 'John', done: true },
      { text: 'Task 8', due: '4/8', member: 'Jane', done: true },
      { text: 'Task 9', due: '4/9', member: 'Bob', done: true },
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
  const [data, dispatch] = useReducer(todoReducer, testData);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  useEffect(() => {
    localStorage.setItem('List', JSON.stringify(data));
  }, [data]);

  const addList = () => {
    const title = prompt('Enter list title');
    title && dispatch({ type: 'ADD_LIST', payload: title });
  };

 

  const addItem = (listIndex) => {
    const text = prompt('Enter item text');
    const due = prompt('Enter due date');
    const member = prompt('Enter member name');
    const done = false;
    if (text && due && member) {
      const newItem = { text, due, member, done };
      dispatch({ type: 'ADD_ITEM', payload: newItem, listIndex });
    }
  };

  return (
    <>
      <Wrapper>
        <DragNDrop
          data={data}
          onItemAdd={addItem}
          selectedItemIndex={selectedItemIndex}
          setSelectedItemIndex={setSelectedItemIndex}
        />
      </Wrapper>
      <AddListButton onClick={addList}>Add New List</AddListButton>
    </>
  );
}

export default Todo;
