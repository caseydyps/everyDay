import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const HourlyView = ({ events, weekNumber, date }) => {
  console.log(events);

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

  const EventList = ({ events }) => {
    //console.log(events);
    return (
      <ul>
        {events.map((event) => (
          <TableCell
            key={event.id}
            rowSpan={event.endTime - event.time + 1} // compute rowSpan
          >
            {event.title}
          </TableCell>
        ))}
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
      const dateString = `${date.getFullYear()}/${String(
        date.getMonth() + 1
      ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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
              <TableHeader key={index}>{datesOfWeekNumber[index]}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <TableRow key={hour}>
              <TableHeader>{hour}</TableHeader>
              {days.map((day) => (
                <TableData key={`${day}_${hour}`}>
                  <EventList
                    events={events.filter((event) => {
                      const eventWeekNumber = getWeekNumber(event.date);
                      return (
                        (event.day === day &&
                          event.time === hour &&
                          eventWeekNumber === weekNumber) ||
                        (event.endTime === hour &&
                          event.day === day &&
                          eventWeekNumber === weekNumber)
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
  max-width: 1200px;
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
  padding: 8px;
  ${(props) => props.rowSpan && `row-span: ${props.rowSpan};`}
`;

export default HourlyView;
