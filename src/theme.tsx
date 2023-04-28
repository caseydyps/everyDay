import { css, createGlobalStyle, keyframes } from 'styled-components';
import wave from './svg.png';
export const colors = {
  primary: '#629DDA',
  lighterShade: '#9bb9de',
  darkerShade: '#3467a1',
  complementaryColor1: '#dadae8',
  complementaryColor2: '#e2dada',
  accentColor1: '#ff9f4d',
  accentColor2: '#ffb96f',
};

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

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  body {
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 400;
    font-weight: bold;
    /* background: linear-gradient(
      -45deg,
      white,
      #fff5c9,
      #9bb9de,
      #629dda,
      #9bb9de,
      #142850
    ); */

    background: #D7DDE2;
    background-image: url(${wave});
    /* linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%); */
    /* animation: ${GradientAnimation} 20s ease-in-out infinite;
    background-size: 300% 300%; */
  }
`;
