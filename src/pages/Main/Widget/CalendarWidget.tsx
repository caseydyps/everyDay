import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'firebase/firestore';
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { AuthContext } from '../../../config/Context/authContext';
import { db } from '../../../config/firebase.config';

const DayWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  font-family: Arial, sans-serif;
  margin: 5px;
  background-color: 'transparent';
  position: relative;
`;

const Button = styled.button`
  margin-top: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
  &:hover {
    color: #666;
  }
`;

const Td = styled.td`
  max-width: 60px;
  min-width: 60px;
  height: 60px;
  max-height: 60px;
  border-radius: 20px;
  display: flex;
  position: relative;
  margin: 5px;
  justify-content: center;
  align-items: center;

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

interface EventWrapperProps {
  category: string;
  multiDay?: boolean;
  finished?: boolean;
}
const EventWrapper = styled.div<EventWrapperProps>`
  display: flex;
  align-items: center;
  position: relative;
  overflow-x: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  justify-content: space-between;

  background-color: ${({ category }) => {
    switch (category) {
      case 'Work':
        return '#7fc7af';
      case 'Personal':
        return '#d95b43';
      case 'School':
        return '#fff5c9';
      default:
        return 'white';
    }
  }};
  ${({ multiDay }) =>
    multiDay
      ? `
        margin-left: 0px;
      `
      : `
        border: 1px solid black;
        margin: 5px;
        
      `}
`;

const DateDetailsWrapper = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

interface EventTitleProps {
  finished?: boolean;
}

const EventTitle = styled.div<EventTitleProps>`
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: ${(props) => (props.finished ? 'line-through' : 'none')};
`;

const EventMember = styled.div`
  font-size: 16px;
  color: blue;
`;

const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const EventList = styled.ul`
  list-style-type: none;
  padding: 0;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }
`;

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();
  const isoWeekNumber = getISOWeek(new Date(year, month, day));
  const [weekNumber, setWeekNumber] = useState<number>(isoWeekNumber);
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [view, setView] = useState<string>('day');
  const draggedEventIdRef = useRef<string | null>(null);
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

  const deleteEventFromFirestore = async (eventId: string) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(eventRef);
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.id === eventId) {
        try {
          await deleteDoc(doc.ref);
        } catch (error) {
          console.error('Error removing document: ', error);
        }
      }
    });
  };

  const editEventtoFirestore = async (eventId: string, updatedData: any) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(
      query(eventRef, where('id', '==', eventId))
    );
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, updatedData);
      } catch (error) {
        console.error('Error editing document: ', error);
      }
    });
  };

  function DateDetails({
    date,
    events,
    setEvents,
    draggedEventIdRef,
    isCurrentMonth,
  }: any) {
    const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      eventId: string
    ) => {
      draggedEventIdRef.current = eventId;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDrop = (
      e: React.DragEvent<HTMLDivElement>,
      date: Date,
      draggedEventIdRef: React.MutableRefObject<string | null>
    ) => {
      e.preventDefault();
      const updatedEvents = events.map((event: Event) => {
        if (event.id === draggedEventIdRef.current) {
          const options: any = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          };
          const dateString = date.toLocaleDateString('en-US', options);
          return { ...event, date: dateString, endDate: dateString };
        }
        return event;
      });
      setEvents(updatedEvents);
    };

    if (!date) {
      return <div>今天沒事~</div>;
    }
    const selectedEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      if (eventDate.getMonth() === date.getMonth()) {
        const startDate = new Date(eventDate);
        if (event.endDate === event.date) {
          return startDate.getDate() === date.getDate();
        } else {
          startDate.setDate(startDate.getDate() - 1);
          const endDate = new Date(event.endDate);
          return date >= startDate && date <= endDate;
        }
      } else {
        return false;
      }
    });

    return (
      <DateDetailsWrapper
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date, draggedEventIdRef)}
      >
        {selectedEvents.length > 0 ? (
          <EventList>
            {selectedEvents.map((event: Event, index: number) =>
              isCurrentMonth ? (
                <li key={index}>
                  <EventWrapper
                    draggable={!event.multiDay}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    category={event.category}
                    finished={event.finished}
                    multiDay={event.date !== event.endDate}
                  >
                    <EventMember>{event.member}</EventMember>
                    <EventTitle finished={event.finished}>
                      {event.title}
                    </EventTitle>
                    <RowWrap>
                      <Button onClick={() => handleEditEvent(event)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button onClick={() => handleDeleteEvent(event)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </RowWrap>
                  </EventWrapper>
                </li>
              ) : null
            )}
          </EventList>
        ) : (
          <div></div>
        )}
      </DateDetailsWrapper>
    );
  }

  useEffect(() => {}, [selectedRow]);

  function getISOWeek(date: Date): number {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const thursday = new Date(
      date.getTime() + (3 - ((dayOfWeek + 6) % 7)) * 86400000
    );
    const january1st = new Date(date.getFullYear(), 0, 1);
    const daysSinceJanuary1st = Math.floor(
      (thursday.getTime() - january1st.getTime()) / 86400000
    );
    const weekNumber = Math.floor((daysSinceJanuary1st + 3) / 7) + 1;
    return weekNumber;
  }

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

    return (
      <h4
        style={{
          top: '10px',
          position: 'absolute',
          margin: '0px',
          fontWeight: 'bold',
          color: '#F6F8F8',
          fontSize: '16px',
        }}
      >{`${dayOfWeek},`}</h4>
    );
  }

  const handleEditEvent = async (event: Event) => {
    const updatedTitle = prompt('Enter the updated event title:', event.title);
    const updatedDate = prompt('Enter the updated event date:', event.date);
    const updatedEndDate = prompt(
      'Enter the updated event date:',
      event.endDate
    );
    const updatedTime = prompt('Enter the updated event time:', event.time);
    const updatedEndTime = prompt(
      'Enter the updated event time:',
      event.endTime
    );
    const updatedCategory = prompt(
      'Enter the updated event category:',
      event.category
    );
    const updatedMember = prompt(
      'Enter the updated event member:',
      event.member
    );
    const updatedNote = prompt('Enter the updated event note:', event.note);
    const updatedEvent = {
      id: event.id,
      title: updatedTitle,
      date: updatedDate,
      endDate: updatedEndDate,
      time: updatedTime,
      endTime: updatedEndTime,
      category: updatedCategory,
      member: updatedMember,
      note: updatedNote,
    };
    const updatedEvents: any = events.map((e) =>
      e.id === event.id ? updatedEvent : e
    );
    await editEventtoFirestore(event.id, updatedEvent);
    setEvents(updatedEvents);
  };
  const handleDeleteEvent = async (event: Event) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );
    if (confirmDelete) {
      const updatedEvents = events.filter((e) => {
        return e.id !== event.id;
      });
      setEvents(updatedEvents);
      await deleteEventFromFirestore(event.id);
    }
  };

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
        <DayWrap style={{ display: view === 'day' ? 'block' : 'none' }}>
          <DateDetails
            date={selectedDate}
            events={events}
            setEvents={setEvents}
            draggedEventIdRef={draggedEventIdRef}
          />
          <DayCalendar selectedDate={selectedDate} />
          <CenterWrap>
            <Td
              style={{
                width: '100px',
                height: '80px',
                maxWidth: '100px',
                maxHeight: '80px;',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#414141',
              }}
            >
              <RowWrap>
                <Counts>{eventsCount > 0 ? eventsCount : '0'}</Counts>
                <h5 style={{ position: 'fixed', top: 60 }}>events</h5>
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

export default Calendar;
