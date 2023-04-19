import { keyframes } from 'styled-components';
import styled from 'styled-components';

const DefaultButton = styled.button`
  background-color: #629dda;
  color: #fff;
  //padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
  width: 60px;
`;

const ConfirmButton = styled.button`
  background-color: #629dda;
  color: #fff;
`;

const EditButton = styled.button`
  background-color: gray;
  color: #fff;
`;

export default DefaultButton;
