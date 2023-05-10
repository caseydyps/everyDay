import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styled from 'styled-components/macro';
import DefaultButton, { Card } from '../../Components/Button/Button';
import { AuthContext } from '../../config/Context/authContext';
import { db } from '../../config/firebase.config';
import React from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

function Milestone() {
  type EventType = {
    id: number;
    title: string;
    date: Date;
    member: string;
    image: string | null;
  };
  const { familyId, membersArray } = useContext(AuthContext);
  const [events, setEvents] = useState<EventType[]>([]);
  type FilterType = {
    member: string;
    startDate: Date | null;
    endDate: Date | null;
    title: string;
  };
  const [filter, setFilter] = useState<FilterType>({
    member: '',
    startDate: null,
    endDate: null,
    title: '',
  });
  type HandleEditFormSubmit = (editedEvent: EventType) => void;
  


  useEffect(() => {
    async function fetchData() {
      console.log(familyId);
      console.log(membersArray);
      const familyDocRef = collection(db, 'Family', familyId, 'Milestone');
      try {
        const querySnapshot = await getDocs(familyDocRef);
        const data: any = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }
    }

    fetchData();
  }, [familyId]);

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showAddEvent, setShowAddEvent] = useState<boolean>(false);
  const toggleAddEvent = (): void => {
    setShowAddEvent(!showAddEvent);
    if (showFilter) {
      setShowFilter(!showFilter);
    }
  };
  const HintBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f6f8f8;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    color: #414141;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 1;
  `;

  const HintIcon = styled(AiOutlineArrowLeft)`
    color: #444;
    font-size: 16px;
    margin-right: 4px;
  `;
  console.log(events);

  return (
    <Container>
      <ColumnWrap>
        <ContentWrapper>
          <RowWrap>
            <RowWrap>
              <EventContainer>
                {events
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((event, index) => {
                    const dateObj = new Date(event.date);
                    const monthName = dateObj.toLocaleString('default', {
                      month: 'short',
                    });
                    const daysDifference = Math.floor(
                      (Date.UTC(
                        dateObj.getFullYear(),
                        dateObj.getMonth(),
                        dateObj.getDate()
                      ) -
                        Date.UTC(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate()
                        )) /
                        (1000 * 60 * 60 * 24)
                    );

                    let daysText = '';
                    if (daysDifference === 0) {
                      daysText = 'Today';
                    } else if (daysDifference === 1) {
                      daysText = 'days3go';
                    } else if (daysDifference === -1) {
                      daysText = 'daysAgo';
                    } else if (daysDifference > 1) {
                      daysText = 'days2go';
                    } else if (daysDifference < -1) {
                      daysText = 'daysAgo';
                    }
                    return (
                      <>
                        <EventBox key={event.id}>
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
                                <Day>{Math.abs(daysDifference)}</Day>
                                <DayText style={{ fontSize: '6px' }}>
                                  {daysText}
                                </DayText>
                              </DateInfo>
                            </DateBox>
                            <InfoWrap>
                              <EventTitle>
                                {monthName}
                                {dateObj.getDate()}日
                              </EventTitle>
                              <EventTitle>{event.title}</EventTitle>
                              <EventTitle>{event.member}</EventTitle>
                            </InfoWrap>
                          </ColumnWrap>
                        </EventBox>
                      </>
                    );
                  })}
              </EventContainer>
            </RowWrap>
          </RowWrap>
        </ContentWrapper>
      </ColumnWrap>
      <HintBox>
        <HintIcon /> Scroll to see more
      </HintBox>
    </Container>
  );
}

export default Milestone;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  align-items: center;
  position: relative;
`;

const Wrap = styled(Card)`
  background-color: rgba(52, 103, 161, 0.8);
  display: flex;
  max-width: 300px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  z-index: 2;
  position: absolute;
  top: 30%;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: trasparent;
`;

const EventContainer = styled.div`
  max-width: 200px;
  height: 100%;
  overflow-x: scroll;
  padding: 10px;
  margin-left: 10px;
  -webkit-overflow-scrolling: touch;
  display: flex;
  gap: 20px;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const EventBox = styled.div`
  width: 100%;
  max-height: 200px;
  margin-right: 10px;
  border-radius: 20px;
  display: flex;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #d7dde2;
  margin-top: 0px;
  position: relative;
  // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* added box shadow */
`;
const EventTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  margin-right: 5px;
  margin-left: 5px;
  color: #414141;
`;

const DayText = styled.div`
  font-size: 6px;
  font-weight: bold;
  text-align: center;
  margin-right: auto;
  color: #414141;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  align-items: center;
`;

const DateBox = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #5981b0;
  border-radius: 20%;
  bottom: 35px; 
  left: 5px;
  padding: 5px;
`;

const Button = styled(DefaultButton)`
  margin: 10px;
`;
const CancelButton = styled(DefaultButton)`
  margin: 10px;
  position: absolute;
  right: 0;
  top: 0;
`;

type ImageType = {
  src: string;
  alt: string;
};
const EventImage = styled.img<any>`
  height: 25vh;
  width: 200px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
  gap: 10px;
  overflow-x: hidden;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;

  width: 400px;
`;

const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
`;

const FormInput: any = styled.input`
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  height: 100%;
`;


const AnimatedFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const DateInfo = styled.div`
  color: #5981b0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Day = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #f6f8f8;
`;
