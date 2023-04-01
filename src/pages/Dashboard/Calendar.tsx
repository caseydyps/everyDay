import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
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
    const newDate = subWeeks(date, 1);
    setDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(date, 1);
    setDate(newDate);
  };

  const handleDateClick = (day: number, row) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
    setSelectedRow(row);
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

  return (
    <>
      <Button>Day</Button>
      <Button>Week</Button>
      <Button>Month</Button>
      <CalendarContainer>
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
          <Th>
            <tr>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </Th>
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
                  const eventsOnDay = events.filter((event) => {
                    return (
                      event.date ===
                      `${date.getFullYear()}-${
                        date.getMonth() + 1
                      }-${dayOfMonth}`
                    );
                  });
                  return (
                    <>
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
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>

        <MonthDetails date={selectedDate} events={events} />
      </CalendarContainer>
      <WeekWrap>
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
                    onClick={() => handleDateClick(dayOfMonth)}
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
    </>
  );
}

export default Calendar;
