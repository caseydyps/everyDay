import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';

const DailyHourlyView = ({ events, weekNumber, date, selectedDate }) => {
  console.log(events);
  const [hoveredEventId, setHoveredEventId] = useState(null);

  // Generate hours array
  const hours = [...Array(24).keys()].map((h) => {
    return `${h.toString().padStart(2, '0')}:00`;
  });

  // Generate days array
  const days = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('eventID', id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const eventID = event.dataTransfer.getData('eventID');
    console.log('Dropped event with ID:', eventID);
  };

  const handleMouseEnter = (eventId) => {
    console.log('enter');
    console.log(eventId);
    setHoveredEventId(eventId);
    console.log(hoveredEventId);
  };

  const handleMouseLeave = () => {
    console.log('leave');
    setHoveredEventId(null);
  };

  const EventList = ({ events }) => {
    return (
      <ul>
        {events.map((event) => {
          console.log(event.id + hoveredEventId);
          return (
            <TableCell
              onMouseEnter={() => handleMouseEnter(event.id)}
              onMouseLeave={handleMouseLeave}
              key={event.id}
              rowSpan={event.endTime - event.time + 1}
              draggable="true"
              onDragStart={(event) => handleDragStart(event, event.id)}
              onDragOver={(event) => handleDragOver(event)}
              onDrop={(event) => handleDrop(event, event.id)}
            >
              <ColumnWrap>
                {event.title} - {event.member}
              </ColumnWrap>
              {hoveredEventId === event.id && (
                <div>
                  <p>{event.date}</p>
                  <p>
                    {event.time} - {event.endTime}
                  </p>
                  <p>{event.location}</p>
                </div>
              )}
            </TableCell>
          );
        })}
      </ul>
    );
  };

  function getWeekNumber(date: Date) {
    console.log(typeof date);
    const dateObj = new Date(date);
    const dayOfWeek = (dateObj.getDay() + 6) % 7; // 0 = Sunday, 1 = Monday, etc.
    const jan1 = new Date(dateObj.getFullYear(), 0, 1);
    const daysSinceJan1 =
      Math.floor((dateObj.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000)) +
      1;
    const weekNumber = Math.floor((daysSinceJan1 + (7 - dayOfWeek)) / 7);

    return weekNumber;
  }

  function getDatesForWeekNumber(weekNumber, year) {
    // Get the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);

    // Get the day of the week for January 1st
    const januaryFirstDayOfWeek = firstDayOfYear.getDay();

    // Calculate the number of days from January 1st to the first day of the first week
    const daysToFirstWeekDay = (7 - januaryFirstDayOfWeek) % 7;

    // Calculate the date of the first day of the first week
    const firstWeekStartDate = new Date(year, 0, 1 + daysToFirstWeekDay);

    // Calculate the start date of the week number
    const weekStartDate = new Date(
      firstWeekStartDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
    );

    // Generate an array of date strings for the week
    const dateStringsForWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateStringsForWeek.push(dateString);
    }

    return dateStringsForWeek;
  }

  const datesOfWeekNumber = getDatesForWeekNumber(
    weekNumber,
    date.getFullYear()
  );
  console.log(datesOfWeekNumber);
  console.log(selectedDate);
  const selectedDayOfWeek = days[selectedDate.getDay()]; // Get the day of the week for the selected date
  const dateOfSelectedDay = selectedDate.toLocaleDateString();

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            <TableHeader>{selectedDayOfWeek}</TableHeader>
          </tr>

          <tr>
            <TableHeader></TableHeader>

            <TableData>
              <EventList
                events={events.filter((event) => {
                  const eventWeekNumber = getWeekNumber(event.date);
                  console.log(event);
                  console.log(event.multiDay);

                  const weekArray = getDatesForWeekNumber(
                    weekNumber,
                    date.getFullYear()
                  );

                  return (
                    event.day === selectedDayOfWeek &&
                    event.multiDay &&
                    eventWeekNumber === weekNumber
                  );
                })}
              />
            </TableData>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <TableRow key={hour}>
              <TableHeader>{hour}</TableHeader>

              <TableData key={`${selectedDayOfWeek}_${hour}`}>
                <EventList
                  events={events.filter((event) => {
                    const eventWeekNumber = getWeekNumber(event.date);
                    return (
                      event.day === selectedDayOfWeek &&
                      event.time <= hour &&
                      eventWeekNumber === weekNumber &&
                      event.endTime >= hour &&
                      event.day === selectedDayOfWeek &&
                      eventWeekNumber === weekNumber &&
                      event.multiDay === false
                    );
                  })}
                />
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border: 1px solid #ccc;
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
`;

const TableData = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
`;

const EventListItem = styled.li`
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: -1px;
  background-color: #f2f2f2;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  margin: 5px;
  padding: 20px;
  ${(props) => props.rowSpan && `row-span: ${props.rowSpan};`}
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export default DailyHourlyView;