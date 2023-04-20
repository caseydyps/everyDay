import { keyframes } from 'styled-components';
import styled from 'styled-components';

export const DefaultButton = styled.button`
  background-color: #fff5c9;
  color: #3467a1;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 60px;
  font-size: 20px;
  &:hover {
    transform: scale(1.1);
  }
`;

const ConfirmButton = styled.button`
  background-color: #629dda;
  color: #fff;
`;

const EditButton = styled.button`
  background-color: gray;
  color: #fff;
`;

export const Button = styled.button`
  background-color: #fff5c9;
  color: #3467a1;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 60px;
  font-size: 20px;
  &:hover {
    transform: scale(1.1);
  }
`;

export const LoadButton = styled(Button)`
  background-color: transparent;
  color: grey;
  max-width: 100px;
  margin: 0 auto;
  border: 1px solid grey;
`;

export default DefaultButton;
