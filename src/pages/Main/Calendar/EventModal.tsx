import styled from 'styled-components/macro';
import React from 'react';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
import { AddButton, CloseButton } from '../../../Components/Button/Button';

export const EventModal = ({
  showModal,
  eventTitle,
  setEventTitle,
  eventDate,
  handleDateChange,
  eventTime,
  setEventTime,
  handleSelectMember,
  handleEventSubmit,
}) => {
  if (!showModal) return null;

  return (
    <Modal>
      <ModalForm onSubmit={handleEventSubmit}>
        <StyledCloseButton />
        <label>
          Title:
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </label>
        <label>
          Start:
          <input
            type="date"
            value={eventDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={eventTime}
            step="1800"
            onChange={(e) => setEventTime(e.target.value)}
          />
        </label>
        <label>
          Member:
          <MembersSelector onSelectMember={handleSelectMember} />
        </label>
        <Wrap>
          <AddButton type="submit">Add</AddButton>
        </Wrap>
      </ModalForm>
    </Modal>
  );
};

const Modal = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalForm = styled.form`
  position: absolute;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  border-radius: 10px;
  padding: 30px 30px;
  color: #f5f5f5;
  width: 400px;
  label {
    display: block;
    margin-bottom: 5px;
    color: #414141;
  }
  input[type='text'],
  input[type='date'],
  input[type='time'],
  select {
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size: 16px;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: 10px;
  top: 10px;
`;
