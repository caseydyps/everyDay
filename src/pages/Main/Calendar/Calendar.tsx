import {
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faEdit,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns-tz';
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
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import Banner from '../../../Components/Banner/Banner';
import {
  AddButton,
  CloseButton,
  ThreeDButton,
} from '../../../Components/Button/Button';
import SideNav from '../../../Components/Nav/SideNav';
import { AuthContext } from '../../../config/Context/authContext';
import { db } from '../../../config/firebase.config';
import SmartInput from '../AI/SmartInput';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
import { ChatToggle } from '../../../Components/Chat/ChatToggle';

function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
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
  const { familyId, membersArray } = useContext(AuthContext);
  const [showButtons, setShowButtons] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
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
  const [isEventAdded, setIsEventAdded] = useState(false);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const eventsData: any = await getCalendarData();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };
    fetchCalendarData();
    setIsEventAdded(false);
  }, [familyId, isEventAdded]);

  const getCalendarData = async () => {
    const familyDocRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(familyDocRef);
    const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    return todosData;
  };

  const postEventToFirestore = async (data: any) => {
    try {
      setIsEventAdded(true);
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
        } catch (error) {
          console.error('Error removing document: ', error);
        }
      }
    });
  };

  const editEventtoFirestore = async (eventId: any, updatedData: any) => {
    const eventRef = collection(db, 'Family', familyId, 'Calendar');
    const querySnapshot = await getDocs(
      query(eventRef, where('id', '==', eventId.current))
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
    const handleDrop = async (
      e: React.DragEvent<HTMLDivElement>,
      date: Date,
      draggedEventIdRef: React.MutableRefObject<string | null>
    ) => {
      e.preventDefault();
      const updatedEvents = events.map((event: Event) => {
        if (event.id === draggedEventIdRef.current) {
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
      };
      await editEventtoFirestore(draggedEventIdRef, updatedData);
      setEvents(updatedEvents);
    };

    if (!date) {
      return <div>今天沒事~</div>;
    }
    const selectedEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      if (eventDate.getMonth() === date.getMonth()) {
        const startDate = new Date(eventDate);
        return startDate.getDate() === date.getDate();
      } else {
        return false;
      }
    });
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
                  <MenuWrap></MenuWrap>
                  <EventWrapper
                    draggable={!event.multiDay}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    category={event.category}
                    member={event.member}
                    members={membersArray}
                    finished={event.finished}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setShowButtons(true);
                    }}
                  >
                    <EventMember
                      members={membersArray}
                      memberRole={event.member}
                    ></EventMember>
                    <EventTitle finished={event.finished}>
                      {event.title}
                    </EventTitle>
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

    interface EventDetailsProps {
      fontSize?: string;
      top?: string;
      left?: string;
      color?: string;
    }

    const EventDetails = styled.span<EventDetailsProps>`
      position: absolute;
      font-size: ${(props) => props.fontSize};
      top: ${(props) => props.top};
      left: ${(props) => props.left};
      color: ${(props) => props.color};
    `;

    const NoEvents = styled.div`
      font-style: italic;
      font-size: 16px;
    `;
    interface EventMemberProps {
      members: Array<{ avatar: string; role: string }>;
      memberRole: string;
    }
    const MemberAvatar = styled.img`
      border-radius: 50%;
      height: 40px;
      width: 40px;
      position: absolute;
      top: 10px;
      right: 10px;
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
    const EventRole: React.FC<EventMemberProps> = ({ members, memberRole }) => {
      const member = members.find((m) => m.role === memberRole);
      return member ? <RoleLabel>{member.role}</RoleLabel> : null;
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
            const eventDateInTaipei = eventDate.toLocaleString('en-US', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            const selectedDateInTaipei = selectedDate.toLocaleString('en-US', {
              timeZone: 'Asia/Taipei',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            return eventDateInTaipei === selectedDateInTaipei;
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
                    <EventDetails top="10px" left="10px" fontSize="20px">
                      {event.title}
                    </EventDetails>
                    <EventDetails
                      top="40px"
                      left="12px"
                      fontSize="12px"
                      color="#F6F8F8"
                    >
                      {event.time}
                    </EventDetails>
                    <EditWrap>
                      <EventEditButton onClick={() => handleEditEvent(event)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </EventEditButton>
                      <EventEditButton onClick={() => handleDeleteEvent(event)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </EventEditButton>
                    </EditWrap>
                  </EventListItem>
                ))}
            </EventList>
          ) : (
            <>
              <NoEvents>No event for the selected date.</NoEvents>
              <AddEventButton onClick={handleAddEvent}>
                Add Event
              </AddEventButton>
            </>
          )}
        </MonthWrap>
        <MonthWrap>
          <Title>{`${months[date.getMonth()]} ${date.getFullYear()} `}</Title>
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
                    <EventDetails top="10px" left="10px" fontSize="20px">
                      {event.title}
                    </EventDetails>
                    <EventDetails
                      top="40px"
                      left="80px"
                      fontSize="12px"
                      color="#F6F8F8"
                    >
                      {event.time}
                    </EventDetails>
                    <EventDetails
                      top="40px"
                      left="12px"
                      fontSize="12px"
                      color="#F6F8F8"
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

  const handleDateClick = (day: number, row: number | null) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setSelectedRow(row);
    getWeekNumber(new Date(date.getFullYear(), date.getMonth(), day));
  };

  const handleEventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEvent: any = {
      title: eventTitle,
      date: eventDate,
      category: eventCategory,
      member: eventMember,
      id: uuidv4(),
      time: eventTime,
      description: '',
      finished: false,
      note: '',
      day: eventDay,
      endDay: eventEndDay,
    };
    postEventToFirestore(newEvent);
    setEvents([...events, newEvent]);
    setShowModal(false);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventCategory('');
    setEventMember('');
    setEventNote('');
    setIsAllDay(false);
    setEventDay('');
  };

  const handleAddEvent = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {}, [selectedRow]);

  function getWeekNumber(date: Date) {
    const dayOfWeek = (date.getDay() + 6) % 7;
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const daysSinceJan1 =
      Math.floor((date.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.floor((daysSinceJan1 + (7 - dayOfWeek)) / 7);
    setWeekNumber(weekNumber);
  }

  function getISOWeek(date: Date): number {
    const dayOfWeek = date.getDay();
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
  const handleDateChange = (date: string) => {
    const dateObj = new Date(date);
    const selectedDayOfWeek = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
    });
    setEventDate(date);
    setEventDay(selectedDayOfWeek);
    getWeekNumber(new Date(date));
  };

  const handleSelectMember = (member: string) => {
    setEventMember(member);
  };

  const handleInfoClick = () => {
    Swal.fire({
      html: 'Reschedule your event by dragging and dropping it to the desired time slot. Edit or delete event from event details at the right.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#5981b0',
      focusConfirm: false,
      allowOutsideClick: false,
      icon: 'info',
      iconColor: '#5981b0',
      background: '#F6F8F8',
      padding: '1rem',
      width: '400px',
      heightAuto: false,
      position: 'center',
      reverseButtons: true,
    });
  };
  const [showSmartInput, setShowSmartInput] = useState(false);
  const handleButtonClick = () => {
    setShowSmartInput(!showSmartInput);
  };

  const handleClose = () => {
    setShowSmartInput(false);
  };
  return (
    <Container>
      <SideNav />
      <Wrap>
        <ChatToggle />
        <Banner title="Calendar" subTitle="EVERY DAY COUNTS"></Banner>
        <InfoButton onClick={handleInfoClick}>
          <FontAwesomeIcon icon={faCircleInfo} />
        </InfoButton>
        <CalendarContainer view={view}>
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
                <label>
                  Start:
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => handleDateChange(e.target.value)}
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
                <CloseInputButton onClick={handleButtonClick} />
                <SmartInput
                  onClose={handleClose}
                  setIsEventAdded={setIsEventAdded}
                ></SmartInput>
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
                          <DayNumber>
                            {isCurrentMonth ? dayOfMonth : ''}
                          </DayNumber>
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
      </Wrap>
    </Container>
  );
}

const RoleLabel = styled.span`
  position: absolute;
  top: 45px;
  right: 15px;
  font-size: 12px;
`;

type CalendarContainerProps = {
  view: 'month' | 'week' | 'day';
};

const CalendarContainer = styled.div<CalendarContainerProps>`
  display: ${(props) => (props.view === 'month' ? 'block' : 'none')};
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
  padding: 20px 0px;
  font-family: Arial, sans-serif;
  margin: 5px;
`;

const CloseInputButton = styled(CloseButton)`
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
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
  border-radius: 20px;
  background-color: transparent;
  padding: 10px;
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
const DayNumber = styled.span`
  position: absolute;
  top: 5px;
  left: 10px;
  font-size: 18px;
`;

const EventEditButton = styled.button`
  top: 50px;
  right: 20px;
  border: none;
  z-index: 5;
  background-color: transparent;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  color: #5981b0;
  &:hover {
    color: #3467a1;
  }
`;

const InfoButton = styled(ThreeDButton)`
  padding: 10px;
  :hover {
  }
  position: absolute;
  right: 150px;
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

const Td = styled.td`
  max-width: 100px;
  max-height: 100px;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 0px;
  border: 3px solid rgba(211, 211, 211, 0.5);
  border-collapse: collapse;
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
  padding-top: 0px;
`;

const SmartInputContainer = styled.div`
  max-width: 800px;
  position: fixed;
  z-index: 6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 100%;
`;
const EditWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 160px;
  top: -50px;
  height: 50px;
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
  ::-webkit-scrollbar {
    display: none;
  }
  justify-content: space-between;
  background-color: ${({ member, members }) => {
    const memberIndex = members.findIndex((m) => m.role === member) % 5;
    const colors = ['#83d1ae', '#f3a977', '#fff5c9', '#90b1e3', '#e3aaeb '];
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

const DateDetailsWrapper = styled.div`
  font-size: 16px;
  font-weight: bold;
  width: 100px;
  height: 100px;
  margin-top: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: auto;
  overflow-x: hidden;
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
    display: none;
  }
`;

const AddEventButton = styled(AddButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default Calendar;
