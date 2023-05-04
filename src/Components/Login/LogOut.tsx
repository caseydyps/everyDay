import React from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components/macro';
import { useState } from 'react';
import { ThreeDButton } from '../Button/Button';

const LogOut = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const signOut = () => {
    setIsLoggingOut(true);
    auth.signOut();
    setTimeout(() => {
      window.location.href = '/';
    }, 1000); // Redirect after 3 seconds
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
