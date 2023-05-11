import 'firebase/firestore';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { AuthContext } from '../../../config/Context/authContext';
import { db } from '../../../config/firebase.config';

const DayWrap = styled.div`
  display: ${(props) => (props.view === 'day' ? 'block' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  font-family: Arial, sans-serif;
  margin: 5px;
  background-color: 'transparent';
  position: relative;
`;

const Td = styled.td`
  max-width: 100px;
  min-width: 60px;
  height: 60px;
  max-height: 80px;
  border-radius: 20px;
  display: flex;
  position: relative;
  margin: 5px;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  padding: 10px;
  background-color: transparent;
  color: #414141;

  &.inactive {
    color: #999;
  }

  &.today {
    background-color: #629dda;
  }

  &:hover {
    background-color: #c2c2c2;
    cursor: pointer;
    color: #333;
  }
  div {
    font-size: 8px;
    font-weight: bold;
    color: #333;
    border-radius: 5px;
    padding: 0 5px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  height: auto;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100px;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;


const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
`;


function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [view, setView] = useState<string>('day');
  const { familyId } = useContext(AuthContext);
  interface Event {
    id: string;
    title: string;
    category: string;
    date: string;
    multiDay: boolean;
    time: string;
    endDate: string;
    endTime: string;
    description: string;
    finished: boolean;
    member: string;
    note: string;
  }

  useEffect(() => {
    const fetchCalendarData = async () => {
      const eventsData: any[] = await getCalendarData();
      setEvents(eventsData);
    };
    fetchCalendarData();
  }, [familyId]);

  const getCalendarData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(familyDocRef);
    const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return todosData;
  };

  useEffect(() => {}, [selectedRow]);

  function DayCalendar({ selectedDate = new Date() }) {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    if (!selectedDate) {
      selectedDate = new Date();
    }
    const dayOfWeek = weekdays[selectedDate.getDay()];
    return <Heading>{`${dayOfWeek},`}</Heading>;
  }

  useEffect(() => {}, [events]);
  const eventsOnSelectedDate = events.filter((event) => {
    const eventDateOnly = new Date(event.date).setHours(0, 0, 0, 0);
    const selectedDateOnly: any = selectedDate.setHours(0, 0, 0, 0);
    return (
      selectedDateOnly === eventDateOnly ||
      (selectedDateOnly >= eventDateOnly &&
        selectedDateOnly < new Date(event.endDate))
    );
  });
  const eventsCount = eventsOnSelectedDate.length;

  return (
    <Container>
      <Wrap>
        <DayWrap view={view}>
          <DayCalendar selectedDate={selectedDate} />
          <CenterWrap>
            <Td>
              <RowWrap>
                <Counts>{eventsCount > 0 ? eventsCount : '0'}</Counts>
                <EventHeading>events</EventHeading>
              </RowWrap>
            </Td>
          </CenterWrap>
        </DayWrap>
      </Wrap>
    </Container>
  );
}

const Counts = styled.span`
  position: fixed;
  top: 35%;
  font-size: 42px;
`;

const Heading = styled.h4`
  top: 10px;
  position: absolute;
  margin: 0;
  font-weight: bold;
  color: #f6f8f8;
  font-size: 16px;
`;

const EventHeading = styled.h5`
  position: fixed;
  top: 60px;
`;

export default Calendar;
