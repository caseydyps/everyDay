import styled from 'styled-components/macro';

const TimelineWrapper = styled.div`
  position: absolute;
  width: 90%;
  height: 4px;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #aaa;
`;
const TimelineDot = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: -5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #aaa;
`;

function getDatesRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const Timeline = ({ events }) => {
  const eventDates = events.map((event) => event.date.toDateString());
  const dateRange = getDatesRange(eventDates);

  return (
    <TimelineWrapper>
      {dateRange.map((date) => {
        const hasEvent = eventDates.includes(date.toDateString());
        return (
          <TimelineDot key={date}>{hasEvent && <TimelineDot />}</TimelineDot>
        );
      })}
    </TimelineWrapper>
  );
};

export default Timeline;
