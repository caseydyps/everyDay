import React, { useState } from 'react';
import styled from 'styled-components/macro';
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
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
  padding: 50px;
  border: 1px solid #ccc;

  &.inactive {
    color: #999;
  }

  &.today {
    background-color: #eee;
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

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [events, setEvents] = useState([]);

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

  function DateDetails({ date }) {
    if (!date) {
      return <div>No date selected</div>;
    }

    return (
      <div>
        <div>{`${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`}</div>
        <div>Some details about the selected date...</div>
        <AddButton onClick={() => setShowModal(true)}>Add Event</AddButton>
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
  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
  };

  const handleEventSubmit = (event) => {
    event.preventDefault();
    const newEvent = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
  };

  return (
    <div>
      <div>
        <button onClick={handlePrevMonth}>Prev</button>
        <span>{`${months[date.getMonth()]} ${date.getFullYear()}`}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <DateDetails date={selectedDate} />
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
                    </Td>
                  </>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Calendar;
