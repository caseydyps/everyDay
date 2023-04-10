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

const TimelineDot = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: -5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #aaa;
`;

function getDatesRange(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

type Event = {
  date: Date;
  // add any other properties
};

type TimelineProps = {
  events: Event[];
};

const Timeline = ({ events }: TimelineProps): JSX.Element => {
  const eventDates = events.map((event) => event.date.toDateString());
  const startDate = new Date(
    Math.min(...events.map((event) => event.date.getTime()))
  );
  const endDate = new Date(
    Math.max(...events.map((event) => event.date.getTime()))
  );
  const dateRange = getDatesRange(startDate, endDate);

  return (
    <TimelineWrapper>
      {dateRange.map((date) => {
        const hasEvent = eventDates.includes(date.toDateString());
        return (
          <TimelineDot key={date.getTime()} top={0}>
            {hasEvent && <TimelineDot top={5} />}
          </TimelineDot>
        );
      })}
    </TimelineWrapper>
  );
};

export default Timeline;
