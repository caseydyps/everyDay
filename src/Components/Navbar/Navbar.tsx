import React from 'react';
import styled from 'styled-components';
import SmartInputMini from '../../pages/AI/SmartInputMini';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchBar = styled.input`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 1rem;
  flex-grow: 1;
`;

const Navbar = () => {
  return (
    <Nav>
      <Avatar
        src="https://api.dicebear.com/6.x/adventurer/svg?seed=Sassy&eyebrows=variant01&eyes=variant01&hair=short01&hairProbability=100&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100"
        alt="Avatar"
      />
      <SmartInputMini />
      <div>
        <Icon>Chat</Icon>
        <Icon>Notification</Icon>
      </div>
    </Nav>
  );
};

export default Navbar;
