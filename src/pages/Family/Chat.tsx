import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import SendMessage from './SendMessage';
import { db } from '../../config/firebase.config';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'messages'),
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
        };
        messages.push(message);
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ChatContainer>
      <main>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </main>
      <SendMessage scroll={scroll} />
      <span ref={scroll}></span>
    </ChatContainer>
  );
};

export default Chat;
