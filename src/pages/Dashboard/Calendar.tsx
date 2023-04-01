import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { format, getWeek } from 'date-fns';

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
  padding: 0px 50px 100px 50px;
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

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventNote, setEventNote] = useState('');
  const [eventMember, setEventMember] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [view, setView] = useState('month');

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

  function DateDetails({ date, events }) {
    console.log(date);
    if (!date) {
      return <div>No date selected</div>;
    }

    const selectedEvents = events.filter(
      (event) => new Date(event.date).getDate() === date.getDate()
    );

    return (
      <div>
        <div>{`${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`}</div>
        {selectedEvents.length > 0 ? (
          <ul>
            {selectedEvents.map((event, index) => (
              <li key={index}>
                {event.title} at {event.time} - {event.location}
              </li>
            ))}
          </ul>
        ) : (
          <div>No events for the selected date</div>
        )}
      </div>
    );
  }

  function MonthDetails({ date, events }) {
    console.log(date);
    if (!date) {
      return <div>No date selected</div>;
    }

    const selectedMonthEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    return (
      <div>
        <div>{`${months[date.getMonth()]} ${date.getFullYear()}`}</div>
        {selectedMonthEvents.length > 0 ? (
          <ul>
            {selectedMonthEvents.map((event, index) => (
              <li key={index}>
                {event.title} on {event.date} at {event.time} - {event.location}
              </li>
            ))}
          </ul>
        ) : (
          <div>No events for the selected month</div>
        )}
      </div>
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

  const getFirstDayOfWeek = (date: Date): Date => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };
  function addWeeks(date, weeks) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }

  function subWeeks(date, weeks) {
    return addWeeks(date, -weeks);
  }

  const handlePrevMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() - 1;
    setDate(new Date(year, month, 1));
  };

  const handleNextMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    setDate(new Date(year, month, 1));
  };

  const handlePrevWeek = () => {
    const newDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newMonth = newDate.getMonth();
    const currentMonth = date.getMonth();
    const lastRowOfMonth = Math.ceil(getDaysInMonth(date) / 7) - 1;
    setDate(newDate);
    setSelectedRow(
      newMonth === currentMonth ? Math.max(selectedRow - 1, 0) : lastRowOfMonth
    );
  };

  const handleNextWeek = () => {
    const newDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newMonth = newDate.getMonth();
    const currentMonth = date.getMonth();
    setDate(newDate);
    setSelectedRow(newMonth === currentMonth ? selectedRow + 1 : 0);
  };

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const handleDateClick = (day: number, row) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setSelectedRow(row);
  };

  const handleWeekDateClick = (day: number, row) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
  };

  const handleEventSubmit = (event) => {
    event.preventDefault();
    const newEvent = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventNote,
      memeber: eventMember,
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventNote('');
    setEventMember('');
  };

  const handleAddEvent = () => {
    setShowModal(true);
  };

  function getLastDayOfWeek(date) {
    return new Date(date.setDate(date.getDate() + 6));
  }

  useEffect(() => {
    console.log(selectedRow); // log the updated value of selectedRow
  }, [selectedRow]);

  const handleViewClick = (view) => {
    setView(view);
  };

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
      <Table>
        <thead>
          <tr>
            <th>{`${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`}</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    );
  }

  const weekNumber = getWeekNumber(date);

  return (
    <>
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
                Due:
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
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
                Notes:
                <input
                  type="text"
                  value={eventNote}
                  onChange={(e) => setEventNote(e.target.value)}
                />
              </label>
              <label>
                Member:
                <input
                  type="text"
                  value={eventMember}
                  onChange={(e) => setEventMember(e.target.value)}
                />
              </label>

              <button type="submit">Add</button>
            </form>
          </Modal>
        )}
        <Table>
          <tbody>
            {[
              ...Array(
                Math.ceil((getDaysInMonth(date) + getFirstDayOfMonth(date)) / 7)
              ),
            ].map((_, row) => (
              <tr key={row}>
                {[...Array(7).keys()].map((weekday) => {
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
                    >
                      {isCurrentMonth ? dayOfMonth : ''}
                      {eventsOnDay.map((event) => (
                        <div key={event.title}>{event.title}</div>
                      ))}
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
                Due:
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
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
                Notes:
                <input
                  type="text"
                  value={eventNote}
                  onChange={(e) => setEventNote(e.target.value)}
                />
              </label>
              <label>
                Member:
                <input
                  type="text"
                  value={eventMember}
                  onChange={(e) => setEventMember(e.target.value)}
                />
              </label>

              <button type="submit">Add</button>
            </form>
          </Modal>
        )}

        <tbody>
          <tr key={selectedRow}>
            {' '}
            {[...Array(7).keys()].map((weekday) => {
              const dayOfMonth =
                selectedRow * 7 + weekday - getFirstDayOfMonth(date) + 1; // Use row 0
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
                    onClick={() => handleWeekDateClick(dayOfMonth)}
                  >
                    {isCurrentMonth ? dayOfMonth : ''}
                    {eventsOnDay.map((event) => (
                      <div key={event.title}>{event.title}</div>
                    ))}
                  </Td>
                </>
              );
            })}
          </tr>
        </tbody>
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
                Due:
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
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
                Notes:
                <input
                  type="text"
                  value={eventNote}
                  onChange={(e) => setEventNote(e.target.value)}
                />
              </label>
              <label>
                Member:
                <input
                  type="text"
                  value={eventMember}
                  onChange={(e) => setEventMember(e.target.value)}
                />
              </label>

              <button type="submit">Add</button>
            </form>
          </Modal>
        )}
        <DayCalendar selectedDate={selectedDate} />
        <>
          <Td>
            <div key={event.title}>{event.title}</div>
          </Td>
        </>
      </DayWrap>
    </>
  );
}

export default Calendar;
