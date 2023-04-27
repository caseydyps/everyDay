import styled from 'styled-components/macro';
import { useState, useEffect, useRef } from 'react';
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
import SideNav from '../../Components/Nav/SideNav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleChevronDown,
  faCircleChevronUp,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;

  border: 2px solid black;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: space-between;
`;

type Wrap = {
  isCentered: boolean;
};

const Wrap = styled.div<Wrap>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: ${({ isCentered }) =>
    isCentered ? 'center' : 'space-between'};
`;
const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  // border: 2px solid blue;
`;

const Slogan = styled.div`
  word-wrap: break-word;
  font-size: 48px;
  width: 200px;
  color: white;
  line-height: 0.9;
  font-family: 'Pacifico';

  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 1180px) {
    display: none;
  }
`;

const SmallSlogan = styled.div`
  word-wrap: break-word;
  font-size: 20px;
  color: #f5f5f5;
  font-family: 'Pacifico';
  margin-top: 20px;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
`;

const Block = styled.div`
  display: flex;
  flex: 1;
`;

const Dashboard = () => {
  const [showAside, setShowAside] = useState(true);
  const Card = styled.div`
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    text-align: center;
  `;

  const Aside = styled.div`
    padding: 20px;
    max-width: 200px;
    border: 2px solid purple;
    flex: 3;
  `;

  const Main = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    border: 2px solid purple;
    min-width: 800px;
    align-items: center;
    padding: 20px;
    margin: 0 auto;
  `;

  const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 120px);
    grid-template-rows: repeat(12, 60px);
    grid-gap: 5px;
    width: 100%;

    /* media query for screens narrower than 1200px */
    /* @media screen and (max-width: 1267px) {
      grid-template-columns: repeat(4, 200px);
      grid-template-rows: repeat(18, 100px);
    } */

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
  type GridItemType = {
    spanColumns: number;
    spanRows: number;
  };

  const GridItem = styled.div<GridItemType>`
    /* set grid column and row spans for each item */
    ${({ spanColumns, spanRows }) => `
    grid-column: span ${spanColumns};
    grid-row: span ${spanRows};
    position: relative;
  `}

    border-radius: 20px;
    margin: 5px;
    background-color: transparent;
    // padding: 10px;
    // box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  `;

  const BoxS = styled.div`
    width: 120px;
    height: 120px;
    background-color: #3467a1;
    border-radius: 20px;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
  `;

  const BoxM = styled.div`
    border-radius: 20px;
    width: 240px;
    height: 240px;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
    background-color: rgb(255, 255, 255, 0.5);
  `;
  const BoxL = styled.div`
    width: 480px;
    height: 240px;
    background-color: rgb(255, 255, 255, 0.5);
    border-radius: 20px;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
  `;

  const BoxXL = styled.div`
    width: 720px;
    height: 240px;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
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

  const ToggleButton = styled(DefaultButton)`
    background-color: transparent;
    padding: 0px;
    border: none;
    box-shadow: none;
    color: rgba(255, 255, 255, 0.5);
  `;

  const Wrap = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 60px;
    padding: 20px;
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
        <BoxM>
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
      component: <BoxXL>{/* <Whiteboard /> */}</BoxXL>,
      spanColumns: 6,
      spanRows: 4,
    },
  ]);

  const handleRowChange = (index: number, value: number) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
    console.log(newGridItems);
  };
  console.log(gridItems);

  const [sideNavWidth, setSideNavWidth] = useState(200);

  const AsideWrap = ({ show }: boolean) => {
    return <div style={{ display: show ? 'block' : 'none' }}></div>;
  };

  const handleResize = () => {
    setSideNavWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container>
      <SideNav />

      <Wrap>
        {/* <AsideWrap show={sideNavWidth >= 150}>
          <Aside>
            <Slogan>One home, one team, one victory!</Slogan>
            <SmallSlogan>We're Better Together</SmallSlogan>
          </Aside>
        </AsideWrap> */}

        <Main>
          <Grid>
            {gridItems.map((item, index) => (
              <GridItem
                key={index}
                spanColumns={item.spanColumns}
                spanRows={item.spanRows}
              >
                {item.component}
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
      </Wrap>
    </Container>
  );
};

export default Dashboard;
