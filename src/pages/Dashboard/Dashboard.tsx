import styled from 'styled-components/macro';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
import SmartInput from '../AI/SmartInput';
import CalendarMini from './Calendar/CalendarMini';
import Financial from './Financial';
import Suggestion from '../AI/SuggestionMini';
import FamilyMemberForm from '../Family/FamilyMini';
import DefaultButton, {
  CloseButton,
  ThreeDButton,
} from '../../Components/Button/Button';
import SideNav from '../../Components/Nav/SideNav';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleChevronDown,
  faCircleChevronUp,
  faToggleOff,
  faCircleInfo,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;

  // border: 2px solid black;
`;

const SmartInputContainer = styled.div`
  max-width: 800px;
  position: fixed;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);

  // border: 2px solid black;
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
  const [showSmartInput, setShowSmartInput] = useState(false);
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
    //border: 2px solid purple;
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
    position: relative;
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
    width: auto;
    height: auto;
    position: relative;
     
   // box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.2s ease-in-out;
  }
   &:hover {
    transform: scale(0.95);
    background-color: rgba(255, 255, 255, 0.25);
    transition: transform 0.2s ease-in-out;
  }
  `}

    border-radius: 20px;
    margin: 5px;
    background-color: transparent;
    // padding: 10px;
    // box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  `;

  const BoxS = styled.div`
    height: 120px;
    background-color: #3467a1;
    border-radius: 20px;
    position: relative;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    border-radius: 12px;
    -webkit-border-radius: 12px;
    color: rgba(255, 255, 255, 0.75);
  `;

  const BoxM = styled.div`
    height: 240px;
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    border-radius: 12px;
    -webkit-border-radius: 12px;
    color: rgba(255, 255, 255, 0.75);
    justify-content: center;
    align-items: center;
    display: flex;
  `;
  const BoxL = styled.div`
    height: 240px;

    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    border-radius: 12px;
    -webkit-border-radius: 12px;
    color: rgba(255, 255, 255, 0.75);
  `;

  const BoxXL = styled.div`
    height: 240px;
    /* -webkit-box-shadow: 3px 3px 5px black;
    -moz-box-shadow: 3px 3px 5px black;
    box-shadow: 3px 3px 5px black; */
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
    border-radius: 12px;
    -webkit-border-radius: 12px;
    color: rgba(255, 255, 255, 0.75);
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
    border: none;
    box-shadow: none;
    :hover {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.75);
    }
  `;

  const InfoButton = styled(DefaultButton)`
    background-color: transparent;
    padding: 0px;
    color: rgba(255, 255, 255, 0.5);
    border: none;
    box-shadow: none;
    :hover {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.75);
    }
    position: absolute;
    right: 0px;
    top: 0px;
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
          <BoxTitle>Todo</BoxTitle>
          <TodoDashboard />
        </BoxM>
      ),
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: (
        <BoxM>
          <Link to="/ai"></Link>
          <BoxTitle>Suggestion</BoxTitle>
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
    // {
    //   component: (
    //     <BoxS style={{ backgroundColor: ' rgba(89, 89, 89, 0.25)' }}>
    //       <Financial></Financial>
    //     </BoxS>
    //   ),
    //   spanColumns: 1,
    //   spanRows: 2,
    // },
    {
      component: (
        <BoxS style={{ backgroundColor: '#5981b0' }}>
          <CalendarMini />
        </BoxS>
      ),
      spanColumns: 1,
      spanRows: 2,
    },
    {
      component: (
        <BoxS>
          <BoxTitle>Family</BoxTitle>
          <FamilyMemberForm></FamilyMemberForm>
        </BoxS>
      ),
      spanColumns: 2,
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

  const handleRowChange = (index: number, value: number) => {
    const newGridItems = [...gridItems];
    const removed = newGridItems.splice(index, 1);
    newGridItems.splice(index + value, 0, removed[0]);
    setGridItems(newGridItems);
    console.log(newGridItems);
  };
  console.log(gridItems);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: any) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: any) => {
    e.preventDefault();
    const dragIndex: any = e.dataTransfer.getData('text/plain');
    if (dragIndex !== index) {
      const newGridItems = [...gridItems];
      const draggedItem = newGridItems[dragIndex];
      newGridItems.splice(dragIndex, 1);
      newGridItems.splice(index, 0, draggedItem);
      setGridItems(newGridItems);
    }
  };
  const handleInfoClick = () => {
    Swal.fire({
      html: 'You can drag the box to change its position.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#1E3D6B',
      focusConfirm: false,
      allowOutsideClick: false,
      icon: 'info',
      iconColor: '#1E3D6B',
      background: '#F6F8F8',
      padding: '1rem',
      width: '300px',
      // height: '200px',
      heightAuto: false,
      position: 'center',
      reverseButtons: true,
    });
  };

  const SmartInputButton = styled(ThreeDButton)`
    width: 90px;
    margin: 0 auto;
    position: absolute;
    right: 10px;
    top: 150px;
    text-align: center;
    margin: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background-color: #5981b0;
    color: #f6f8f8;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #3467a1;
      color: white;
    }
  `;

  const handleButtonClick = () => {
    setShowSmartInput(!showSmartInput);
  };

  return (
    <Container>
      <SideNav />
      <Wrap>
        <SmartInputButton onClick={handleButtonClick}>
          Smart Input
        </SmartInputButton>
        <Main>
          <Grid>
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
                <SmartInput style={{ position: 'relative' }}></SmartInput>
              </SmartInputContainer>
            )}
            <InfoButton onClick={handleInfoClick}>
              <FontAwesomeIcon icon={faCircleInfo} />
            </InfoButton>
            {gridItems.map((item, index) => (
              <GridItem
                key={index}
                spanColumns={item.spanColumns}
                spanRows={item.spanRows}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
              >
                {item.component}
                {/* <ButtonWrap>
                  <Button onClick={() => handleRowChange(index, 1)}>
                    <FontAwesomeIcon icon={faCircleChevronDown} />
                  </Button>
                  <Button onClick={() => handleRowChange(index, -1)}>
                    <FontAwesomeIcon icon={faCircleChevronUp} />
                  </Button>
                </ButtonWrap> */}
              </GridItem>
            ))}
          </Grid>
        </Main>
      </Wrap>
    </Container>
  );
};

export default Dashboard;

const BoxTitle = styled.h4`
  color: #414141;
  position: absolute;
  top: -10px;
  left: 10px;
  padding: 0;
`;
