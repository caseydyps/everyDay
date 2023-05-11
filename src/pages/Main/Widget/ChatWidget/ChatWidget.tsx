import React, { useState, useEffect, useRef, useContext } from 'react';
import Message from './Message';
import SendMessage from '../../Chat/SendMessageMini';
import { db } from '../../../../config/firebase.config';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { AuthContext } from '../../../../config/Context/authContext';
const ChatContainer = styled.div``;

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
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const messagesWithSticky = stickyMessage
    ? [stickyMessage, ...messages.filter((m) => m.id !== stickyMessage.id)]
    : messages;

  const { familyId } = useContext(AuthContext);
  useEffect(() => {
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

    const lastReadMessageIndex = localStorage.getItem('lastReadMessageIndex');
    const unreadMessageCount =
      messages.length -
      (lastReadMessageIndex ? parseInt(lastReadMessageIndex) + 1 : 0);
    setUnreadMessageCount(unreadMessageCount);

    if (unreadMessageCount > 0) {
      const notification = new Notification(
        `You have ${unreadMessageCount} unread messages`
      );
      notification.onclick = () => {
        window.focus();
      };
    }

    return () => unsubscribe();
  }, [familyId]);

  return (
    <ChatContainer id="chat-container">
      <ChatTop ref={scrollTop} />
      <MessageWrap>
        {messagesWithSticky.map((message, index) => (
          <div key={message.id}>
            <Message
              message={message}
              ref={index === 0 ? firstMessageRef : null}
            ></Message>
          </div>
        ))}
      </MessageWrap>

      <SendMessage scroll={scroll} />
      <ChatBottom id="chat-bottom" ref={scroll} />
    </ChatContainer>
  );
};

const MessageWrap = styled.div`
  height: 300px;
  overflow-y: scroll;
`;

export default Chat;
