import styled from 'styled-components/macro';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const MonthNavigation = ({ date, handlePrevMonth, handleNextMonth }) => (
  <MonthContainer>
    <Button onClick={handlePrevMonth}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </Button>
    <MonthLabel>{`${
      months[date.getMonth()]
    } ${date.getFullYear()}`}</MonthLabel>
    <Button onClick={handleNextMonth}>
      <FontAwesomeIcon icon={faChevronRight} />
    </Button>
  </MonthContainer>
);

const MonthContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const MonthLabel = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #5981b0;
  border-radius: 20px;
  background-color: transparent;
  padding: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
  border: none;
  z-index: 5;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #5981b0;
  &:hover {
    color: #3467a1;
  }
`;
