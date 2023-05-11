import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThreeDButton } from '../Button/Button';
import styled from 'styled-components/macro';
import Chat from '../../pages/Main/Widget/ChatWidget/ChatWidget';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

export const ChatToggle = () => {
  const [showChat, setShowChat] = useState(false);
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: '8',
      }}
    >
      <ChatButton onClick={() => setShowChat(!showChat)}>
        <FontAwesomeIcon icon={faCommentDots} />
      </ChatButton>
      {showChat && (
        <CSSTransition in={showChat} timeout={300} classNames="fade">
          <ChatBoxContainer show={showChat}>
            <ChatBoxHeader>
              <ChatBoxTitle>Family Time</ChatBoxTitle>
              <ChatBoxCloseButton onClick={() => setShowChat(false)}>
                Close
              </ChatBoxCloseButton>
            </ChatBoxHeader>
            <Chat></Chat>
          </ChatBoxContainer>
        </CSSTransition>
      )}
    </div>
  );
};

const ChatButton = styled(ThreeDButton)`
  width: 50px;
  height: 50px;
  margin: 0 auto;
  position: absolute;
  right: 10px;
  text-align: center;
  margin: 0 auto;
  padding: 5px 10px;
  border: none;
  border-radius: 50%;
  background-color: #5981b0;
  color: #f6f8f8;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #3467a1;
    color: white;
  }
`;

type ChatBoxProps = {
  show: boolean;
};

const ChatBoxContainer = styled.div<ChatBoxProps>`
  position: fixed;
  bottom: 70px;
  right: 90px;
  z-index: 8;
  max-width: 400px;
  background-color: #f6f8f8;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ChatBoxHeader = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3d6b;
  color: #f6f8f8;
`;

const ChatBoxTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin: 0 auto;
  color: #f6f8f8;
  font-family: 'Braah One';
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const ChatBoxCloseButton = styled.div`
  cursor: pointer;
  font-size: 14px;
  position: absolute;
  right: 5%;
`;
