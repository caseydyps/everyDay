import { useState } from 'react';
import styled from 'styled-components/macro';
import React from 'react';
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

  
  const hours = [];
  for (let h = 0; h < 24; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
  }

  const days = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];

  const handleMouseEnter = (eventId: string) => {
    setHoveredEventId(eventId);
  };

  const handleMouseLeave = () => {
    setHoveredEventId(null);
  };

  const EventList: any = ({ events }: Props) => {
    return (
      <div>
        {events.map((event) => {
          return (
            <TableCell
              onMouseEnter={() => handleMouseEnter(event.id)}
              onMouseLeave={handleMouseLeave}
              key={event.id}
              rowSpan={event.endTime - event.time + 1}
            >
              <ColumnWrap>
                {event.title} - {event.member}
              </ColumnWrap>
            </TableCell>
          );
        })}
      </div>
    );
  };

  function getWeekNumber(date: any) {
    
    const dateObj = new Date(date);
    const dayOfWeek = (dateObj.getDay() + 6) % 7; 
    const jan1 = new Date(dateObj.getFullYear(), 0, 1);
    const daysSinceJan1 =
      Math.floor((dateObj.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000)) +
      1;
    const weekNumber = Math.floor((daysSinceJan1 + (7 - dayOfWeek)) / 7);

    return weekNumber;
  }

  function getDatesForWeekNumber(weekNumber: number, year: number) {
    
    const firstDayOfYear = new Date(year, 0, 1);

    
    const januaryFirstDayOfWeek = firstDayOfYear.getDay();

    
    const daysToFirstWeekDay = (7 - januaryFirstDayOfWeek) % 7;

    
    const firstWeekStartDate = new Date(year, 0, 1 + daysToFirstWeekDay);

    
    const weekStartDate = new Date(
      firstWeekStartDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
    );

    
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
                  <br></br>
                  {days[index]}
                </TableHeader>
              </>
            ))}
          </tr>

          <tr>
            <TableHeader>整天事件</TableHeader>
            {days.map((day, index) => (
              <TableData key={`${day}`}>
                <EventList
                  events={events.filter((event) => {
                    const eventWeekNumber = getWeekNumber(event.date);
                    const weekArray = getDatesForWeekNumber(
                      weekNumber,
                      date.getFullYear()
                    );
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
                        eventWeekNumber === weekNumber
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
  max-width: 1400px;
  border-collapse: collapse;
  border: none;
  color: #fff;
  background-color: rgba(64, 64, 64, 0.5);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  font-weight: bold;
`;

const TableRow = styled.tr`
  
  border-radius: 10px;
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: center;
  border-radius: 10px;
`;

const TableData = styled.td`
  
  border: 1px solid #ccc;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const TableCell = styled.td`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background-color: rgba(52, 103, 161, 0.5);
  width: auto;
  font-size: 12px;
  text-align: center;
  margin: 0 auto;
  border-radius: 5px;
  padding: 0px 10px;
  display: flex;
  ${(props) => props.rowSpan && `row-span: ${props.rowSpan};`}
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 100%;
`;

export default HourlyView;
