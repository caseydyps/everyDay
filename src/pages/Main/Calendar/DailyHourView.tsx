import { useState } from 'react';
import styled from 'styled-components/macro';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  multiDay: boolean;
  day: string;
  date: string;
  endDate: string;
  time: string;
}
interface Props {
  events: Event[];
  weekNumber: number;
  date: Date;
  selectedDate: Date;
}

const DailyHourlyView: any = ({
  events,
  weekNumber,
  date,
  selectedDate,
}: Props) => {
  const [hoveredEventId, setHoveredEventId] = useState<any>(null);
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

  const EventList = ({ events }: any) => {
    return (
      <ul>
        {events.map((event: any) => {
          return (
            <TableCell
              onMouseEnter={() => handleMouseEnter(event.id)}
              onMouseLeave={handleMouseLeave}
              key={event.id}
              rowSpan={event.endTime - event.time + 1}
              draggable="true"
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
  const selectedDayOfWeek = days[selectedDate.getDay()];

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            <TableHeader>{selectedDayOfWeek}</TableHeader>
          </tr>
          <tr>
            <TableHeader>整天事件</TableHeader>
            <TableData>
              <EventList
                events={events.filter((event) => {
                  const eventWeekNumber = getWeekNumber(event.date);
                  const dateString = `${selectedDate.getFullYear()}-${String(
                    selectedDate.getMonth() + 1
                  ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(
                    2,
                    '0'
                  )}`;
                  return (
                    event.date <= dateString &&
                    event.endDate >= dateString &&
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
  overflow: auto;
  overflow-y: auto;
  height: 800px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(64, 64, 64, 0.5);
  color: #fff;
  overflow: auto;
  height: 800px;
`;

const TableRow = styled.tr`
  border: 1px solid #ccc;
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: center;
  width: 100px;
  border: 1px solid #ccc;
`;

const TableData = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
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
