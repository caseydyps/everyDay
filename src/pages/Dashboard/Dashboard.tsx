import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  border: 2px solid black;
  display: flex;

  flex-wrap: wrap;
`;

const Calendar = styled.div`
  height: 200px;
  width: 250px;
  border: 2px solid black;
  margin: 10px;
`;

const Financial = styled.div`
  height: 200px;
  width: 250px;
  border: 2px solid black;
  margin: 10px;
`;

const Milestone = styled.div`
  height: 200px;
  width: 750px;
  border: 2px solid black;
  margin: 10px;
`;

const Todo = styled.div`
  height: 200px;
  width: 250px;
  border: 2px solid black;
  margin: 10px;
`;

const Whiteboard = styled.div`
  height: 200px;
  width: 500px;
  border: 2px solid black;
  margin: 10px;
`;

const Album = styled.div`
  height: 200px;
  width: 250px;
  border: 2px solid black;
  margin: 10px;
`;
function Dashboard() {
  return (
    <Wrapper>
      <Calendar>Calendar</Calendar>
      <Whiteboard>Whiteboard</Whiteboard>
      <Financial>Financial</Financial>

      <Todo>Todo</Todo>

      <Album>Album</Album>
      <Milestone>Milestone</Milestone>
    </Wrapper>
  );
}

export default Dashboard;
