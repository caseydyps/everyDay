import React from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components';

const MessageBubble = styled.div<MessageBubbleProps>`
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

interface MessageProps {
  message: {
    uid: string;
    name: string;
    text: string;
  };
}

interface MessageBubbleProps {
  isSent: boolean;
}

const MessageContainer = styled.div``;

const Message: React.FC<MessageProps> = ({ message }) => {
  const isSent = message.uid === auth.currentUser?.uid;

  return (
    <MessageContainer>
      <MessageBubble isSent={isSent}>
        <SenderName>{message.name}</SenderName>
        <p>{message.text}</p>
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;
