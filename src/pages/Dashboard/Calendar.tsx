import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import DragNDrop from './DragNDrop';

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

function Calendar() {
  return <Wrapper>Calendar</Wrapper>;
}

export default Calendar;
