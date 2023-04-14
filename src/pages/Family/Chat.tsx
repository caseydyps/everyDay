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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [pinnedMessageId, setPinnedMessageId] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const scroll = useRef();

  useEffect(() => {
    const q = query(
      collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'messages'),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id, isPinned: false });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handlePinMessage = (messageId) => {
    if (pinnedMessageId === messageId) {
      // If the pinned message is already selected, unpin it
      setPinnedMessageId(null);
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return { ...message, isPinned: false };
          } else {
            return message;
          }
        })
      );
    } else {
      // Pin the selected message
      setPinnedMessageId(messageId);
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return { ...message, isPinned: true };
          } else {
            return { ...message, isPinned: false };
          }
        })
      );
    }
  };

  const handleCopyMessage = (message) => {
    setCopiedMessage(message);
  };

  const pinnedMessage =
    messages.find((message) => message.isPinned) || messages[0];

  return (
    <ChatContainer>
      <main>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isPinned={message.id === pinnedMessage.id}
            onPinMessage={() => handlePinMessage(message.id)}
            onCopyMessage={() => handleCopyMessage(message)}
          />
        ))}
      </main>
      {copiedMessage && (
        <CopiedMessage>{copiedMessage.text} (Copied)</CopiedMessage>
      )}
      <SendMessage scroll={scroll} />
      <span ref={scroll}></span>
    </ChatContainer>
  );
};

export default Chat;
