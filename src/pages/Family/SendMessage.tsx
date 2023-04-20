import React, { useState } from 'react';
import { auth, db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';
import UserAuthData from '../../Components/Login/Auth';
import { DefaultButton } from '../../Components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
interface SendMessageProps {
  scroll: React.RefObject<HTMLDivElement>;
}

const Input = styled.input`
  margin-right: 10px;
  padding: 10px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #fff5c9;
  color: #2e46bb;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2e46bb;
    color: white;
  }
`;

const VoteButton = styled(Button)`
  background-color: #f0ad4e;
  margin-left: 10px;

  &:hover {
    background-color: #ec971f;
  }
`;

const SendMessage: React.FC<SendMessageProps> = ({ scroll }) => {
  const [input, setInput] = useState('');
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
  } = UserAuthData();
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') {
      alert('Please enter a valid message');
      return;
    }
    const { uid, displayName }: any = auth.currentUser;
    await addDoc(collection(db, 'Family', familyId, 'messages'), {
      text: input,
      name: displayName,
      email: userEmail,
      uid,
      timestamp: serverTimestamp(),
    });
    setInput('');
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Form onSubmit={sendMessage}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="輸入訊息"
      />
      <Button type="submit">
        <FontAwesomeIcon type="submit" icon={faPaperPlane} />
      </Button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

export default SendMessage;
