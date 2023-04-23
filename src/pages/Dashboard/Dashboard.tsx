import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import TodoDashboard from './Todo/TodoDashboard';
import Whiteboard from './Whiteboard/WhiteboardMini';
import Gallery from './Album/GalleryMini';
import Milestone from './MilestoneMini';
import Sidebar from '../../Components/Nav/Navbar';
import Navbar from '../../Components/Navbar/Navbar';
import React from 'react';
import Layout from '../../Components/layout';
import GridLayout from 'react-grid-layout';
import WeatherApp from './WeatherApp';
import CalendarMini from './Calendar/CalendarMini';
import Financial from './Financial';
import Suggestion from '../AI/SuggestionMini';
import FamilyMemberForm from '../Family/FamilyMini';
import DefaultButton from '../../Components/Button/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleChevronDown,
  faCircleChevronUp,
} from '@fortawesome/free-solid-svg-icons';

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
  line-height: 0.9;
  font-family: 'Pacifico';
  top: 35%;
  left: 5%;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 1664px) {
    color: transparent;
    text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  }
`;

const SmallSlogan = styled.div`
  position: absolute;
  word-wrap: break-word;
  font-size: 36px;
  color: #666;
  top: 66%;
  left: 5%;
  @media screen and (max-width: 1664px) {
    color: transparent;
  }
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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  `;

  const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 200px);
    grid-template-rows: repeat(12, 100px);
    grid-gap: 10px;
    width: 100%;

    /* media query for screens narrower than 1200px */
    @media screen and (max-width: 1267px) {
      grid-template-columns: repeat(4, 200px);
      grid-template-rows: repeat(18, 100px);
    }

    /* media query for screens narrower than 992px */
    @media screen and (max-width: 991px) {
      grid-template-columns: repeat(2, 200px);
      grid-template-rows: repeat(24, 100px);
    }

    /* media query for screens narrower than 768px */
    @media screen and (max-width: 767px) {
      grid-template-columns: repeat(2, 200px);
      grid-template-rows: repeat(36, 100px);
    }

    /* media query for screens narrower than 576px */
    @media screen and (max-width: 575px) {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(72, 100px);
    }

    /* media query for screens narrower than 500px */
    @media screen and (max-width: 499px) {
      /* adjust grid-template-columns for the first row */
      grid-template-columns: repeat(2, 200px) repeat(4, 0);
    }
  `;

  const GridItem = styled.div`
    /* set grid column and row spans for each item */
    ${({ spanColumns, spanRows }) => `
    grid-column: span ${spanColumns};
    grid-row: span ${spanRows};
    position: relative;
  `}

    border-radius: 20px;
    margin: 10px;
    background-color: #transparent;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  `;

  const BoxS = styled.div`
    width: 100%;
    height: 100%;
    background-color: #eb7a53;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  `;

  const BoxM = styled.div`
    background-color: rgba(64, 64, 64, 0.5);
    border-radius: 20px;
    width: 100%;
    height: 100%;
  `;
  const BoxL = styled.div`
    background-color: rgba(192, 192, 192, 0.5);
    width: 100%;
    height: 100%;

    border-radius: 20px;
  `;

  const BoxXL = styled.div`
    width: 100%;
    height: 100%;

    border-radius: 20px;
  `;

  const ButtonWrap = styled.div`
    position: absolute;
    bottom: 0px;
    right: 5px;
  `;

  const Button = styled(DefaultButton)`
    background-color: transparent;
    padding: 0px;
    color: rgba(255, 255, 255, 0.5);
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
      component: (
        <BoxM style={{ backgroundColor: 'rgba(192, 192, 192, 0.5)' }}>
          <Suggestion></Suggestion>
        </BoxM>
      ),
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: (
        <BoxM>
          <Gallery></Gallery>
        </BoxM>
      ),
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: (
        <BoxL>
          <Milestone></Milestone>
        </BoxL>
      ),
      spanColumns: 4,
      spanRows: 4,
    },
    {
      component: (
        <BoxS>
          <WeatherApp></WeatherApp>
        </BoxS>
      ),
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: (
        <BoxS style={{ backgroundColor: '#666' }}>
          <Financial></Financial>
        </BoxS>
      ),
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: (
        <BoxS style={{ backgroundColor: '#f5f5f5' }}>
          <CalendarMini />
        </BoxS>
      ),
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: (
        <BoxS>
          <FamilyMemberForm></FamilyMemberForm>
        </BoxS>
      ),
      spanColumns: 1,
      spanRows: 2,
    },

    {
      component: (
        <BoxXL>
          <Whiteboard />
        </BoxXL>
      ),
      spanColumns: 6,
      spanRows: 4,
    },
  ]);

  const handleColumnChange = (index, value) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
    console.log(newGridItems);
  };

  const handleRowChange = (index, value) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
    console.log(newGridItems);
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

                  {/* <button onClick={() => handleColumnChange(index, 1)}>
                      Move Right
                    </button>
                    <button onClick={() => handleColumnChange(index, -1)}>
                      Move Left
                    </button> */}
                  <ButtonWrap>
                    <Button onClick={() => handleRowChange(index, 1)}>
                      <FontAwesomeIcon icon={faCircleChevronDown} />
                    </Button>
                    <Button onClick={() => handleRowChange(index, -1)}>
                      <FontAwesomeIcon icon={faCircleChevronUp} />
                    </Button>
                  </ButtonWrap>
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
