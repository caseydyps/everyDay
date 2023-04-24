import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import Sidebar from '../../../Components/Nav/Navbar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import { getISOWeek } from 'date-fns';
import 'firebase/firestore';

import Banner from '../../../Components/Banner/Banner';
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
  padding: 2rem;
  font-family: Arial, sans-serif;
  margin: 5px;
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
  max-width: 150px;
  min-width: 150px;
  height: 150px;
  max-height: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;

  // overflow-y: auto;
  margin: 5px;
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
  width: 100vw;
  height: auto;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  margin-top: 60px;
  // background-color: rgba(64, 64, 64, 0.5);
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AddButton = styled(DefaultButton)`
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 10px;
`;

const Modal = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalForm = styled.form`
  position: absolute;
  z-index: 2;
  background-color: #3467a1;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  padding: 20px;
  color: #f5f5f5;
  width: 500px;

  label {
    display: block;
    margin-bottom: 10px;
  }

  input[type='text'],
  input[type='date'],
  input[type='time'],
  select {
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size: 16px;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
  }

  button[type='submit'] {
    background-color: #fff5c9;
    border: none;
    border-radius: 15px;
    color: #3467a1;
    cursor: pointer;
    font-size: 16px;
    padding: 10px 20px;
  }
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
  font-size: 16px;
  font-weight: bold;
`;

interface EventTitleProps {
  finished?: boolean;
}

const EventTitle = styled.div<EventTitleProps>`
  font-size: 20px;
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

const BannerWrap = styled.div`
  position: relative;
`;

const EventList = styled.ul`
  list-style-type: none;
  padding: 0;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #transparent;
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
  const [view, setView] = useState<string>('month');
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

  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
    membersArray,
    memberRolesArray,
  } = UserAuthData();

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

    // console.log(selectedEvents);
    // console.log(isCurrentMonth);
    // console.log(date.getMonth());

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
                      {/* <button onClick={() => handleFinishEvent(event)}>
                        Finish
                      </button> */}
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

  function MonthDetails({ date, events }: MonthDetailsProps) {
    console.log(date);
    if (!date) {
      return <div>No date selected</div>;
    }

    const selectedMonthEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    const MonthWrap = styled.div`
      background-color: #transparent;
      padding: 10px;
      border: 3px solid #ccc;
      border-radius: 25px;
      margin-top: 20px;
      text-align: left;
      align-items: center;
      font-size: 16px;
    `;

    const Title = styled.div`
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      color: white;
      text-shadow: 2px 2px 4px #000000;
    `;

    const EventList = styled.ul`
      list-style-type: none;
      padding: 0;
      margin: 0;
      color: #3467a1;
    `;

    const EventListItem = styled.li`
      margin-bottom: 10px;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
      background-color: #fff5c9;
      border-radius: 15px;
      padding: 10px;
    `;

    const Member = styled.span`
      font-weight: bold;
    `;

    const EventDetails = styled.span`
      margin-left: 5px;
    `;

    const NoEvents = styled.div`
      font-style: italic;
    `;

    return (
      <MonthWrap>
        <Title>{`${months[date.getMonth()]} ${date.getFullYear()}`}</Title>
        {selectedMonthEvents.length > 0 ? (
          <EventList>
            {selectedMonthEvents.map((event, index: number) => (
              <EventListItem key={index}>
                <Member>{event.member} |</Member>
                <EventDetails>
                  {event.title} - {event.date} ~ {event.endDate} at {event.time}
                </EventDetails>
              </EventListItem>
            ))}
          </EventList>
        ) : (
          <NoEvents>這個月目前沒有活動</NoEvents>
        )}
      </MonthWrap>
    );
  }

  const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() - 1;
    setDate(new Date(year, month, 1));
    getWeekNumber(new Date(year, month, 1));
  };

  const handleNextMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    setDate(new Date(year, month, 1));
    getWeekNumber(new Date(year, month, 1));
  };

  const handlePrevWeek = () => {
    const newDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newMonth = newDate.getMonth();
    const currentMonth = date.getMonth();
    const lastRowOfMonth = Math.ceil(getDaysInMonth(date) / 7) - 1;
    setDate(newDate);
    setSelectedRow(
      newMonth === currentMonth
        ? Math.max(selectedRow ? selectedRow - 1 : 0, 0)
        : lastRowOfMonth
    );
    getWeekNumber(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newMonth = newDate.getMonth();
    const currentMonth = date.getMonth();
    setDate(newDate);
    setSelectedRow(
      newMonth === currentMonth ? (selectedRow ? selectedRow + 1 : 0) : 0
    );
    console.log(newDate);
    getWeekNumber(newDate);
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
    getWeekNumber(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
    getWeekNumber(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const handleDateClick = (day: number, row: number | null) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setSelectedRow(row);
    console.log(selectedDate);
    getWeekNumber(new Date(date.getFullYear(), date.getMonth(), day));
    console.log(weekNumber);
  };

  const handleWeekDateClick = (day: number, row: number) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
  };

  const handleEventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isMultiDay = eventDate !== eventEndDate;
    const newEvent = {
      title: eventTitle,
      date: eventDate,
      endDate: eventEndDate,
      category: eventCategory,
      member: eventMember,
      id: uuidv4(),
      multiDay: isMultiDay,
      time: eventTime,
      endTime: eventEndTime,
      description: '',
      finished: false,
      note: '',
      day: eventDay,
      endDay: eventEndDay,
    };
    if (!isAllDay) {
      newEvent.time = eventTime;
      newEvent.endTime = eventEndTime;
    }
    postEventToFirestore(newEvent); // post new event to Firestore
    setEvents([...events, newEvent]);
    setShowModal(false);
    setEventTitle('');
    setEventDate('');
    setEventEndDate('');
    setEventTime('');
    setEventEndTime('');
    setEventCategory('');
    setEventMember('');
    setEventNote('');
    setIsAllDay(false);
    setEventDay('');
    setEventEndDay('');
  };

  const handleAddEvent = () => {
    setShowModal(!showModal);
  };

  function getLastDayOfWeek(date: Date) {
    return new Date(date.setDate(date.getDate() + 6));
  }

  useEffect(() => {
    console.log(selectedRow); // log the updated value of selectedRow
  }, [selectedRow]);

  const handleViewClick = (view: string) => {
    setView(view);
  };

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
      <div>
        <h1>{`${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`}</h1>
        {/* <button onClick={handlePrevDay}>Previous day</button>
        <button onClick={handleNextDay}>Next day</button> */}
        {/* <table>...</table> */}
      </div>
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

  // // handleFinishEvent function
  // const handleFinishEvent = (event: Event) => {
  //   // Update the event's "finished" property to its opposite value
  //   const updatedEvent = { ...event, finished: !event.finished };
  //   // Update the events list with the new event object
  //   const updatedEvents = events.map((e) =>
  //     e.id === event.id ? updatedEvent : e
  //   );
  //   // Update the event in Firestore
  //   updateEventToFirestore(event.id, updatedEvent.finished);
  //   // Update the state with the new events list
  //   setEvents(updatedEvents);
  // };

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleDateChange = (date: string) => {
    console.log('hi');
    console.log(date);
    const dateObj = new Date(date);
    const selectedDayOfWeek = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
    });

    console.log(selectedDayOfWeek);
    setEventDate(date);
    setEventDay(selectedDayOfWeek);
    getWeekNumber(new Date(date));
    console.log(weekNumber);
  };

  const handleEndDateChange = (date: string) => {
    console.log(date);
    const dateObj = new Date(date);
    const selectedDayOfWeek = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
    });

    console.log(selectedDayOfWeek);
    setEventEndDate(date);
    setEventEndDay(selectedDayOfWeek);
  };

  return (
    <Layout>
      <Container>
        <Wrap>
          <Banner title={'#CALENDAR'}></Banner>
          <Button onClick={() => handleViewClick('day')}>Day</Button>
          <Button onClick={() => handleViewClick('week')}>Week</Button>
          <Button onClick={() => handleViewClick('month')}>Month</Button>

          <CalendarContainer
            style={{ display: view === 'month' ? 'block' : 'none' }}
          >
            <MonthContainer>
              <Button onClick={handlePrevMonth}>Prev</Button>
              <MonthLabel>{`${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</MonthLabel>
              <Button onClick={handleNextMonth}>Next</Button>
            </MonthContainer>
            <DateDetails
              date={selectedDate}
              events={events}
              setEvents={setEvents}
            />

            <AddButton onClick={handleAddEvent}>Add Event</AddButton>
            {showModal && (
              <Modal>
                <ModalForm onSubmit={handleEventSubmit}>
                  <label>
                    Title:
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                    />
                    All Day Event
                  </label>
                  <label>
                    Start:
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Due:
                    <input
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      value={eventTime}
                      step="1800"
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      value={eventEndTime}
                      step="1800"
                      onChange={(e) => setEventEndTime(e.target.value)}
                    />
                  </label>

                  <label>
                    Category:
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="School">School</option>
                    </select>
                  </label>
                  <label>
                    Member:
                    <select
                      value={eventMember}
                      onChange={(e) => setEventMember(e.target.value)}
                    >
                      <option value="">Select a family member</option>
                      <option value="Dad">Dad</option>
                      <option value="Mom">Mom</option>
                      <option value="Baby">Baby</option>
                    </select>
                  </label>

                  <button type="submit">Add</button>
                </ModalForm>
              </Modal>
            )}
            <Table>
              <tbody>
                {[
                  ...Array(
                    Math.ceil(
                      (getDaysInMonth(date) + getFirstDayOfMonth(date)) / 7
                    )
                  ),
                ].map((_, row) => (
                  <tr key={row}>
                    {Array.from(Array(7).keys()).map((weekday) => {
                      const dayOfMonth =
                        row * 7 + weekday - getFirstDayOfMonth(date) + 1;
                      const isFirstWeek = dayOfMonth <= 0;
                      const isLastWeek = dayOfMonth > getDaysInMonth(date);
                      const isCurrentMonth = !isFirstWeek && !isLastWeek;
                      console.log(isCurrentMonth);
                      const isToday =
                        isCurrentMonth &&
                        dayOfMonth === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear();
                      const eventsOnDay = events.filter(
                        (event) =>
                          event.date ===
                          `${date.getFullYear()}-${
                            date.getMonth() + 1
                          }-${dayOfMonth}`
                      );
                      return (
                        <Td
                          key={weekday}
                          className={`${isCurrentMonth ? '' : 'inactive'} ${
                            isToday ? 'today' : ''
                          }`}
                          onClick={() => handleDateClick(dayOfMonth, row)}
                          style={{
                            color: isCurrentMonth ? 'white' : 'inherit',
                            verticalAlign: 'top',
                            textAlign: 'left',
                          }}
                        >
                          {isCurrentMonth ? dayOfMonth : ''}
                          {eventsOnDay.map((event) => (
                            <div key={event.title}>{event.title}</div>
                          ))}

                          <DateDetails
                            date={
                              new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                dayOfMonth
                              )
                            }
                            month={date.getMonth()}
                            events={events}
                            setEvents={setEvents}
                            draggedEventIdRef={draggedEventIdRef}
                            isCurrentMonth={isCurrentMonth}
                          />
                        </Td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>

            <MonthDetails date={selectedDate} events={events} />
          </CalendarContainer>
          <WeekWrap style={{ display: view === 'week' ? 'block' : 'none' }}>
            <h1>
              Week {weekNumber} of {date.getFullYear()}
            </h1>
            <MonthContainer>
              <Button onClick={handlePrevWeek}>Prev</Button>
              <MonthLabel>{`${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</MonthLabel>
              <Button onClick={handleNextWeek}>Next</Button>
            </MonthContainer>

            <DateDetails
              date={selectedDate}
              events={events}
              setEvents={setEvents}
            />

            <AddButton onClick={handleAddEvent}>Add Event</AddButton>
            {showModal && (
              <Modal>
                <ModalForm onSubmit={handleEventSubmit}>
                  <label>
                    Title:
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                    />
                    All Day Event
                  </label>
                  <label>
                    Start:
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Due:
                    <input
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      step="1800"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      step="1800"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                    />
                  </label>

                  <label>
                    Category:
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="School">School</option>
                    </select>
                  </label>
                  <label>
                    Member:
                    <select
                      value={eventMember}
                      onChange={(e) => setEventMember(e.target.value)}
                    >
                      <option value="">Select a family member</option>
                      <option value="Dad">Dad</option>
                      <option value="Mom">Mom</option>
                      <option value="Baby">Baby</option>
                    </select>
                  </label>

                  <button type="submit">Add</button>
                </ModalForm>
              </Modal>
            )}

            {/* <tbody>
            <tr key={selectedRow}>
              {' '}
              {Array.from(Array(7).keys()).map((weekday) => {
                const dayOfMonth =
                  selectedRow !== null
                    ? selectedRow * 7 + weekday - getFirstDayOfMonth(date) + 1
                    : 0;
                const isFirstWeek = dayOfMonth <= 0;
                const isLastWeek = dayOfMonth > getDaysInMonth(date);
                const isCurrentMonth = !isFirstWeek && !isLastWeek;
                const isToday =
                  isCurrentMonth &&
                  dayOfMonth === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                const eventsOnDay = events.filter((event) => {
                  return (
                    event.date ===
                    `${date.getFullYear()}-${date.getMonth() + 1}-${dayOfMonth}`
                  );
                });
                return (
                  <>
                    <Td
                      key={weekday}
                      className={`${isCurrentMonth ? '' : 'inactive'} ${
                        isToday ? 'today' : ''
                      }`}
                      onClick={() => handleDateClick(dayOfMonth, selectedRow)}
                    >
                      {isCurrentMonth ? dayOfMonth : ''}
                      {eventsOnDay.map((event) => (
                        <div key={event.title}>{event.title}</div>
                      ))}

                      <DateDetails
                        date={
                          new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            dayOfMonth
                          )
                        }
                        events={events}
                        setEvents={setEvents}
                        draggedEventIdRef={draggedEventIdRef}
                        isCurrentMonth={isCurrentMonth}
                      />
                    </Td>
                  </>
                );
              })}
            </tr>
          </tbody> */}
            <HourlyView events={events} weekNumber={weekNumber} date={date} />
          </WeekWrap>
          <DayWrap style={{ display: view === 'day' ? 'block' : 'none' }}>
            {/* <h2>{formatDate(selectedDate)}</h2> */}
            <MonthContainer>
              <Button onClick={handlePrevDay}>Prev</Button>
              <MonthLabel>{`${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</MonthLabel>
              <Button onClick={handleNextDay}>Next</Button>
            </MonthContainer>
            <DateDetails
              date={selectedDate}
              events={events}
              setEvents={setEvents}
              draggedEventIdRef={draggedEventIdRef}
            />
            <AddButton onClick={handleAddEvent}>Add Event</AddButton>
            {showModal && (
              <Modal>
                <ModalForm onSubmit={handleEventSubmit}>
                  <label>
                    Title:
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                    />
                    All Day Event
                  </label>
                  <label>
                    Start:
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Due:
                    <input
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      step="1800"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      step="1800"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                    />
                  </label>

                  <label>
                    Category:
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="School">School</option>
                    </select>
                  </label>
                  <label>
                    Member:
                    <select
                      value={eventMember}
                      onChange={(e) => setEventMember(e.target.value)}
                    >
                      <option value="">Select a family member</option>
                      <option value="Dad">Dad</option>
                      <option value="Mom">Mom</option>
                      <option value="Baby">Baby</option>
                    </select>
                  </label>

                  <button type="submit">Add</button>
                </ModalForm>
              </Modal>
            )}
            <DayCalendar selectedDate={selectedDate} />
            <CenterWrap>
              {' '}
              <Td
                style={{
                  width: '500px',
                  height: '500px',
                  maxWidth: '500px',
                  maxHeight: '500px;',
                }}
              >
                {events.map((event) => {
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

                  // console.log(eventDate);
                  // console.log(selectedDateOnly);
                  // console.log(new Date(event.endDate));
                  if (
                    selectedDateOnly === eventDateOnly ||
                    (selectedDateOnly >= eventDateOnly &&
                      selectedDateOnly < new Date(event.endDate))
                  ) {
                    return (
                      <div
                        style={{
                          height: '500px',
                          fontSize: '72px',
                          color: 'white',
                        }}
                      >
                        <EventTitle
                          style={{
                            fontSize: '72px',
                            color: 'white',
                          }}
                          finished={event.finished}
                        >
                          {event.title}
                        </EventTitle>
                        <EventCategory
                          style={{
                            fontSize: '36px',
                            color: 'white',
                          }}
                        >
                          {event.category}
                        </EventCategory>
                        <EventMember
                          style={{
                            fontSize: '36px',
                            color: 'white',
                          }}
                        >
                          {event.member}
                        </EventMember>

                        <EventTime
                          style={{
                            fontSize: '36px',
                          }}
                        >
                          {event.time}
                        </EventTime>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </Td>
            </CenterWrap>

            {/* <DailyHourlyView
              events={events}
              weekNumber={weekNumber}
              date={date}
              selectedDate={selectedDate}
            /> */}
          </DayWrap>
        </Wrap>
      </Container>
    </Layout>
  );
}

export default Calendar;
