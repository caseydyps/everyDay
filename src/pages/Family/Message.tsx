import React from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components/macro';

const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isSent ? 'flex-end' : 'flex-start')};
  width: 50%;
  height: 60px;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: ${(props) =>
    props.isSent
      ? '#90CAF9'
      : 'linear-gradient(rgb(255, 143, 178) 0%, rgb(167, 151, 255) 50%, rgb(0, 229, 255) 100%)'};
  color: ${(props) => (props.isSent ? 'white' : 'black')};
  backdrop-filter: blur(8px);
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
    timestamp: Date;
  };
}

interface MessageBubbleProps {
  isSent: boolean;
}

interface Props {
  message: MessageType;
}

interface MessageType {
  uid: string;
  name: string;
  text: string;
}

const MessageContainer = styled.div`
  margin: 10 auto;
  overflow: auto;
  display: flex;
  width: 100vw;
  height: 100%;
`;

const Message: any = ({ message }: Props) => {
  const isSent = message.uid === auth.currentUser?.uid;
  // const milliseconds = message.timestamp.seconds * 1000;
  // // Convert nanoseconds to milliseconds
  // const nanosecondsInMilliseconds = message.timestamp.nanoseconds / 1000000;
  // const date = new Date(milliseconds + nanosecondsInMilliseconds);
  // const formatDate = (date) => {
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hour = String(date.getHours()).padStart(2, '0');
  //   const minute = String(date.getMinutes()).padStart(2, '0');

  //   return `${month}/${day} ${hour}:${minute}`;
  // };

  // console.log(formatDate(date));

  return (
    <MessageContainer>
      <MessageBubble isSent={isSent}>
        <SenderName>{message.name}</SenderName>
        <p>{message.text}</p>
        {/* <p>{formatDate(date)}</p> */}
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;
