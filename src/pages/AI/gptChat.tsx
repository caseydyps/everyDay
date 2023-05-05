import { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message as ChatMessage,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import firebase from 'firebase/app';
import { db } from '../../config/firebase.config';

// const firebaseConfig = {
//   apiKey: 'AIzaSyDrG9uBznJyP7Fe_4JRwVG7pvR7SjScQsg',
//   authDomain: 'board-12c3c.firebaseapp.com',
//   projectId: 'board-12c3c',
//   storageBucket: 'board-12c3c.appspot.com',
//   messagingSenderId: '662676665549',
//   appId: '1:662676665549:web:d2d23417c365f3ec666584',
//   measurementId: 'G-YY6Q81WPY9',
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
const config = require('../../config/config');

const API_KEY = config.openai.apiKey;
//const db = firebase.firestore();

//const API_KEY = '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'; // 替換為您的 OpenAI API Key

const systemMessage = {
  role: 'system',
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

const AskGPTPage = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: 'just now',
      sender: 'ChatGPT',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend(message) {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
      sentTime: new Date().toLocaleString(),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages, newMessage);
  }

  console.log('messages:', messages);

  async function storeQuestionAndAnswer(
    question: { message: any },
    answer: { message: any; sender?: string }
  ) {
    try {
      const storedQuestions = JSON.parse(
        localStorage.getItem('questions') || '[]'
      );
      const newQuestion = {
        question: question.message,
        answer: answer.message,
        timestamp: firebase.firestore.Timestamp.now().toString(),
      };
      localStorage.setItem(
        'questions',
        JSON.stringify([...storedQuestions, newQuestion])
      );
    } catch (error) {
      console.error('Error writing to local storage: ', error);
    }
  }

  async function processMessageToChatGPT(chatMessages: any[]) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...apiMessages],
    };

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        console.log(data);

        return data.json();
      })
      .then((data) => {
        console.log(data);
        if (data.choices && data.choices.length > 0) {
          const chatGPTMessage = {
            message: data.choices[0].message.content,
            sender: 'ChatGPT',
          };
          storeQuestionAndAnswer(
            newMessages[newMessages.length - 1],
            chatGPTMessage
          );
          setMessages([...chatMessages, chatGPTMessage]);
        } else {
          console.error('No choices returned from the API.');
        }
        setIsTyping(false);
      })
      .catch((error) => {
        console.error('Error fetching API:', error);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return (
                  <ChatMessage
                    key={i}
                    model={{
                      position: 0,
                      direction:
                        message.sender === 'ChatGPT' ? 'incoming' : 'outgoing',
                      message: message.message,
                      sentTime: message.sentTime,
                      sender: message.sender,
                    }}
                  />
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default AskGPTPage;
