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
  color: #3467a1;
  border: none;
  border-radius: 15px;
  font-weight: bold;
  margin: 0px 10px;
  padding: 10px;
  font-size: 16px;
  &:hover {
    transform: scale(1.1);
  }
`;

export default LogOut;
