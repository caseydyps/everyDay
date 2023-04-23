import { css, createGlobalStyle } from 'styled-components';

export const colors = {
  primary: '#629DDA',
  lighterShade: '#9bb9de',
  darkerShade: '#3467a1',
  complementaryColor1: '#dadae8',
  complementaryColor2: '#e2dada',
  accentColor1: '#ff9f4d',
  accentColor2: '#ffb96f',
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: 400;
    font-weight: bold;
  }
`;
