import { useState } from 'react';
import styled from 'styled-components/macro';
import { auth } from '../../config/firebase.config';
import { ThreeDButton } from '../Button/Button';
import React from 'react';
const LogOut = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const signOut = () => {
    setIsLoggingOut(true);
    auth.signOut();
    setTimeout(() => {
      window.location.href = '/';
    }, 1000); 
  };

  return <LogoutButton onClick={signOut}>登出</LogoutButton>;
};

const LogoutButton = styled(ThreeDButton)`
  color: #3467a1;
  border: none;
  border-radius: 15px;
  font-weight: bold;
  margin: 0px 40px;
  padding: 10px;
  font-size: 12px;
  &:hover {
    transform: scale(1.1);
  }
`;

export default LogOut;
