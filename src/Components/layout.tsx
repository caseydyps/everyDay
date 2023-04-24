import styled, { keyframes } from 'styled-components';
import { ReactNode } from 'react';
export const GradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  
`;

const Background = styled.div`
  width: 100vw;
  margin-top: 0px;
  height: 100vh;
  background: linear-gradient(
    -45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 300% 300%;
`;

const PageContainer = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0 auto;
`;

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <PageContainer>{children}</PageContainer>
    </>
  );
};

export default Layout;
