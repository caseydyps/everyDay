import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <Link to="/dashboard">Home</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/todo">To-Do List</Link>
      <Link to="/ai">AI Input</Link>
      <Link to="/suggestion">AI Suggestion</Link>
      <Link to="/milestone">Milestone</Link>
      <Link to="/family">Family</Link>
      <Link to="/whiteboard">Whiteboard</Link>
      <Link to="/album">Album</Link>
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  display: flex;
  width: 10vw;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  padding-top: 50px;
  background-color: #f8f8f8;

  a {
    margin-bottom: 20px;
    color: #333;
    font-size: 32px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
export default Sidebar;
