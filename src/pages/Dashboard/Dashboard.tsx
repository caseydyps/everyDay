import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import DragNDrop from './DragNDropDashboard';
import TodoMini from './Todo/TodoMini';
import CalendarMini from './Calendar/CalendarMini';
import WhiteboardMini from './Whiteboard/WhiteboardMini';
import Gallery from './Album/Gallery';
import MilestoneMini from './MilestoneMini';
import Sidebar from '../../Components/SideBar/SideBar';
import Navbar from '../../Components/Navbar/Navbar';
import React from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: row; ;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: space-between;
`;
const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 2px solid blue;
`;

const Block = styled.div`
  display: flex;
  flex: 1;
`;

const Dashboard = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      color: '#BBDEFB',
      components: [<WhiteboardMini />],
    },
    {
      id: 2,
      color: '#90CAF9',
      components: [<TodoMini />, <CalendarMini />, <Gallery />],
    },
    {
      id: 3,
      color: '#64B5F6',
      components: [<MilestoneMini />],
    },
  ]);

  const moveRowUp = (index: number) => {
    if (index > 0) {
      const newRows = [...rows];
      const temp = newRows[index - 1];
      newRows[index - 1] = newRows[index];
      newRows[index] = temp;
      setRows(newRows);
    }
  };

  const moveRowDown = (index: number) => {
    if (index < rows.length - 1) {
      const newRows = [...rows];
      const temp = newRows[index + 1];
      newRows[index + 1] = newRows[index];
      newRows[index] = temp;
      setRows(newRows);
    }
  };

  return (
    <Container>
      <Sidebar />

      <ColumnWrap>
        <Navbar />
        {rows.map((row, index) => (
          <>
            <RowWrap key={row.id} style={{ backgroundColor: row.color }}>
              {row.components.map((component, componentIndex) => (
                <Block key={componentIndex}>{component}</Block>
              ))}
            </RowWrap>
            <div>
              <button onClick={() => moveRowUp(index)}>Move Up</button>
              <button onClick={() => moveRowDown(index)}>Move Down</button>
            </div>
          </>
        ))}
      </ColumnWrap>
    </Container>
  );
};

export default Dashboard;
