import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components/macro';
import Sidebar from '../../../Components/Nav/Navbar';
import { db } from '../../../config/firebase.config';
import firebase from 'firebase/app';
import { getISOWeek } from 'date-fns';
import 'firebase/firestore';
import { MembersSelector } from '../../AI/SmartInput';
import { format } from 'date-fns-tz';
import Banner from '../../../Components/Banner/Banner';
import SmartInput from '../../AI/SmartInput';
import Swal from 'sweetalert2';
import { renderToString } from 'react-dom/server';
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
  faCircleInfo,
  faEllipsis,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import HourlyView from './HourView';
import DailyHourlyView from './DailyHourView';
import Layout from '../../../Components/layout';
import DefaultButton, {
  CancelButton,
  AddButton,
  CloseButton,
  ThreeDButton,
} from '../../../Components/Button/Button';
import UserAuthData from '../../../Components/Login/Auth';
import { AuthContext } from '../../../config/Context/authContext';
import SideNav from '../../../Components/Nav/SideNav';
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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
  font-size: 24px;
  font-weight: bold;
  color: #5981b0;
  //border: 3px solid white;
  border-radius: 20px;
  background-color: transparent;
  padding: 10px;
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
`;

const MonthColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  margin-top: 10px;
  border: none;
  z-index: 5;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #5981b0;
  &:hover {
    color: #3467a1;
  }
`;

const ExitButton = styled.button`
  margin-top: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #5981b0;
  &:hover {
    color: #3467a1;
  }
  position: absolute;
  top: 0;
  right: 0;
`;

const EditButton = styled.button`
  margin-top: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #d7dde2;
  &:hover {
    color: #414141;
  }
`;

const TabButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
  &:hover {
    color: #666;
  }
`;

const InfoButton = styled(ThreeDButton)`
  // background-color: #d7dde2;
  padding: 10px;
  //color: rgba(255, 255, 255, 0.5);
  //border: none;
  //box-shadow: none;
  :hover {
    // background-color: transparent;
    // color: rgba(255, 255, 255, 0.75);
  }
  position: absolute;
  right: 200px;
  top: 300px;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin-right: 0px;
  box-shadow: 3px 3px 5px black;
  border-radius: 20px;
  flex: 3;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Th = styled.thead`
  background-color: #333;
  color: #fff;
`;

const Td = styled.td`
  max-width: 100px;
  max-height: 100px;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  position: relative;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 0px;
  border: 3px solid rgba(211, 211, 211, 0.5);
  border-collapse: collapse;
  // overflow-y: auto;

  &.inactive {
    color: #f5f5f5;
  }

  &.today {
    background-color: #629dda;
  }

  &:hover {
    background-color: #3467a1;
    cursor: pointer;
    color: white;
    border: transparent;
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
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
  //border: gold solid 3px;
`;

const SmartInputContainer = styled.div`
  max-width: 800px;
  position: fixed;
  z-index: 6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);

  // border: 2px solid black;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  //border: 3px solid red;

  // background-color: rgba(64, 64, 64, 0.5);
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 100%;
`;

const TabWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  width: 200px;
  padding: 10px;
  border-radius: 20px;
  border: 2px solid #3467a1;
`;

const MenuWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -20px;
  right: 0;
  z-index: 2;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 400px;
  padding: 25px;
  border-radius: 20px;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #1e3d6b;
  border: 1px solid #d7dde2;
  z-index: 2;
`;

// const AddButton = styled(DefaultButton)`
//   border: none;
//   border-radius: 20px;
//   padding: 10px 20px;
//   cursor: pointer;
//   margin: 10px;
//   color: #f6f8f8;
//   background-color: #5981b0;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
// `;

const Modal = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalForm = styled.form`
  position: absolute;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  border-radius: 10px;
  //box-shadow: 3px 3px 5px black;
  padding: 30px 30px;
  color: #f5f5f5;
  width: 400px;

  label {
    display: block;
    margin-bottom: 5px;
    color: #414141;
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
`;

interface EventWrapperProps {
  category: string;
  multiDay?: boolean;
  finished?: boolean;
  member: string;
  members: Member[];
}

type Member = {
  role: string;
};

const EventWrapper = styled.div<EventWrapperProps>`
  display: flex;
  align-items: center;
  position: relative;
  width: auto;
  height: 20px;
  //padding: 2px;

  //box-shadow: 3px 3px 5px black;
  ::-webkit-scrollbar {
    display: none;
  }
  justify-content: space-between;

  background-color: ${({ member, members }) => {
    const memberIndex = members.findIndex((m) => m.role === member) % 5;
    console.log(members);
    console.log(member);
    console.log(memberIndex);
    const colors = ['#7fc7af', '#d95b43', '#fff5c9', '#6189c5', '#af7ac7'];
    return colors[memberIndex];
  }};
  ${({ multiDay }) =>
    multiDay
      ? `
       
        box-shadow: 0px 0px 0px black;
        
      `
      : `
        border: 1px solid #1E3D6B;
        margin: 0px;
     
        

        
      `}
`;

const EventTime = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const ViewSelect = styled.select`
  width: 150px;
  height: 40px;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid #d7dde2;
  background-color: #f6f8f8;
  font-size: 16px;
  color: #414141;
  padding: 8px 16px;
  appearance: none;
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"%3E%3Cpath fill="%237e7e7e" d="M0 0l6 8 6-8H0z" /%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;

  /* Add a hover effect */
  &:hover {
    border-color: #999;
  }

  /* Add a focus effect */
  &:focus {
    outline: none;
    border-color: #1e3d6b;
    box-shadow: 0 0 0 2px rgba(30, 61, 107, 0.2);
  }
`;

const DateDetailsWrapper = styled.div`
  font-size: 16px;
  font-weight: bold;
  width: 100px;
  height: 100px;
  margin-top: 20px;
  //border: 2px solid #3467a1;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: auto; /* add this line */
  overflow-x: hidden; /* add this line */
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

const DetailTitle = styled.div<EventTitleProps>`
  font-size: 24px;
  font-weight: bold;
  color: #f6f8f8;
  margin-bottom: 10px;
  color: ${({ finished }) => (finished ? 'gray' : 'black')};
`;

const EventMember = styled.div`
  font-size: 16px;
  color: blue;
`;

const DetailMember = styled.div`
  margin-bottom: 10px;
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
  padding: 5px;
  height: 100px;
  width: 95px;
  padding-left: 0px;
  margin: 5px 0px;
  font-size: 20px;

  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none; /* Hide the scrollbar */
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
  const [showButtons, setShowButtons] = useState(false);
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

  const editEventtoFirestore = async (eventId: any, updatedData: any) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');
    console.log(eventId, updatedData);
    console.log(typeof eventId);
    // Query for the document with the matching ID
    const querySnapshot = await getDocs(
      query(eventRef, where('id', '==', eventId.current))
    );
    console.log('querySnapshot', querySnapshot);
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
    //console.log(isCurrentMonth);
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

    const handleDrop = async (
      e: React.DragEvent<HTMLDivElement>,
      date: Date,
      draggedEventIdRef: React.MutableRefObject<string | null>
    ) => {
      e.preventDefault();
      //console.log('drop', date);
      //console.log(draggedEventIdRef.current);
      const updatedEvents = events.map((event: Event) => {
        console.log(draggedEventIdRef.current);
        console.log(event.id + ' ' + draggedEventIdRef.current);
        if (event.id === draggedEventIdRef.current) {
          console.log('same');
          console.log(event.date);
          console.log('targetDate' + date);
          const dateString = format(date, 'yyyy-MM-dd', {
            timeZone: 'Asia/Taipei',
          });
          return { ...event, date: dateString, endDate: dateString };
        }
        return event;
      });
      const dateString = format(date, 'yyyy-MM-dd', {
        timeZone: 'Asia/Taipei',
      });

      const updatedData = {
        date: dateString,
        endDate: dateString,
        // Add any other fields to update here
      };
      await editEventtoFirestore(draggedEventIdRef, updatedData);
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
    console.log(membersArray);
    interface EventMemberProps {
      members: Array<{ avatar: string; role: string }>;
      memberRole: string;
    }
    const MemberAvatar = styled.img`
      border-radius: 50%;
      height: 20px;
      width: 20px;
    `;

    const EventMember: React.FC<EventMemberProps> = ({
      members,
      memberRole,
    }) => {
      const member = members.find((m) => m.role === memberRole);
      return member ? (
        <MemberAvatar src={member.avatar} alt={member.role} />
      ) : null;
    };

    const DetailMember: React.FC<EventMemberProps> = ({
      members,
      memberRole,
    }) => {
      const member = members.find((m) => m.role === memberRole);
      return member ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MemberAvatar
            style={{ width: '48px', height: '48px' }}
            src={member.avatar}
            alt={member.role}
          />
          <span
            style={{ color: '#F6F8F8', paddingLeft: '10px', fontSize: '20px' }}
          >
            {member.role}
          </span>
        </div>
      ) : null;
    };

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
                  <MenuWrap>
                    {showButtons && (
                      <Menu>
                        <DetailMember
                          members={membersArray}
                          memberRole={event.member}
                        ></DetailMember>

                        <DetailTitle
                          style={{
                            color: '#f6f8f8',
                            fontSize: '20px',
                            paddingLeft: '10px',
                          }}
                          finished={event.finished}
                        >
                          Event: {event.title}
                        </DetailTitle>
                        <EventTime
                          style={{
                            color: '#f6f8f8',
                            fontSize: '20px',
                            paddingLeft: '10px',
                          }}
                        >
                          Start date: {event.date}
                        </EventTime>
                        <EventTime
                          style={{
                            color: '#f6f8f8',
                            fontSize: '20px',
                            paddingLeft: '10px',
                          }}
                        >
                          Start time:{event.time}
                        </EventTime>
                        <EventTime
                          style={{
                            color: '#f6f8f8',
                            fontSize: '20px',
                            paddingLeft: '10px',
                          }}
                        >
                          End date: {event.endDate}
                        </EventTime>
                        <EventTime
                          style={{
                            color: '#f6f8f8',
                            fontSize: '20px',
                            paddingLeft: '10px',
                          }}
                        >
                          End time: {`${event.endTime}`}
                        </EventTime>
                        <RowWrap>
                          <Button onClick={() => handleEditEvent(event)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button onClick={() => handleDeleteEvent(event)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </Button>
                        </RowWrap>

                        <ExitButton
                          onClick={() => setShowButtons(!showButtons)}
                        >
                          <FontAwesomeIcon icon={faCircleXmark} />
                        </ExitButton>
                      </Menu>
                    )}
                  </MenuWrap>
                  <EventWrapper
                    draggable={!event.multiDay}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    category={event.category}
                    member={event.member}
                    members={membersArray}
                    finished={event.finished}
                    multiDay={event.date !== event.endDate}
                    onClick={() => setShowButtons(!showButtons)}
                  >
                    <EventMember
                      members={membersArray}
                      memberRole={event.member}
                    ></EventMember>
                    {/* <EventTime>{event.time}</EventTime>
                 <EventTime>{`~${event.endTime}`}</EventTime> */}
                    <EventTitle finished={event.finished}>
                      {event.title}
                    </EventTitle>
                    {/* <EditButton onClick={() => setShowButtons(!showButtons)}>
                      <FontAwesomeIcon icon={faEllipsis} />
                    </EditButton> */}
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
    //console.log(date);
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
      padding: 10px;
      margin-left: 10px;
      border-radius: 25px;
      margin-top: 20px;
      text-align: left;
      align-items: center;
      font-size: 16px;
      height: 220px;
      width: 180px;
      overflow-y: scroll;
      ::-webkit-scrollbar {
        display: none;
      }

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

    const Title = styled.div`
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #414141;
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
      background-color: #3467a1;
      color: #f5f5f5;
      border-radius: 15px;
      border: 2px solid #f5f5f5;
      padding: 10px;
      position: relative;
      height: 50px;
    `;

    const Member = styled.span`
      font-weight: bold;
    `;

    const EventDetails = styled.span`
      margin-left: 5px;
    `;

    const NoEvents = styled.div`
      font-style: italic;
      font-size: 16px;
    `;

    // console.log(selectedMonthEvents);

    interface EventMemberProps {
      members: Array<{ avatar: string; role: string }>;
      memberRole: string;
    }
    const MemberAvatar = styled.img`
      border-radius: 50%;
      height: 40px;
      width: 40px;
    `;

    const EventMember: React.FC<EventMemberProps> = ({
      members,
      memberRole,
    }) => {
      const member = members.find((m) => m.role === memberRole);
      return member ? (
        <MemberAvatar
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
          src={member.avatar}
          alt={member.role}
        />
      ) : null;
    };
    const EventRole: React.FC<EventMemberProps> = ({ members, memberRole }) => {
      const member = members.find((m) => m.role === memberRole);
      return member ? (
        <span
          style={{
            position: 'absolute',
            top: '45px',
            right: '15px',
            fontSize: '12px',
          }}
        >
          {member.role}
        </span>
      ) : null;
    };

    return (
      <MonthColumnWrap>
        <MonthWrap>
          <Title>
            {selectedDate
              .toLocaleDateString('en-US', {
                timeZone: 'Asia/Taipei',
                month: 'short',
                day: 'numeric',
              })
              .replace(/\//g, '-')}
          </Title>

          {selectedMonthEvents.filter((event) => {
            const eventDate = new Date(`${event.date}T${event.time}:00`);
            const eventEndDate = new Date(
              `${event.endDate}T${event.endTime}:00`
            );
            const eventDateInTaipei = eventDate.toLocaleString('en-US', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            const eventEndDateInTaipei = eventEndDate.toLocaleString('en-US', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });

            return (
              eventDateInTaipei ===
              selectedDate.toLocaleDateString('en-US', {
                timeZone: 'Asia/Taipei',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            );
          }).length > 0 ? (
            <EventList>
              {selectedMonthEvents
                .filter((event) => {
                  const eventDate = new Date(`${event.date}T${event.time}:00`);
                  const eventDateInTaipei = eventDate.toLocaleString('en-US', {
                    timeZone: 'Asia/Taipei',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  });
                  return (
                    eventDateInTaipei ===
                    selectedDate.toLocaleDateString('en-US', {
                      timeZone: 'Asia/Taipei',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  );
                })
                .map((event, index) => (
                  <EventListItem key={index}>
                    <EventMember
                      members={membersArray}
                      memberRole={event.member}
                    ></EventMember>
                    <EventRole
                      members={membersArray}
                      memberRole={event.member}
                    ></EventRole>

                    <EventDetails
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        fontSize: '20px',
                      }}
                    >
                      {event.title}
                    </EventDetails>
                    <EventDetails
                      style={{
                        position: 'absolute',
                        top: '40px',
                        left: '12px',
                        fontSize: '12px',
                        color: '#414141',
                      }}
                    >
                      {event.time}
                    </EventDetails>
                  </EventListItem>
                ))}
            </EventList>
          ) : (
            <>
              <NoEvents>No event for the selected date.</NoEvents>
              <AddButton
                style={{ position: 'absolute', bottom: '0px', right: '0px' }}
                onClick={handleAddEvent}
              >
                Add Event
              </AddButton>
            </>
          )}
        </MonthWrap>

        <MonthWrap>
          <Title>{`${months[date.getMonth()]} ${date.getFullYear()}`}</Title>
          {selectedMonthEvents.length > 0 ? (
            <EventList>
              {selectedMonthEvents
                .sort((a, b) => {
                  const dateA: any = new Date(a.date);
                  const dateB: any = new Date(b.date);
                  return dateA - dateB;
                })
                .map((event, index: number) => (
                  <EventListItem key={index}>
                    <EventMember
                      members={membersArray}
                      memberRole={event.member}
                    ></EventMember>
                    <EventRole
                      members={membersArray}
                      memberRole={event.member}
                    ></EventRole>
                    <EventDetails
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        fontSize: '20px',
                      }}
                    >
                      {event.title}
                    </EventDetails>
                    <EventDetails
                      style={{
                        position: 'absolute',
                        top: '40px',
                        left: '80px',
                        fontSize: '12px',
                        color: '#414141',
                      }}
                    >
                      {event.time}
                    </EventDetails>
                    <EventDetails
                      style={{
                        position: 'absolute',
                        top: '40px',
                        left: '12px',
                        fontSize: '12px',
                        color: '#F6F8F8',
                      }}
                    >
                      {event.date}
                    </EventDetails>
                  </EventListItem>
                ))}
            </EventList>
          ) : (
            <NoEvents>這個月目前沒有活動</NoEvents>
          )}
        </MonthWrap>
      </MonthColumnWrap>
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
    //console.log(newDate);
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
    //console.log(selectedDate);
    getWeekNumber(new Date(date.getFullYear(), date.getMonth(), day));
    //console.log(weekNumber);
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
    //console.log(selectedRow); // log the updated value of selectedRow
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
    //console.log(weekNumber);
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
    //console.log('selectedDate ' + selectedDate);
    //console.log('week ' + weekNumber);
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
    //console.log(events);
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

  const handleSelectMember = (member: string) => {
    // event.preventDefault();
    setEventMember(member);
  };

  const handleInfoClick = () => {
    Swal.fire({
      html: 'Reschedule your event by dragging and dropping it to the desired time slot. Click on the event for more details, or edit and delete it.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5981b0',
      focusConfirm: false,
      allowOutsideClick: false,
      icon: 'info',
      iconColor: '#5981b0',
      background: '#F6F8F8',
      padding: '1rem',
      width: '400px',
      // height: '200px',
      heightAuto: false,
      position: 'center',
      reverseButtons: true,
    });
  };
  const [showSmartInput, setShowSmartInput] = useState(false);
  const handleButtonClick = () => {
    setShowSmartInput(!showSmartInput);
  };

  return (
    <Container>
      <SideNav />
      <Wrap>
        <Banner title="Calendar" subTitle="EVERY DAY COUNTS"></Banner>

        <ViewSelect onChange={(event) => handleViewClick(event.target.value)}>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </ViewSelect>
        <InfoButton onClick={handleInfoClick}>
          <FontAwesomeIcon icon={faCircleInfo} />
        </InfoButton>
        <CalendarContainer
          style={{ display: view === 'month' ? 'block' : 'none' }}
        >
          <MonthContainer>
            <Button onClick={handlePrevMonth}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <MonthLabel>{`${
              months[date.getMonth()]
            } ${date.getFullYear()}`}</MonthLabel>
            <Button onClick={handleNextMonth}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </MonthContainer>
          {/* <DateDetails
            date={selectedDate}
            events={events}
            setEvents={setEvents}
          /> */}

          <AddButton onClick={handleAddEvent}>Add Event</AddButton>
          <AddButton onClick={handleButtonClick}>Smart Input</AddButton>

          {showModal && (
            <Modal>
              <ModalForm onSubmit={handleEventSubmit}>
                <CloseButton
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                  }}
                ></CloseButton>
                <label>
                  Title:
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </label>
                {/* <label>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                  />
                  All Day Event
                </label> */}
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
                  Start Time:
                  <input
                    type="time"
                    value={eventTime}
                    step="1800"
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="time"
                    value={eventEndTime}
                    step="1800"
                    onChange={(e) => setEventEndTime(e.target.value)}
                  />
                </label>

                {/* <label>
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
                  </label> */}
                <label>
                  Member:
                  <MembersSelector onSelectMember={handleSelectMember} />
                </label>
                <Wrap>
                  <AddButton type="submit">Add</AddButton>
                </Wrap>
              </ModalForm>
            </Modal>
          )}
          <RowWrap>
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
                      //console.log(isCurrentMonth);
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
                            color: isCurrentMonth
                              ? isToday
                                ? 'white'
                                : '#F6F8F8'
                              : 'gray',
                            verticalAlign: 'top',
                            textAlign: 'left',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute', // add this line
                              top: '10px', // add this line
                              left: '10px', // add this line
                            }}
                          >
                            {isCurrentMonth ? dayOfMonth : ''}
                          </span>
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
          </RowWrap>
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
  );
}

export default Calendar;
