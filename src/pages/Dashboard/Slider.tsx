import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1800px;
  height: 100%;
  display: flex;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  /* Style the scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
`;

const Item = styled.div`
  display: inline-block;
  width: 200px;
  height: 110px;
  line-height: 110px;
  background-color: #ccc;
  margin-right: 20px;
`;

const Slider = () => {
  return (
    <Container>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
      <Item>Card1</Item>
    </Container>
  );
};

export default Slider;
