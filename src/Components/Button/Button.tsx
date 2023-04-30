import { keyframes } from 'styled-components';
import styled from 'styled-components';

export const DefaultButton = styled.button`
  background-color: #f6f8f8;
  color: #5981b0;
  // border: 2px solid #3467a1;
  border-radius: 20px;
  font-weight: bold;
  padding: 5px 10px;
  margin: 5px;
  font-size: 16px;
  border: none;
  //box-shadow: 3px 3px 5px black;
  &:hover {
    transform: scale(1.1);
    color: #1e3d6b;
  }
`;

export const ThreeDButton = styled.button`
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-size: inherit;
  font-family: inherit;
  padding: 1.25em 2em;
  border: 2px solid #bcc8d8;
  border-radius: 0.75em;
  font-weight: 700;
  color: #414141;
  text-transform: uppercase;
  background: #f1f5fb;
  transform-style: preserve-3d;
  transition: 0.15s cubic-bezier(0, 0, 0.6, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: #a8bdd1;
    box-shadow: 0 0 0 2px #bcc8d8, 0 0.625em 0 0 #e3e9f2;
    transform: translate3d(0, 0.75em, -1em);
    transition: 0.15s cubic-bezier(0, 0, 0.6, 1);
  }

  &:hover {
    background: #e4ebf4;
    transform: translate(0, 0.25em);
  }

  &:hover::before {
    box-shadow: 0 0 0 2px #bcc8d8, 0 0.5em 0 0 #e3e9f2;
    transform: translate3d(0, 0.5em, -1em);
  }

  &:active {
    background: #d8e0eb;
    transform: translate(0, 0.75em);
  }

  &:active::before {
    box-shadow: 0 0 0 2px #bcc8d8, 0 0 #e3e9f2;
    transform: translate3d(0, 0, -1em);
  }
`;

export const AddButton = styled(DefaultButton)`
  font-weight: bold;
  font-size: 16px;
  margin: 10px;
  &:hover {
    transform: scale(1.1);
    background-color: #f6f8f8;
    color: #5981b0;
    border: 2px solid #5981b0;
  }
  border: 2px solid #f6f8f8;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 5;
  margin: 20px;
  width: 120px;
  color: #f6f8f8;
  background-color: #5981b0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export const ConfirmButton = styled(DefaultButton)`
  background-color: #f6f8f8;
  color: #3467a1;
  // border: 2px solid #3467a1;
  border-radius: 20px;
  font-weight: bold;
  padding: 5px 10px;
  margin: 5px;
  font-size: 16px;
  border: none;
  //box-shadow: 3px 3px 5px black;
  &:hover {
    transform: scale(1.1);
    color: #1e3d6b;
  }
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
  box-shadow: 3px 3px 5px black;
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
  box-shadow: 3px 3px 5px black;
`;

export const Card = styled.div`
  width: 300px;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  background-color: transparent;
  box-shadow: 3px 3px 5px black;
  //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

const Banner = styled.div`
  width: 100vw;
  height: 300px;
  border: 3px solid red;
  color: #3467a1;
`;

export default DefaultButton;
