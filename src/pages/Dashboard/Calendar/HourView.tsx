import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: number;
  multiDay: boolean;
  day: string;
  date: string;
  endDate: string;
  time: number;
  member: string;
  location: string;
}

interface Props {
  events: Event[];
  weekNumber: number;
  date: Date;
}

const HourlyView: any = ({ events, weekNumber, date }: Props) => {
  console.log(events);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Generate hours array
  const hours = [];
  for (let h = 0; h < 24; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
  }

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

  const handleDragStart = (event: DragEvent, id: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('eventID', id);
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const eventID = event.dataTransfer
      ? event.dataTransfer.getData('eventID')
      : '';

    console.log('Dropped event with ID:', eventID);
  };

  const handleMouseEnter = (eventId: string) => {
    console.log('enter');
    console.log(eventId);
    setHoveredEventId(eventId);
    console.log(hoveredEventId);
  };

  const handleMouseLeave = () => {
    console.log('leave');
    setHoveredEventId(null);
  };

  const EventList: any = ({ events }: Props) => {
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
              //   onDragStart={(event) => handleDragStart(event, event.id)}
              //   onDragOver={(event) => handleDragOver(event)}
              //   onDrop={(event) => handleDrop(event, event.id)}
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
                </div>
              )}
            </TableCell>
          );
        })}
      </ul>
    );
  };

  function getWeekNumber(date: any) {
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

  function getDatesForWeekNumber(weekNumber: number, year: number) {
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

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            {days.map((day, index) => (
              <>
                <TableHeader key={index}>
                  {datesOfWeekNumber[index]}
                </TableHeader>
              </>
            ))}
          </tr>

          <tr>
            <TableHeader></TableHeader>
            {days.map((day, index) => (
              <TableData key={`${day}`}>
                <EventList
                  events={events.filter((event) => {
                    const eventWeekNumber = getWeekNumber(event.date);
                    console.log(event);
                    console.log(event.multiDay);

                    const weekArray = getDatesForWeekNumber(
                      weekNumber,
                      date.getFullYear()
                    );
                    console.log(weekArray[index]);

                    return (
                      event.date <= weekArray[index] &&
                      event.endDate >= weekArray[index] &&
                      event.multiDay &&
                      eventWeekNumber === weekNumber
                    );
                  })}
                />
              </TableData>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour: any) => (
            <TableRow key={hour}>
              <TableHeader>{hour}</TableHeader>

              {days.map((day) => (
                <TableData key={`${day}_${hour}`}>
                  <EventList
                    events={events.filter((event) => {
                      const eventWeekNumber = getWeekNumber(event.date);
                      return (
                        event.day === day &&
                        event.time <= hour &&
                        eventWeekNumber === weekNumber &&
                        event.endTime >= hour &&
                        event.day === day &&
                        eventWeekNumber === weekNumber &&
                        event.multiDay === false
                      );
                    })}
                  />
                </TableData>
              ))}
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

export default HourlyView;
