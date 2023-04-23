import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
// import DragNDrop from './DragNDropDashboard';
import TodoDashboard from './Todo/TodoDashboard';
import CalendarDashboard from './Calendar/CalendarDashboard';
import Whiteboard from './Whiteboard/WhiteboardMini';
import Gallery from './Album/Gallery';
import Milestone from './MilestoneMini';
import Sidebar from '../../Components/Nav/Navbar';
import Navbar from '../../Components/Navbar/Navbar';
import React from 'react';
import Layout from '../../Components/layout';
import GridLayout from 'react-grid-layout';
import TodoMini from './Todo/TodoMini';
import CalendarMini from './Calendar/CalendarMini';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 70px;
  background-color: #transparent;
  width: 100vw;
  height: 100%;
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
  // border: 2px solid blue;
`;

const Slogan = styled.div`
  position: absolute;
  word-wrap: break-word;
  font-size: 72px;
  width: 400px;
  color: white;
  top: 40%;
  left: 5%;
`;

const SmallSlogan = styled.div`
  position: absolute;
  word-wrap: break-word;
  font-size: 36px;
  color: #666;
  top: 80%;
  left: 5%;
`;

const Block = styled.div`
  display: flex;
  flex: 1;
`;

const Dashboard = () => {
  const Card = styled.div`
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    text-align: center;
  `;

  const Aside = styled.div``;

  const Main = styled.div`
    border: 2px solid blue;
  `;

  const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 200px);
    grid-template-rows: repeat(12, 100px);
    grid-gap: 10px;
  `;

  const GridItem = styled.div`
    /* set grid column and row spans for each item */
    ${({ spanColumns, spanRows }) => `
    grid-column: span ${spanColumns};
    grid-row: span ${spanRows};
    
  `}

    border-radius: 20px;
    margin: 10px;
    background-color: #transparent;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  `;

  const BoxS = styled.div`
    background-color: #f2f2f2;
    border: 2px solid red;
    width: 100%;
    height: 100%;
  `;

  const BoxM = styled.div`
    background-color: red;
    border: 2px solid red;
    width: 100%;
    height: 100%;
  `;
  const BoxL = styled.div`
    background-color: rgba(192, 192, 192, 0.5);
    width: 100%;
    height: 100%;

    border-radius: 20px;
  `;

  const [gridItems, setGridItems] = useState([
    {
      component: (
        <BoxM>
          <TodoDashboard />
        </BoxM>
      ),
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: <BoxM>Calendar</BoxM>,
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: <BoxM></BoxM>,
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: (
        <BoxL>
          MileStone<Milestone></Milestone>
        </BoxL>
      ),
      spanColumns: 4,
      spanRows: 4,
    },
    {
      component: <BoxS></BoxS>,
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: <BoxS></BoxS>,
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: <BoxS></BoxS>,
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: <BoxS></BoxS>,
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: <Whiteboard />,
      spanColumns: 6,
      spanRows: 4,
    },
  ]);

  const handleColumnChange = (index, value) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
  };

  const handleRowChange = (index, value) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
  };
  console.log(gridItems);

  return (
    <Layout>
      <Container>
        <RowWrap>
          <Aside>
            <Slogan>One home, one team, one victory!</Slogan>
            <SmallSlogan>Every day counts</SmallSlogan>
          </Aside>
          <Main>
            {/* <Grid>
              <GridItem spanColumns={2} spanRows={4}>
                Todo
              </GridItem>
              <GridItem spanColumns={2} spanRows={4}>
                Calendar
              </GridItem>
              <GridItem spanColumns={2} spanRows={4}>
                Ai
              </GridItem>
              <GridItem spanColumns={4} spanRows={4}>
                Milestone
              </GridItem>
              <GridItem spanColumns={1} spanRows={2}>
                Family
              </GridItem>
              <GridItem spanColumns={1} spanRows={2}>
                Family
              </GridItem>
              <GridItem spanColumns={1} spanRows={2}>
                Family
              </GridItem>
              <GridItem spanColumns={1} spanRows={2}>
                Album
              </GridItem>
              <GridItem spanColumns={6} spanRows={4}>
                <Whiteboard />
              </GridItem>
            </Grid> */}
            <Grid>
              {gridItems.map((item, index) => (
                <GridItem
                  key={index}
                  spanColumns={item.spanColumns}
                  spanRows={item.spanRows}
                >
                  {item.component}
                  <div>
                    <button onClick={() => handleColumnChange(index, 1)}>
                      Move Right
                    </button>
                    <button onClick={() => handleColumnChange(index, -1)}>
                      Move Left
                    </button>
                    <button onClick={() => handleRowChange(index, 1)}>
                      Move Down
                    </button>
                    <button onClick={() => handleRowChange(index, -1)}>
                      Move Up
                    </button>
                  </div>
                </GridItem>
              ))}
            </Grid>
          </Main>
        </RowWrap>
      </Container>
    </Layout>
  );
};

export default Dashboard;
