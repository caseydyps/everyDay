import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import DragNDrop from './DragNDropDashboard';
import TodoMini from './Todo/TodoMini';
import CalendarMini from './Calendar/CalendarMini';
import WhiteboardMini from './Whiteboard/WhiteboardMini';
import AlbumMini from './Album/AlbumMini';
import MilestoneMini from './MilestoneMini';
import Sidebar from '../../Components/SideBar/SideBar';
import Navbar from '../../Components/Navbar/Navbar';
import React from 'react';
import Socket from '../../Components/Chatbot/socket';
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
// const Wrapper = styled.div`
//   width: 100vw;
//   height: auto;
//   border: 2px solid black;
//   display: flex;
//   flex-direction: column;
//   flex-wrap: wrap;
// `;

// function Dashboard() {
//   const [componentOrder, setComponentOrder] = useState([
//     'WhiteboardMini',
//     'CalendarMini',
//     'TodoMini',
//     'AlbumMini',
//     'MilestoneMini',
//   ]);

//   const components = {
//     WhiteboardMini,
//     CalendarMini,
//     TodoMini,
//     AlbumMini,
//     MilestoneMini,
//   };

//   const moveComponentUp = (index) => {
//     if (index === 0) {
//       return;
//     }
//     const newOrder = [...componentOrder];
//     [newOrder[index - 1], newOrder[index]] = [
//       newOrder[index],
//       newOrder[index - 1],
//     ];
//     setComponentOrder(newOrder);
//   };

//   const moveComponentDown = (index) => {
//     if (index === componentOrder.length - 1) {
//       return;
//     }
//     const newOrder = [...componentOrder];
//     [newOrder[index], newOrder[index + 1]] = [
//       newOrder[index + 1],
//       newOrder[index],
//     ];
//     setComponentOrder(newOrder);
//   };
//   return (
//     <Container>
//       <Sidebar />
//       <Wrapper>
//         {componentOrder.map((component, index) => (
//           <RowWrap key={index}>
//             {React.createElement(components[component], {})}
//             <div>
//               <button onClick={() => moveComponentUp(index)}>Move Up</button>
//               <button onClick={() => moveComponentDown(index)}>
//                 Move Down
//               </button>
//             </div>
//           </RowWrap>
//         ))}
//       </Wrapper>
//     </Container>
//   );
// }

// export default Dashboard;

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
      components: [<TodoMini />, <CalendarMini />, <AlbumMini />],
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
      <Socket />
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
