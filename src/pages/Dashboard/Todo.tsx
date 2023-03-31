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

const AddItemButton = styled.button`
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

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LIST':
      return [...state, { title: action.payload, items: [] }];
    case 'ADD_ITEM':
      return state.map((list, index) =>
        index === action.listIndex
          ? { ...list, items: [...list.items, action.payload] }
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
  const [data, dispatch] = useReducer(todoReducer, defaultTodo);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  useEffect(() => {
    localStorage.setItem('List', JSON.stringify(data));
  }, [data]);

  const addList = () => {
    const title = prompt('Enter list title');
    title && dispatch({ type: 'ADD_LIST', payload: title });
  };

  const addItem = (listIndex) => {
    const item = prompt('Enter item text');
    if (item) {
      dispatch({ type: 'ADD_ITEM', payload: item, listIndex });
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
      <AddItemButton onClick={addItem}>Add New Item</AddItemButton>
    </>
  );
}

export default Todo;
