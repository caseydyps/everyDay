import React, { useState } from 'react';
import { auth, db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';
import UserAuthData from '../../Components/Login/Auth';
import { DefaultButton } from '../../Components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import SmartInput from '../AI/SmartInput';
import { CloseButton } from '../../Components/Button/Button';
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
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
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

const SmartInputButton = styled(Button)`
  width: 100px;
  margin: 0 auto;
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
  const [showSmartInput, setShowSmartInput] = useState(false);
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
  const handleButtonClick = () => {
    setShowSmartInput(!showSmartInput);
  };

  return (
    <>
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
      <SmartInputButton onClick={handleButtonClick}>
        Smart Input
      </SmartInputButton>
      {showSmartInput && (
        <Container>
          <CloseButton
            style={{ zIndex: '5', position: 'absolute', top: '0', left: '0' }}
            onClick={handleButtonClick}
          ></CloseButton>
          <SmartInput style={{ position: 'relative' }}></SmartInput>
        </Container>
      )}
    </>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const Container = styled.div`
  max-width: 800px;
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
`;

export default SendMessage;
