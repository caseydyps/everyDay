import React from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components/macro';

const LogOut = () => {
  const signOut = () => {
    auth.signOut();
  };

  return <LogoutButton onClick={signOut}>登出</LogoutButton>;
};

const LogoutButton = styled.button`
  background-color: #fff5c9;
  color: #3467a1;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 32px;
  &:hover {
    transform: scale(1.1);
  }
`;

export default LogOut;
