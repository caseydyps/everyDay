import React, { useState } from 'react';
import { auth, db } from '../../config/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';
const style = {
  form: `h-14 w-full max-w-[728px]  flex text-xl absolute bottom-0`,
  input: `w-full text-xl p-3 bg-gray-900 text-white outline-none border-none`,
  button: `w-[20%] bg-green-500`,
};

const Input = styled.input`
  flex: 1;
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
  background-color: #395dff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2e46bb;
  }
`;

const VoteButton = styled(Button)`
  background-color: #f0ad4e;
  margin-left: 10px;

  &:hover {
    background-color: #ec971f;
  }
`;

const SendMessage = ({ scroll }) => {
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === '') {
      alert('Please enter a valid message');
      return;
    }
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'messages'), {
      text: input,
      name: displayName,
      uid,
      timestamp: serverTimestamp(),
    });
    setInput('');
    scroll.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form onSubmit={sendMessage} className={style.form}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type="text"
        placeholder="Message"
      />
      <Button className={style.button} type="submit">
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
