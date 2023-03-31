import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import DragNDrop from './DragNDrop';

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const defaultTodo = [
  { title: 'Todo', items: ['Eat out', 'take out garbage'] },
  { title: 'Doing', items: ['Todo1', 'Todo2', 'Todo3'] },
  { title: 'Done', items: ['Todo3'] },
];

function Todo() {
  const [data, setData] = useState();
  useEffect(() => {
    if (localStorage.getItem('Todo')) {
      console.log(localStorage.getItem('Todo'));
      setData(JSON.parse(localStorage.getItem('Todo')));
    } else {
      setData(defaultTodo);
    }
  }, [setData]);

  return (
    <Wrapper>
      <DragNDrop data={data} />
    </Wrapper>
  );
}
export default Todo;
