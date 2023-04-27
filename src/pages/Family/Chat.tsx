import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import SendMessage from './SendMessage';
import { db } from '../../config/firebase.config';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { LoadButton } from '../../Components/Button/Button';
import UserAuthData from '../../Components/Login/Auth';
const ChatContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  height: 70vh;
  width: 85vw;
  overflow: auto;
  margin-top: 0px;
`;
const CenterWrap = styled.div`
  display: flex;
  justify-content: center; /* Center the child element horizontally */
  align-items: center; /* Center the child element vertically */
  height: auto;
  flex-direction: column;
`;

const CopiedMessage = styled.div`
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  text-align: center;
`;

interface Message {
  uid: string;
  name: string;
  text: string;
  timestamp: {
    nanoseconds: number;
    seconds: number;
  };
  id: string;
}

const ChatBottom = styled.span`
  float: left;
  clear: both;
`;

const ChatTop = styled.span`
  float: left;
  clear: both;
`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stickyMessage, setStickyMessage] = useState<any>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const scrollTop = useRef<HTMLDivElement>(null);
  const firstMessageRef = useRef(null);
  const [chatContainerTop, setChatContainerTop] = useState(false);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // const handleTopButtonClick = () => {
  //   const chatContainer = document.getElementById('chat-container');
  //   chatContainer.scrollTop = 0;
  // };

  const handleTopButtonClick = () => {
    const chatTop = document.getElementById('chat-container');
    const chatBottom = document.getElementById('chat-bottom');

    if (chatContainerTop && scroll.current) {
      // If the chat container is currently at the top, set it to the bottom position
      scroll.current.scrollIntoView({ behavior: 'smooth' });
      setChatContainerTop(false);
    } else {
      // If the chat container is currently at the bottom, set it to the top position
      if (scrollTop.current) {
        scrollTop.current.scrollIntoView({ behavior: 'smooth' });
        setChatContainerTop(true);
      }
    }
  };

  // const handleStickButtonClick = (message) => {
  //   setStickyMessage({ ...message });
  //   if (stickyMessage) {
  //     setStickyMessage(null);
  //   }
  // };

  const handleUnstickButtonClick = () => {
    console.log('Unstick button clicked! Sticky message:', stickyMessage);
    setStickyMessage(null);
  };

  const messagesWithSticky = stickyMessage
    ? [stickyMessage, ...messages.filter((m) => m.id !== stickyMessage.id)]
    : messages;
  console.log('Messages with sticky:', messagesWithSticky);

  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
  } = UserAuthData();
  useEffect(() => {
    console.log(familyId);
    if (!familyId) {
      return;
    }
    const q = query(
      collection(db, 'Family', familyId, 'messages'),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          uid: data.uid,
          name: data.name,
          text: data.text,
          timestamp: data.timestamp,
          id: doc.id,
          email: data.email,
        };
        messages.push(message);
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [familyId]);

  return (
    <ChatContainer id="chat-container">
      <ChatTop ref={scrollTop} />
      <TopButton onClick={handleTopButtonClick}>
        {chatContainerTop ? 'Bottom' : 'Top'}
      </TopButton>
      {messagesWithSticky.map((message, index) => (
        <div key={message.id}>
          {/* {!stickyMessage ? (
            <StickyButton onClick={() => handleStickButtonClick(message)}>
              釘選
            </StickyButton>
          ) : index === 1 ? (
            <CancelButton onClick={handleUnstickButtonClick}>X</CancelButton>
          ) : null} */}
          <Message
            message={message}
            ref={index === 0 ? firstMessageRef : null}
          ></Message>
        </div>
      ))}
      <SendMessage scroll={scroll} />
      <ChatBottom id="chat-bottom" ref={scroll} />
    </ChatContainer>
  );
};

const TopButton = styled.button`
  position: sticky;
  z-index: 2;
  width: 100px;
  top: 0%;
  left: 50%;
  margin-bottom: 10px;
  transform: translateX(-50%);
  transform-origin: center;
  transition: transform 0.2s ease-out;

  background-color: transparent;
  color: #3467a1;

  padding: 10px;
  border: 1px solid #3467a1;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #3467a1;
    color: white;
  }
`;

const StickyButton = styled(LoadButton)`
  z-index: 2;
  width: 30px;
  height: 30px;
  font-size: 0.8rem;
`;

const CancelButton = styled(StickyButton)`
  z-index: 2;
  width: 30px;
  height: 30px;
  font-size: 0.8rem;
  background-color: red;
`;

export default Chat;
