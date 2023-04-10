import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';

import { v4 as uuidv4 } from 'uuid';

const Wrapper = styled.div`
  position: relative;
  width: 1500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  margin: 10px;
`;
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
  border: 2px solid black;
  width: auto;
  height: auto;
  flex: 1;
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

const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #666;
  &:hover {
    color: #333;
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
  width: 300px;
  height: 200px;
  border: 1px solid #ccc;

  &.inactive {
    color: #999;
  }

  &.today {
    background-color: #4fc3f7;
  }

  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const AddButton = styled.button`
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
`;

const Modal = styled.div``;

const EventWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  background-color: ${({ category }) => {
    switch (category) {
      case 'Work':
        return 'lightblue';
      case 'Personal':
        return 'pink';
      case 'School':
        return 'lightgreen';
      default:
        return 'white';
    }
  }};
  ${({ multiDay }) =>
    multiDay
      ? `
       
       
        padding: 5px 10px;
        margin-left: -2px;
      `
      : `
        padding: 5px;
        border-radius: 10px;
        border: 2px solid black;
      `}
`;

const EventTime = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

interface EventTitleProps {
  finished: boolean;
}

const EventTitle: React.FC<EventTitleProps> = styled.div<EventTitleProps>`
  font-size: 24px;
  font-weight: bold;
  text-decoration: ${(props) => (props.finished ? 'line-through' : 'none')};
`;

const EventMember = styled.div`
  font-size: 24px;
  color: blue;
`;

const EventCategory = styled.div`
  font-size: 24px;
  color: gray;
`;

const EventList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

function CalendarMini() {
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
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [view, setView] = useState<'month' | 'day' | 'week'>('day');
  const draggedEventIdRef = useRef<string | null>(null);
  const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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

  function DateDetails({
    date,
    events,
    setEvents,
    draggedEventIdRef,
    isCurrentMonth,
  }) {
    const handleDragStart = (e, eventId) => {
      console.log(eventId);
      draggedEventIdRef.current = eventId;
      console.log(draggedEventIdRef.current);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e, date, draggedEventIdRef) => {
      e.preventDefault();
      console.log('drop', date);
      console.log(draggedEventIdRef.current);
      const updatedEvents = events.map((event) => {
        console.log(draggedEventIdRef.current);
        console.log(event.id + ' ' + draggedEventIdRef.current);
        if (event.id === draggedEventIdRef.current) {
          console.log('same');
          console.log(event.date);
          console.log('targetDate' + date);
          const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
    const selectedEvents = events.filter((event) => {
      const startDate = new Date(event.date);
      if (event.endDate === event.date) {
        // Single day event
        return startDate.getDate() === date.getDate();
      } else {
        // Multiday event
        startDate.setDate(startDate.getDate() - 1);
        const endDate = new Date(event.endDate);
        return date >= startDate && date <= endDate;
      }
    });

    // console.log(selectedEvents);

    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date, draggedEventIdRef)}
      >
        <div>{`${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`}</div>
        {selectedEvents.length > 0 ? (
          <EventList>
            {selectedEvents.map((event, index: number) =>
              isCurrentMonth ? (
                <li key={index}>
                  <EventWrapper
                    draggable={!event.multiDay}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    category={event.category}
                    finished={event.finished}
                    multiDay={event.date !== event.endDate}
                  >
                    <EventCategory>{event.category}</EventCategory>
                    <EventMember>{event.member}</EventMember>

                    <EventTime>{event.time}</EventTime>
                    <EventTitle finished={event.finished}>
                      {event.title}
                    </EventTitle>
                    <div>
                      <button onClick={() => handleEditEvent(event)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(event)}>
                        Delete
                      </button>
                      <button onClick={() => handleFinishEvent(event)}>
                        Finish
                      </button>
                    </div>
                  </EventWrapper>
                </li>
              ) : null
            )}
          </EventList>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  //   function MonthDetails({ date, events }) {
  //     console.log(date);
  //     if (!date) {
  //       return <div>No date selected</div>;
  //     }

  //     const selectedMonthEvents = events.filter((event) => {
  //       const eventDate = new Date(event.date);
  //       return (
  //         eventDate.getMonth() === date.getMonth() &&
  //         eventDate.getFullYear() === date.getFullYear()
  //       );
  //     });

  //     return (
  //       <div>
  //         <div>{`${months[date.getMonth()]} ${date.getFullYear()}`}</div>
  //         {selectedMonthEvents.length > 0 ? (
  //           <ul>
  //             {selectedMonthEvents.map((event, index) => (
  //               <li key={index}>
  //                 {event.member}:{event.title} on {event.date} to {event.endDate}{' '}
  //                 at {event.time}
  //               </li>
  //             ))}
  //           </ul>
  //         ) : (
  //           <div>這個月目前沒有活動</div>
  //         )}
  //       </div>
  //     );
  //   }

  const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  //   const getFirstDayOfMonth = (date: Date): number => {
  //     const year = date.getFullYear();
  //     const month = date.getMonth();
  //     return new Date(year, month, 1).getDay();
  //   };

  //   const getFirstDayOfWeek = (date: Date): Date => {
  //     const dayOfWeek = date.getDay();
  //     const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  //     return new Date(date.setDate(diff));
  //   };
  function addWeeks(date, weeks) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }

  function subWeeks(date, weeks) {
    return addWeeks(date, -weeks);
  }

  //   const handlePrevMonth = () => {
  //     const year = date.getFullYear();
  //     const month = date.getMonth() - 1;
  //     setDate(new Date(year, month, 1));
  //   };

  //   const handleNextMonth = () => {
  //     const year = date.getFullYear();
  //     const month = date.getMonth() + 1;
  //     setDate(new Date(year, month, 1));
  //   };

  //   const handlePrevWeek = () => {
  //     const newDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  //     const newMonth = newDate.getMonth();
  //     const currentMonth = date.getMonth();
  //     const lastRowOfMonth = Math.ceil(getDaysInMonth(date) / 7) - 1;
  //     setDate(newDate);
  //     setSelectedRow(
  //       newMonth === currentMonth ? Math.max(selectedRow - 1, 0) : lastRowOfMonth
  //     );
  //   };

  //   const handleNextWeek = () => {
  //     const newDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  //     const newMonth = newDate.getMonth();
  //     const currentMonth = date.getMonth();
  //     setDate(newDate);
  //     setSelectedRow(newMonth === currentMonth ? selectedRow + 1 : 0);
  //   };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
  };

  const handleDateClick = (day: number, row: number) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setSelectedRow(row);
    console.log(selectedDate);
  };

  const handleWeekDateClick = (day: number, row: number) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
  };

  const handleEventSubmit = (event) => {
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
    };
    if (!isAllDay) {
      newEvent.time = eventTime;
      newEvent.endTime = eventEndTime;
    }
    setEvents([...events, newEvent]);
    setShowModal(false);
    setEventTitle('');
    setEventDate('');
    setEventEndDate('');
    setEventTime('');
    setEventEndTime('');
    setEventCategory('');
    setEventMember('');
    setIsAllDay(false);
  };

  const handleAddEvent = () => {
    setShowModal(true);
  };

  //   function getLastDayOfWeek(date) {
  //     return new Date(date.setDate(date.getDate() + 6));
  //   }

  useEffect(() => {
    console.log(selectedRow); // log the updated value of selectedRow
  }, [selectedRow]);

  //   const handleViewClick = (view) => {
  //     setView(view);
  //   };

  function getWeekNumber(date) {
    const dayOfWeek = (date.getDay() + 6) % 7; // 0 = Sunday, 1 = Monday, etc.
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const daysSinceJan1 = Math.floor((date - jan1) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.floor((daysSinceJan1 + (7 - dayOfWeek)) / 7);

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
        <button onClick={handlePrevDay}>Previous day</button>
        <button onClick={handleNextDay}>Next day</button>
        <table>...</table>
      </div>
    );
  }

  const weekNumber = getWeekNumber(date);

  // handleEditEvent function
  const handleEditEvent = (event) => {
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
    const updatedEvents = events.map((e) =>
      e.id === event.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
  };

  // handleDeleteEvent function
  const handleDeleteEvent = (event) => {
    // Prompt the user to confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );
    if (confirmDelete) {
      // Remove the event from the events list
      const updatedEvents = events.filter((e) => e.id !== event.id);
      setEvents(updatedEvents);
    }
  };

  // handleFinishEvent function
  const handleFinishEvent = (event) => {
    // Update the event's "finished" property to its opposite value
    const updatedEvent = { ...event, finished: !event.finished };
    // Update the events list with the new event object
    const updatedEvents = events.map((e) =>
      e.id === event.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
  };

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <>
      <DayWrap style={{ display: view === 'day' ? 'block' : 'none' }}>
        {/* <h2>{formatDate(selectedDate)}</h2> */}
        {/* <MonthContainer>
          <Button onClick={handlePrevDay}>Prev</Button>
          <MonthLabel>{`${
            months[date.getMonth()]
          } ${date.getFullYear()}`}</MonthLabel>
          <Button onClick={handleNextDay}>Next</Button>
        </MonthContainer> */}
        <DateDetails date={selectedDate} events={events} />
        <AddButton onClick={handleAddEvent}>Add Event</AddButton>
        {showModal && (
          <Modal>
            <form onSubmit={handleEventSubmit}>
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
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </label>
              <label>
                Due:
                <input
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
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
            </form>
          </Modal>
        )}
        <DayCalendar selectedDate={selectedDate} />
        <Td>
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

            console.log(eventDate);
            console.log(selectedDateOnly);
            console.log(new Date(event.endDate));
            if (
              selectedDateOnly === eventDateOnly ||
              (selectedDateOnly >= eventDateOnly &&
                selectedDateOnly < new Date(event.endDate))
            ) {
              return (
                <div>
                  <EventCategory>{event.category}</EventCategory>
                  <EventMember>{event.member}</EventMember>
                  <EventTime>{event.time}</EventTime>
                  <EventTitle finished={event.finished}>
                    {event.title}
                  </EventTitle>
                </div>
              );
            } else {
              return null;
            }
          })}
        </Td>
      </DayWrap>
    </>
  );
}

export default CalendarMini;
