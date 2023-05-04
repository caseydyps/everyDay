import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components/macro';
import Sidebar from '../../../Components/Nav/Navbar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import { getISOWeek } from 'date-fns';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faEdit,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import HourlyView from './HourView';
import DailyHourlyView from './DailyHourView';
import Layout from '../../../Components/layout';
import DefaultButton from '../../../Components/Button/Button';
import UserAuthData from '../../../Components/Login/Auth';
import { AuthContext } from '../../../config/Context/authContext';
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
`;

const WeekWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
  margin: 5px;
`;

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

const MonthContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const MonthLabel = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

const WeekContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const WeekLabel = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;
const DayContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const DayLabel = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;

  top: 0%;
  left: 0%;
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

const Table = styled.table`
  border-collapse: collapse;
  margin: 0 auto;
`;

const Th = styled.thead`
  background-color: #333;
  color: #fff;
`;

const Td = styled.td`
  max-width: 60px;
  min-width: 60px;
  height: 60px;
  max-height: 60px;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  display: flex;
  position: relative;
  // overflow-y: auto;
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

const EventTime = styled.div`
  font-size: 16px;
  font-weight: bold;
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

const EventCategory = styled.div`
  font-size: 16px;
  color: gray;
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
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventEndDate, setEventEndDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [eventEndTime, setEventEndTime] = useState<string>('');
  const [eventCategory, setEventCategory] = useState<string>('');
  const [eventMember, setEventMember] = useState<string>('');
  const [eventNote, setEventNote] = useState<string>('');
  const [eventDay, setEventDay] = useState<string>('');
  const [eventEndDay, setEventEndDay] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();
  const isoWeekNumber = getISOWeek(new Date(year, month, day));
  const [weekNumber, setWeekNumber] = useState<number>(isoWeekNumber);
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [view, setView] = useState<string>('day');
  const draggedEventIdRef = useRef<string | null>(null);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // const {
  //   user,
  //   userName,
  //   googleAvatarUrl,
  //   userEmail,
  //   hasSetup,
  //   familyId,
  //   setHasSetup,
  //   membersArray,
  //   memberRolesArray,
  // } = UserAuthData();
  const { familyId, membersArray } = useContext(AuthContext);
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

  type DateDetailsProps = {
    date: Date;
    month: string;
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    draggedEventIdRef?: React.MutableRefObject<string | null>;
    isCurrentMonth?: boolean;
  };

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

  const postEventToFirestore = async (data: Event) => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    try {
      const docRef = await addDoc(familyDocRef, data);
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const deleteEventFromFirestore = async (eventId: string) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(eventRef);
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.id === eventId) {
        try {
          await deleteDoc(doc.ref);
          console.log('Document successfully deleted!');
        } catch (error) {
          console.error('Error removing document: ', error);
        }
      }
    });
  };

  const editEventtoFirestore = async (eventId: string, updatedData: any) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');

    // Query for the document with the matching ID
    const querySnapshot = await getDocs(
      query(eventRef, where('id', '==', eventId))
    );

    // Update the document with the new data
    querySnapshot.forEach(async (doc) => {
      try {
        await updateDoc(doc.ref, updatedData);
        console.log('Document successfully edited!');
      } catch (error) {
        console.error('Error editing document: ', error);
      }
    });
  };

  const updateEventToFirestore = async (eventId: string, finished: boolean) => {
    const eventRef = doc(db, 'Family', familyId, 'Calendar', eventId);
    try {
      await updateDoc(eventRef, { finished: finished });
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  function DateDetails({
    date,
    events,
    setEvents,
    draggedEventIdRef,
    isCurrentMonth,
  }: any) {
    console.log(isCurrentMonth);
    const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      eventId: string
    ) => {
      // console.log(eventId);
      draggedEventIdRef.current = eventId;
      // console.log(draggedEventIdRef.current);
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
      console.log('drop', date);
      console.log(draggedEventIdRef.current);
      const updatedEvents = events.map((event: Event) => {
        console.log(draggedEventIdRef.current);
        console.log(event.id + ' ' + draggedEventIdRef.current);
        if (event.id === draggedEventIdRef.current) {
          console.log('same');
          console.log(event.date);
          console.log('targetDate' + date);
          const options: any = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          };
          const dateString = date.toLocaleDateString('en-US', options);
          console.log(dateString);
          return { ...event, date: dateString, endDate: dateString };
        }
        return event;
      });

      setEvents(updatedEvents);
      console.log('updatedEvents', updatedEvents);
    };

    if (!date) {
      return <div>今天沒事~</div>;
    }
    const selectedEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      if (eventDate.getMonth() === date.getMonth()) {
        const startDate = new Date(eventDate);
        if (event.endDate === event.date) {
          // Single day event
          return startDate.getDate() === date.getDate();
        } else {
          // Multiday event
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
        {/* <div>{`${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`}</div> */}
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
                    {/* <EventTime>{event.time}</EventTime>
                    <EventTime>{`~${event.endTime}`}</EventTime> */}
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

  type MonthDetailsProps = {
    date: Date | null;
    events: Event[];
  };

  const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    console.log(selectedRow); // log the updated value of selectedRow
  }, [selectedRow]);

  function getWeekNumber(date: Date) {
    const dayOfWeek = (date.getDay() + 6) % 7; // 0 = Sunday, 1 = Monday, etc.
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const daysSinceJan1 =
      Math.floor((date.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.floor((daysSinceJan1 + (7 - dayOfWeek)) / 7);
    console.log(weekNumber);
    setWeekNumber(weekNumber);
  }

  function getISOWeek(date: Date): number {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Calculate the Thursday of the current week
    const thursday = new Date(
      date.getTime() + (3 - ((dayOfWeek + 6) % 7)) * 86400000
    );

    // Calculate the difference in days between the Thursday and the first day of the year
    const january1st = new Date(date.getFullYear(), 0, 1);
    const daysSinceJanuary1st = Math.floor(
      (thursday.getTime() - january1st.getTime()) / 86400000
    );

    // Calculate the ISO week number
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
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    console.log('selectedDate ' + selectedDate);
    console.log('week ' + weekNumber);
    if (!selectedDate) {
      selectedDate = new Date();
    }
    const dayOfWeek = weekdays[selectedDate.getDay()];
    const month = months[selectedDate.getMonth()];
    const dayOfMonth = selectedDate.getDate();
    const year = selectedDate.getFullYear();

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

  // handleEditEvent function
  const handleEditEvent = async (event: Event) => {
    // Prompt the user for the updated event details
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

    // Create a new event object with the updated details
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

    // Update the events list with the new event object
    const updatedEvents: any = events.map((e) =>
      e.id === event.id ? updatedEvent : e
    );
    await editEventtoFirestore(event.id, updatedEvent);
    setEvents(updatedEvents);
  };

  // handleDeleteEvent function
  const handleDeleteEvent = async (event: Event) => {
    // Prompt the user to confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );
    if (confirmDelete) {
      // Remove the event from the events list
      const updatedEvents = events.filter((e) => {
        console.log(e.id);
        console.log(event.id);
        return e.id !== event.id;
      });
      setEvents(updatedEvents);
      console.log(events);
      console.log(event.id);
      await deleteEventFromFirestore(event.id);
    }
  };

  useEffect(() => {
    console.log(events);
  }, [events]);

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
  // eventsCount will be the count of events that match the condition

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

              {/* {events.map((event) => {
                const eventDate = new Date(event.date);
                const selectedDateObj = new Date(selectedDate);
                const eventDateOnly = new Date(
                  eventDate.getFullYear(),
                  eventDate.getMonth(),
                  eventDate.getDate()
                );
                const selectedDateOnly = new Date(
                  selectedDateObj.getFullYear(),
                  selectedDateObj.getMonth(),
                  selectedDateObj.getDate()
                );

                if (
                  selectedDateOnly === eventDateOnly ||
                  (selectedDateOnly >= eventDateOnly &&
                    selectedDateOnly < new Date(event.endDate))
                ) {
                  return (
                    <div
                      style={{
                        height: 'auto',
                        fontSize: '20px',
                        color: '#414141',
                        width: '80%',
                      }}
                    >
                      <EventTitle
                        style={{
                          fontSize: '20px',
                          color: '#414141',
                        }}
                        finished={event.finished}
                      >
                        {event.title}
                      </EventTitle>
                      <EventCategory
                        style={{
                          fontSize: '14px',
                          color: '#414141',
                        }}
                      >
                        {event.category}
                      </EventCategory>
                      <EventMember
                        style={{
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        {event.member}
                      </EventMember>

                      <EventTime
                        style={{
                          fontSize: '14px',
                        }}
                      >
                        {event.time}
                      </EventTime>
                    </div>
                  );
                } else {
                  return null;
                }
              })} */}
            </Td>
          </CenterWrap>
        </DayWrap>
      </Wrap>
    </Container>
  );
}

const Counts = styled.span`
  //margin-top: 50px;
  position: fixed;
  top: 35%;
  font-size: 42px;
`;

export default Calendar;
