import React from 'react';
import GoogleButton from 'react-google-button';

import styled from 'styled-components/macro';
import { auth } from '../../config/firebase.config';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { ThreeDButton } from '../Button/Button';

const Wrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
  &:hover {
    transform: scale(1.1);
  }
`;

export const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const SignIn = () => {
  return (
    <Wrapper>
      <GoogleLoginButton onClick={googleSignIn}>
        {' '}
        Continue with Google
      </GoogleLoginButton>
      {/* <GoogleButton type="dark" onClick={googleSignIn} /> */}
    </Wrapper>
  );
};

const GoogleLoginButton = styled(ThreeDButton)`
  background-color: #5995dd;
  color: #f6f8f8;
  width: auto;
  font-size: 8px;
  &:hover {
    background: #e4ebf4;
    transform: translate(0, 0.25em);
    color: #5981b0;
    box-shadow: 0 0 0 2px #bcc8d8, 0 0.375em #e3e9f2;
  }
`;
export default SignIn;
