import { faCircleInfo, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ChatToggle } from '../../Components/Chat/ChatToggle';
import Swal from 'sweetalert2';
import { CloseButton, ThreeDButton } from '../../Components/Button/Button';
import SideNav from '../../Components/Nav/SideNav';
import SmartInput from './AI/SmartInput';
import Suggestion from './Widget/SuggestionWidget';
import Chat from './Widget/ChatWidget/ChatWidget';
import FamilyMemberForm from './Widget/FamilyWidget';
import Gallery from './Widget/GalleryWidget/GalleryWidget';
import CalendarMini from './Widget/CalendarWidget';
import Milestone from './Widget/MilestoneWidget';
import TodoDashboard from './Widget/TodoWidget/TodoWidget';
import WeatherApp from './Widget/WeatherWidget';
import Whiteboard from './Widget/WhiteboardWidget';

const Dashboard = () => {
  const [showSmartInput, setShowSmartInput] = useState(false);
  const Main = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
    @media screen and (max-width: 991px) {
      grid-template-columns: repeat(2, 200px);
      grid-template-rows: repeat(24, 100px);
    }
    @media screen and (max-width: 767px) {
      grid-template-columns: repeat(2, 200px);
      grid-template-rows: repeat(36, 100px);
    }

    @media screen and (max-width: 575px) {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(72, 100px);
    }
    @media screen and (max-width: 499px) {
      grid-template-columns: repeat(2, 200px) repeat(4, 0);
    }
  `;
  type GridItemType = {
    spanColumns: number;
    spanRows: number;
  };

  const GridItem = styled.div<GridItemType>`
    ${({ spanColumns, spanRows }) => `
    grid-column: span ${spanColumns};
    grid-row: span ${spanRows};
    width: auto;
    height: auto;
    position: relative;
     
   
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.2s ease-in-out;
  }
   &:hover {
    transform: scale(1);
    background-color: rgba(255, 255, 255, 0.25);
    transition: transform 0.2s ease-in-out;
  }
  `}

    border-radius: 20px;
    margin: 5px;
    background-color: transparent;
  `;

  const BoxS = styled.div`
    height: 120px;
    background-color: #3467a1;
    border-radius: 20px;
    position: relative;
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
  const InfoButton = styled(ThreeDButton)`
    padding: 10px;
    :hover {
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
        <a href="/todo" style={{ textDecoration: 'none' }}>
          <BoxM>
            <BoxTitle>Todo</BoxTitle>
            <TodoDashboard />
          </BoxM>
        </a>
      ),
      spanColumns: 2,
      spanRows: 4,
    },
    {
      component: (
        <a href="/ai" style={{ textDecoration: 'none' }}>
          <BoxM>
            <Link to="/ai"></Link>
            <BoxTitle>Suggestion</BoxTitle>
            <Suggestion></Suggestion>
          </BoxM>
        </a>
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
        <a href="/milestone" style={{ textDecoration: 'none' }}>
          <BoxL>
            <BoxTitle>Celebrate</BoxTitle>
            <Milestone></Milestone>
          </BoxL>
        </a>
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
        <a href="/calendar" style={{ textDecoration: 'none' }}>
          <BoxS style={{ backgroundColor: '#5981b0' }}>
            <CalendarMini />
          </BoxS>
        </a>
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
        <a href="/whiteboard" style={{ textDecoration: 'none' }}>
          <BoxXL>
            <Whiteboard />
          </BoxXL>
        </a>
      ),
      spanColumns: 6,
      spanRows: 4,
    },
  ]);

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

      heightAuto: false,
      position: 'center',
      reverseButtons: true,
    });
  };

  const SmartInputButton = styled(ThreeDButton)`
    width: 90px;
    margin: 0 auto;
    position: fixed;
    right: 10px;
    bottom: 100px;
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
        <Main>
          <SmartInputButton onClick={handleButtonClick}>
            Smart Input
          </SmartInputButton>
          <ChatToggle></ChatToggle>
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
                <SmartInput onClose={handleButtonClick}></SmartInput>
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
  font-family: 'Braah One';
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
`;

const SmartInputContainer = styled.div`
  max-width: 800px;
  position: fixed;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
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
