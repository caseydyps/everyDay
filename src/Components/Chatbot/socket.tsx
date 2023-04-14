import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { io } from 'socket.io-client';
import styled, { keyframes, createdGlobalStyle } from 'styled-components/macro';
import chatIcon from './chat.png';
import chatIconActive from './chatActive.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import {
  faExpand,
  faCompress,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';

const primaryColor = '#828282';
const secondaryColor = '#ECEFF1';

const FixedImage = styled.img`
  position: fixed;
  bottom: 250px;
  left: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  z-index: 4;
  background-color: #d7ccc8;
  @media only screen and (max-width: 768px) {
    /* Styles for small screens */
    Chat {
      width: 90%;
      height: 400px;
      bottom: 100px;
      left: 5%;
    }
  }
`;

const UserImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-left: 0px;
  border-radius: 50%;
  background-color: #f2f2f2;
`;

const AdminImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-left: 0px;
  border-radius: 50%;
  background-color: #f2f2f2;
  align-self: flex-end;
`;

const Chat = styled.div`
  z-index: 203;
  position: fixed;

  bottom: 300px;
  left: 120px;
  width: 500px;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  transition: all 0.3s ease-in-out;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateX(0)' : 'translateX(100%)'};
  width: ${({ isExpanded }) => (isExpanded ? '600px' : '400px')};
  height: ${({ isExpanded }) => (isExpanded ? '600px' : '300px')};
  @media only screen and (max-width: 768px) {
    /* Styles for small screens */
    Chat {
      width: 90%;
      height: 400px;
      bottom: 100px;
      left: 5%;
    }
    FixedImage {
      bottom: 150px;
      left: 10%;
      width: 50px;
      height: 50px;
    }
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${primaryColor};
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.isOnline ? '#4CAF50' : '#ccc')};
`;

const ChatMessages = styled.div`
  padding: 20px 20px 70px 20px; /* Add bottom padding to make space for the input area */
  height: calc(100% - 65px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: -10px;
  right: 0px;
  padding: 0px;
  width: 100%;
  margin-bottom: 0px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 32px;
  background-color: #f2f2f2;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
  font-weight: bold;
  &::placeholder {
    color: #aaa;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
`;

const ExpandIcon = styled(FontAwesomeIcon)``;
const CustomerMessage = styled.div`
  width: auto;
  max-width: 150px;
  height: auto;
  color: white;
  background-color: #bcaaa4;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  margin-bottom: 10px;
  word-wrap: break-word;
`;

const Broadcast = styled.div`
  width: 100%;
  max-width: 100%;
  height: auto;
  color: white;
  background-color: #bcaaa4;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  word-wrap: break-word;
`;

const Reply = styled.div`
  width: auto;
  max-width: 150px;
  height: auto;
  color: white;
  background-color: #8d6e63;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
  margin-bottom: 10px;
  word-wrap: break-word;
`;
const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${primaryColor};
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 15px;
  right: 5px;
`;

const UnreadMessageIndicator = styled.div`
  position: fixed;
  width: 20px;
  height: 20px;
  background-color: #f44336;
  border-radius: 50%;
  bottom: 310px;
  z-index: 205;
  left: 90px;
`;

const ChatIconWrap = styled.div``;

const ReplyTime = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: auto;
  margin-bottom: 10px;
`;

const CustomerMessageTime = styled.span`
  font-size: 12px;
  color: #888;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const MarqueeAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
`;

const Marquee = styled.div`
  animation: ${MarqueeAnimation} 20s linear infinite;
  white-space: nowrap; /* added property */
  text-overflow: ellipsis; /* added property */
  opacity: ${(props) => (props.isOverflowing ? 0 : 1)};
`;

const MarqueeContainer = styled.div`
  top: 50%;
  left: 50%;
  width: 50%;
  width: auto;
  height: auto;
  overflow: hidden;
  color: white;
  background-color: #8d6e63;

  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
  margin-bottom: 0px;
  word-wrap: break-word;
`;

export const Socket = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [broadcast, setBroadcast] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isSupportOnline, setIsSupportOnline] = useState(false);
  const socketRef = useRef();
  const [itemState, setItemState] = useState('UP');
  const [isChatboxVisible, setIsChatboxVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  useEffect(() => {
    const firebaseUrl = 'https://<your-firebase-project>.firebaseio.com';
    socketRef.current = io('https://side-project2023.online/');
    // socketRef.current = io("http://localhost:4000/");

    socketRef.current.on('chat message', (data) => {
      const { message, sender, timestamp } = data;
      setHasUnreadMessages(true);
      console.log(hasUnreadMessages);
      const formattedTime = timestamp.toLocaleString('en-US');
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          sender,
          time: formattedTime,
        },
      ]);
    });

    socketRef.current.on('support-status', (isOnline) => {
      setIsSupportOnline(isOnline);
    });

    socketRef.current.on('broadcast channel', (data) => {
      console.log(data);
      setBroadcast(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      socketRef.current.emit('check-support-status');
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleUserIdChange = (e) => {
    if (!hasSentFirstMessage) {
      setUserId(e.target.value);
      socketRef.current.emit('register', e.target.value);
    }
  };

  const handleSendMessage = () => {
    const timestamp = new Date();
    const formattedTime = timestamp.toLocaleString('en-US');
    console.log(formattedTime); // Outputs: Mon 02:47 AM GMTs
    if (userId === 'customer-support') {
      const recipientId = prompt('Enter the user ID to reply:');
      setHasUnreadMessages(true);
      console.log(hasUnreadMessages);
      socketRef.current.emit('chat message', {
        id: recipientId,
        message,
        formattedTime,
      });
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          sender: 'Me',
          time: formattedTime,
        },
      ]);

      socketRef.current.emit('chat message', { message });
    }

    setMessage('');
    if (!hasSentFirstMessage) {
      setHasSentFirstMessage(true);
    }
  };

  const handleChatboxToggle = () => {
    setIsChatboxVisible(!isChatboxVisible);
    if (isChatboxVisible) {
      setHasUnreadMessages(false);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //   useEffect(() => {
  //     if (isExpanded) {
  //       setUnreadMessages(0);
  //     }
  //   }, [isExpanded]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMarqueeRef = (node) => {
    console.log('node' + node);
    if (node !== null) {
      setIsOverflowing(node.offsetWidth < node.scrollWidth);
    }
  };

  return (
    <div>
      <ChatIconWrap>
        <FixedImage
          src={isChatboxVisible ? chatIconActive : chatIcon}
          alt="Chat Icon"
          onClick={handleChatboxToggle}
        />
        <UnreadMessageIndicator
          style={{
            backgroundColor:
              hasUnreadMessages && !isChatboxVisible ? 'red' : 'transparent',
          }}
        ></UnreadMessageIndicator>
      </ChatIconWrap>
      <Chat isVisible={isChatboxVisible} isExpanded={isExpanded}>
        <ChatHeader onClick={toggleExpand}>
          <StatusIndicator
            id="support-status-light"
            isSupportOnline={true}
            style={{
              backgroundColor: isSupportOnline ? 'green' : 'red',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
            }}
          />
          {isSupportOnline ? '客服在線上' : '客服下班嘍'}
          <ExpandIcon icon={isExpanded ? faCompress : faExpand} />
        </ChatHeader>
        {broadcast !== '' && (
          <MarqueeContainer>
            <Marquee
              isOverflowing={isOverflowing}
              ref={handleMarqueeRef}
            >{`📢全館優惠中: ${broadcast}`}</Marquee>
          </MarqueeContainer>
        )}
        <ChatMessages>
          <div ref={messagesEndRef} />
          {hasSentFirstMessage ? (
            <CustomerMessage>
              {`您好，${userId}。歡迎使用聊天功能。`}
            </CustomerMessage>
          ) : (
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              placeholder="親，該怎麼稱呼您？"
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '20px',
                padding: '10px',
                backgroundColor: '#f2f2f2',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                color: '#333',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
              disabled={hasSentFirstMessage}
            />
          )}

          {messages.map((msg, index) => {
            console.log('msg sender: ' + msg.sender);
            const date = new Date(msg.time);

            const formattedDateString = `${
              date.getMonth() + 1
            }/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;

            console.log(formattedDateString);
            if (msg.sender === 'Me') {
              console.log('me');
              return (
                <>
                  <CustomerMessage key={index}>{msg.text}</CustomerMessage>
                  <CustomerMessageTime>{msg.time}</CustomerMessageTime>
                </>
              );
            } else if (msg.sender === 'customer-support') {
              console.log('customer-support');
              return (
                <>
                  <Reply key={index}>{msg.text}</Reply>
                  <ReplyTime>{formattedDateString}</ReplyTime>
                </>
              );
            }
          })}

          <ChatInputContainer>
            <ChatInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="親, 這邊可以輸入訊息喔!"
              disabled={!userId} // disable the input if userId is empty
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleSendMessage();
                }
              }}
            />
            <SendButton onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </SendButton>
          </ChatInputContainer>
          <div ref={messagesEndRef} />
        </ChatMessages>
      </Chat>
    </div>
  );
};
export default Socket;
