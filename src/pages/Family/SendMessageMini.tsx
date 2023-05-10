import React, { useState, useContext } from 'react';
import { auth, db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';
import { AuthContext } from '../../config/Context/authContext';
import { ThreeDButton } from '../../Components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import SmartInput from '../AI/SmartInput';
import { CloseButton } from '../../Components/Button/Button';
interface SendMessageProps {
  scroll: any;
}

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  margin-right: 10px;
`;

const Button = styled(ThreeDButton)`
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 16px;

  margin: 5px;
  padding: 10px 20px;

  background-color: #5981b0;
  color: #f6f8f8;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #3467a1;
    color: white;
  }
`;

const SmartInputButton = styled(ThreeDButton)`
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 12px;

  margin: 5px;

  background-color: #5981b0;
  color: #f6f8f8;

  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #3467a1;
    color: white;
  }
`;


const SendMessage: React.FC<SendMessageProps> = ({ scroll }) => {
  const [input, setInput] = useState('');
  const [showSmartInput, setShowSmartInput] = useState(false);
  const { user, userEmail, hasSetup, familyId, membersArray } =
    useContext(AuthContext);
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') {
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
        <ChatBoxInputArea>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type your message..."
          />
          <Button type="submit">
            <FontAwesomeIcon type="submit" icon={faPaperPlane} />
          </Button>
          <SmartInputButton onClick={handleButtonClick}>
            Smart Input
          </SmartInputButton>
        </ChatBoxInputArea>
      </Form>

      {showSmartInput && (
        <Container>
          <CloseButton
            style={{ zIndex: '5', position: 'absolute', top: '0', left: '0' }}
            onClick={handleButtonClick}
          ></CloseButton>
          <SmartInput onClose={handleButtonClick}></SmartInput>
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

const ChatBoxInputArea = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #e6e6e6;
  padding: 10px;
`;
