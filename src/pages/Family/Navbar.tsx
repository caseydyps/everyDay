import React from 'react';
import SignIn from './SignIn';
import LogOut from './LogOut';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
const Nav = styled.div`
  background-color: 'transparent';
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Heading = styled.h3`
  color: #ffffff;
  height: 50px;
  align-items: center;
  margin: 0 auto;
`;

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <Nav>
      <Heading>家庭聊天室</Heading>
      {/* {user ? <LogOut /> : <SignIn />} */}
    </Nav>
  );
};

export default Navbar;
