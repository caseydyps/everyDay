import React from 'react';
import GoogleButton from 'react-google-button';
import styled from 'styled-components/macro';
import { auth } from '../../config/firebase.config';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.1);
  }
`;

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const SignIn = () => {
  return (
    <Wrapper>
      <GoogleButton onClick={googleSignIn} />
    </Wrapper>
  );
};

export default SignIn;
