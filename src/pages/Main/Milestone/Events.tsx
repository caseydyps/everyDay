import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import DefaultButton, { ThreeDButton } from '../../../Components/Button/Button';
import {
  faCircleXmark,
  faEllipsisH,
  faFilter,
  faPenToSquare,
  faPlus,
  faPlusCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Events = ({
  events,
  filterEvents,
  eventWrapWidth,
  setEventWrapWidth,
  showButtons,
  handleEditEvent,
  handleDeleteEvent,
  handleToggleButtons,
}) => {
  return (
    <EventContainer>
      {filterEvents(events)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((event, index) => {
          const dateObj = new Date(event.date);
          const monthName = dateObj.toLocaleString('default', {
            month: 'short',
          });
          return (
            <EventWrap
              key={event.id}
              onLayout={(event) =>
                setEventWrapWidth(event.nativeEvent.layout.width)
              }
            >
              <Dot eventWrapWidth={eventWrapWidth} index={index} />
              <EventBox index={index}>
                <ColumnWrap>
                  <EventImage
                    src={
                      event.image ||
                      'https://source.unsplash.com/random/?city,night'
                    }
                    alt=""
                  />
                  <DateBox>
                    <DateInfo>
                      <Month>{monthName}</Month>
                      <Day>{dateObj.getDate()}</Day>
                      <Year>{dateObj.getFullYear()}</Year>
                    </DateInfo>
                  </DateBox>
                  <InfoWrap>
                    <EventTitle>{event.title}</EventTitle>
                    <EventTitle>|</EventTitle>
                    <EventTitle>{event.member}</EventTitle>
                  </InfoWrap>
                  <ButtonRowWrap>
                    {showButtons && (
                      <>
                        <Button onClick={() => handleEditEvent(event)}>
                          <AnimatedFontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                        <Button onClick={() => handleDeleteEvent(event.id)}>
                          <AnimatedFontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </>
                    )}
                    <MoreButton onClick={handleToggleButtons}>
                      <AnimatedFontAwesomeIcon icon={faEllipsisH} />
                    </MoreButton>
                  </ButtonRowWrap>
                </ColumnWrap>
              </EventBox>
            </EventWrap>
          );
        })}
    </EventContainer>
  );
};

const Button = styled(ThreeDButton)`
  margin: 5px;
  padding: 10px;
  border-radius: 25px;
  border: 2px solid #5981b0;
  background-color: #5981b0;
  color: #f6f8f8;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  :hover {
    background-color: #3467a1;
  }
`;

const AnimatedFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const DateInfo = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type Dot = {
  eventWrapWidth: any;
};

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 #3467a1;
  }
  70% {
    box-shadow: 0 0 0 15px rgba(0, 255, 204, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 204, 0);
  }
`;

type EventWrapType = {
  onLayout?: (event: Event) => void;
};

const Dot = styled.div<Dot>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3467a1;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.index % 2 === 0 ? '50%' : '50%')};
  transform: translate(-50%, -50%);
  transition: opacity 0.5s ease-in-out;
  box-shadow: 0 0 5px black, 0 0 10px #3467a1, 0 0 15px #3467a1,
    0 0 20px #3467a1, 0 0 30px #3467a1, 0 0 40px #3467a1, 0 0 70px #3467a1,
    0 0 80px #3467a13a, 0 0 100px #3467a110, 0 0 150px #3467a15f;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const EventWrap = styled.div<EventWrapType>`
  position: relative;
`;

const Year = styled.div`
  font-size: 8px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
`;

const Month = styled.div`
  font-size: 8px;
  margin-bottom: 5px;
  color: black;
`;

const Day = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: coral;
`;
const EventImage = styled.img<any>`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  width: 100%;
  align-items: center;
  position: relative;
`;

const EventContainer = styled.div`
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3467a1;
    border-radius: 58px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #3467a1;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background-color: transparent;
    background-image: linear-gradient(
      to bottom,
      rgba(52, 103, 161, 0.5),
      #1e3d6b
    );
    transform: translateX(-50%);
  }
`;

const EventBox = styled.div`
  width: auto;
  max-height: 400px;
  border-radius: 20px;
  transition: box-shadow 0.5s ease-in-out;
  display: flex;
  background-color: white;
  justify-content: space-between;
  margin: 10px;
  position: relative;
  align-self: ${(props) => (props.index % 2 === 0 ? 'flex-start' : 'flex-end')};
  margin-right: ${(props) => (props.index % 2 === 0 ? '0px' : '600px')};
  margin-left: ${(props) => (props.index % 2 === 0 ? '600px' : '0px')};
  &:hover {
    box-shadow: 0 0 10px #f6f8f8, 0 0 20px #f6f8f8, 0 0 40px #f6f8f8;
    transform: scale(1.05);
  }
`;
const EventTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-right: 5px;
  margin-left: 5px;
  color: #3467a1;
`;

const ButtonRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  position: absolute;
  right: 0;
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const DateBox = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  background-color: #fff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 20%;
  bottom: 45px;
  left: 10px;
  padding: 5px;
`;

const MoreButton = styled(DefaultButton)`
  margin: 10px;
  color: #fff;
  padding: 5px;
  height: 20px;
  box-shadow: none;
  border: none;
  background-color: transparent;
`;

export default Events;
