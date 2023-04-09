import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
`;

const NavItem = styled.a`
  margin-left: 1rem;
  color: #333;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>My App</Logo>
      <Nav>
        <NavItem href="#">Home</NavItem>
        <NavItem href="#">About</NavItem>
        <NavItem href="#">Contact</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
