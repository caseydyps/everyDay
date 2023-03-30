import React from 'react';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
const Wrapper = styled.div`
  width: 100vw;
  height: 100px;
  border: 2px solid black;
`;

function Header() {
  return <Wrapper>Header</Wrapper>;
}

export default Header;
