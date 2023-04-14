import React from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components';

const MessageBubble = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => (props.isSent ? '#395dff' : '#e5e5ea')};
  color: ${(props) => (props.isSent ? 'white' : 'black')};
  justify-content: ${(props) => (props.isSent ? 'flex-end' : 'flex-start')};
`;

const SenderName = styled.p`
  margin-top: -1.5rem;
  color: #7a7a7a;
  font-size: 0.8rem;
`;

const PinButton = styled.button`
  margin-left: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const MessageContainer = styled.div`
  //   position: ${(props) => (props.isPinned ? 'absolute' : 'relative')};
  //   top: ${(props) => (props.isPinned ? 0 : 'auto')};
  //   left: ${(props) => (props.isPinned ? 0 : 'auto')};
  //   right: ${(props) => (props.isPinned ? 0 : 'auto')};
  //   z-index: ${(props) => (props.isPinned ? 1 : 'auto')};
`;

const Message = ({ message, isPinned, onPinMessage }) => {
  const isSent = message.uid === auth.currentUser.uid;

  return (
    <MessageContainer isPinned={isPinned}>
      <MessageBubble isSent={isSent} isPinned={isPinned}>
        <SenderName>{message.name}</SenderName>
        <p>{message.text}</p>
        <PinButton onClick={onPinMessage}>
          {isPinned ? 'Unpin' : 'Pin'}
        </PinButton>
      </MessageBubble>
      {/* {isPinned ? <p>{message.text}</p> : null} */}
    </MessageContainer>
  );
};

export default Message;
