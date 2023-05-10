import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../config/Context/authContext';
import { db } from '../../config/firebase.config';
import Message from './Message';
import SendMessage from './SendMessage';
import React from 'react';
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

  const handleTopButtonClick = () => {
    if (chatContainerTop && scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
      setChatContainerTop(false);
    } else {
      if (scrollTop.current) {
        scrollTop.current.scrollIntoView({ behavior: 'smooth' });
        setChatContainerTop(true);
      }
    }
  };

  const messagesWithSticky = stickyMessage
    ? [stickyMessage, ...messages.filter((m) => m.id !== stickyMessage.id)]
    : messages;
  console.log('Messages with sticky:', messagesWithSticky);

  const { familyId, membersArray } = useContext(AuthContext);
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

const ChatContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  height: 70vh;
  width: 85vw;
  overflow: auto;
  margin-top: 0px;
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

export default Chat;
