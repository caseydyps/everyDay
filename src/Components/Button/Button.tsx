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

export const CancelButton = styled.button`
  background-color: #eb5757; /* a shade of red that contrasts with the theme color */
  color: #ffffff; /* white text color */
  border: none; /* removes the default button border */
  padding: 10px 20px; /* adds some padding to the button */
  border-radius: 4px; /* rounds the button edges */
  cursor: pointer; /* shows the pointer cursor on hover */
  font-size: 16px; /* sets the font size */
  font-weight: 500; /* sets the font weight */
  transition: all 0.3s ease; /* adds a smooth transition effect */

  /* styles the button on hover */
  &:hover {
    background-color: #c0392b; /* a darker shade of red */
  }
`;

export const CloseButton = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative; /* adds positioning context for the pseudo-element */

  /* adds a pseudo-element and styles it as an X */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 20px;
    height: 2px;
    background-color: white;
    transition: all 0.3s ease; /* adds a smooth transition effect */
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg); /* rotates the second line in the opposite direction */
  }

  &:hover {
    color: #e74c3c;
  }

  &:active {
    /* adds styles when the button is clicked */
    &::before,
    &::after {
      background-color: black;
    }
  }
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

export const Card = styled.div`
  width: 300px;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  background-color: #transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  p {
    margin: 0 0 10px;
  }

  img {
    width: 100%;
    height: auto;
    margin-top: 10px;
    border-radius: 50%;
  }
  &:hover {
    transform: scale(1.1);
  }
`;
export default DefaultButton;
