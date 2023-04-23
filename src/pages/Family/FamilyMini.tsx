import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import Sidebar from '../../Components/Nav/Navbar';
import { CirclePicker, TwitterPicker } from 'react-color';
// import AvatarCreator from './Avatar';
// import { handleLoadAvatar } from './Avatar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import LoadingAnimation from '../../Components/loading';
import confetti from 'canvas-confetti';

import {
  collection,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import UserAuthData from '../../Components/Login/Auth';
import Layout from '../../Components/layout';
const FamilyMemberForm = () => {
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
  } = UserAuthData();
  console.log('user', user);
  console.log('hasSetup', hasSetup);
  const [numberOfMembers, setNumberOfMembers] = useState<number>(0);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const handleFamilyConnect = async () => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchMembers = async () => {
      console.log(familyId);
      const familyDocRef = collection(db, 'Family', familyId, 'members');

      //const familyCollection = collection(db, 'Family', familyId, 'users');
      // const queryUser = where('familyId', '==', {
      //   userId: familyId,
      // });

      const membersData: any = await getDocs(familyDocRef)
        .then((querySnapshot) =>
          querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        )
        .catch((error) =>
          console.error('Error retrieving members data:', error)
        );
      console.log(membersData);
      const matchingData = membersData.find(
        (data: any) => data.familyId === familyId
      );
      console.log(matchingData);
      //todo: set members by fetching firestore
      setMembers(membersData);
      //console.log(matchingData.familyMembers.length);
      if (membersData.length > 0) {
        setFormSubmitted(true);
      }
    };
    fetchMembers();
  }, [familyId]);

  interface FamilyMember {
    name: string;
    avatar: string;
    birthday: string;
    role: string;
    seed: string;
    skinColor: string;
    eyebrows: string;
    eyes: string;
    hair: string;
    hairProbability: number;
    hairColor: string;
    mouth: string;
    email: string;
    background: string;
    feature: string;
    featuresProbability: number;
    anniversaries: { date: string; description: string }[];
  }

  const [seed, setSeed] = useState<string>('Sassy');
  const [skinColor, setSkinColor] = useState<string>('f2d3b1');
  const [eyebrows, setEyebrows] = useState<string>('variant01');
  const [eyes, setEyes] = useState<string>('variant01');
  const [hair, setHair] = useState<string>('short01');
  const [hairProbability, setHairProbability] = useState<number>(100);
  const [hairColor, setHairColor] = useState<string>('0e0e0e');
  const [mouth, setMouth] = useState<string>('variant01');
  const [background, setBackground] = useState<string>('transparent');
  const [feature, setFeature] = useState<string>('blush');
  const [featuresProbability, setFeaturesProbability] = useState<number>(100);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&skinColor=${skinColor}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);
  function getAvatarUrl(member: any): string {
    return `https://api.dicebear.com/6.x/adventurer/svg?seed=${member.seed}&skinColor=${skinColor}&eyebrows=${member.eyebrows}&eyes=${member.eyes}&hair=${member.hair}&hairProbability=${member.hairProbability}&hairColor=${member.hairColor}&mouth=${member.mouth}&backgroundColor=${member.background}&features=${member.feature}&featuresProbability=${member.featuresProbability}`;
  }

  useEffect(() => {
    const member = {
      seed,
      skinColor,
      eyebrows,
      eyes,
      hair,
      hairProbability,
      hairColor,
      mouth,
      background,
      feature,
      featuresProbability,
    };
    const newAvatarUrl = getAvatarUrl(member);
    setAvatarUrl(newAvatarUrl);
  }, [
    seed,
    skinColor,
    eyebrows,
    eyes,
    hair,
    hairProbability,
    hairColor,
    mouth,
    background,
    feature,
    featuresProbability,
  ]);

  const generateAvatarUrl = () => {
    const baseUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&skinColor=${skinColor}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`;

    setAvatarUrl(baseUrl);
  };

  const handleSeedChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].seed = event.target.value;
    setSeed(event.target.value);
    setMembers(newMembers);
  };

  interface AddMinusInputProps {
    value: number | string;
    onIncrement: () => void;
    onDecrement: () => void;
    children: React.ReactNode;
  }

  function handleCardClick(index: number) {
    setSelectedCardIndex(index);
  }

  function handleCardLeave() {
    setSelectedCardIndex(-1);
  }

  console.log('hasSetup', hasSetup, 'formSubmitted', formSubmitted);
  console.log(members);
  console.log(members.length);

  console.log('avatarUrl', avatarUrl);

  function getCurrentAge(dateOfBirth) {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = now.getFullYear() - birthDate.getFullYear();
    let monthDiff = now.getMonth() - birthDate.getMonth();
    let dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
      monthDiff = 12 + monthDiff; // add 12 months to get the correct number of months
      dayDiff = 30 + dayDiff; // add 30 days to get the correct number of days
    }

    const yearString = age > 0 ? `${age}歲` : '';
    const monthString = monthDiff > 0 ? `${monthDiff}個月` : '';
    const dayString = dayDiff > 0 ? `${dayDiff}天` : '';

    return (
      <div>
        {yearString && <span>{yearString}</span>}
        {yearString && monthString && <br />}
        {monthString && <span>{monthString}</span>}
      </div>
    );
  }
  return (
    <Container>
      {members.map((member, index) => (
        <Card
          key={index}
          onMouseOver={() => handleCardClick(index)}
          onMouseOut={handleCardLeave}
        >
          <AvatarImage src={member.avatar} alt="avatar"></AvatarImage>
          {selectedCardIndex === index && (
            <HiddenText>{getCurrentAge(member.birthday)}</HiddenText>

            // <CardDiv>
            //   <HiddenText>{member.role}</HiddenText>
            //   <HiddenText>{member.birthday}</HiddenText>
            //   <HiddenText>{getCurrentAge(member.birthday)}</HiddenText>
            // </CardDiv>
          )}
        </Card>
      ))}
    </Container>
  );
};

export default FamilyMemberForm;

const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
};

const Form = styled.form`
  display: flex;
  flex-direction: column;

  margin: 0 0;
  flex: 1;
  justify-content: center;
  text-align: center;
  z-index: 1;
`;

const FormField = styled.div`
  margin: 10px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const FlexWrap = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  margin: 5px;
`;

const FormLabel = styled.label`
  display: block;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  font-weight: bold;
  margin-right: 10px;
  flex-basis: 30%;
  text-align: left;
`;

const FormInput = styled.input`
  display: block;
  width: 50%;
  padding: 0.5rem;
  border: 5px solid #3467a1;
  border-radius: 25px;
  font-size: 20px;
  line-height: 1.5;
  font-weight: bold;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  flex-basis: 70%;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1
  margin-bottom: 1rem;

  flex: 1;
  flex-direction: column;
  > img {
    width: 500px;
    height: 500px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AvatarImage = styled.img`
  max-width: 50px;
  max-height: 50px;
`;

const Button = styled.button`
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

const AvatarPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  background-color: lightgray;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  border-radius: 50%;
`;
const FormButton = styled.button`
  background-color: #0077c2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 32px;
  cursor: pointer;
`;

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

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 300% 300%;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: space-between;
  flex-wrap: wrap;
  min-width: 100%;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  justify-content: top;
  align-items: center;
  display: flex;
  height: auto;
  z-index: 1;
`;

const SettingDoneBtn = styled.button``;

const Title = styled.div`
  font-size: 5vw;
  font-weight: bold;
  margin-top: 50px;
  text-align: center;
  color: white;
`;

const Card = styled.div`
  width: 50px;
  margin-top: 50px;
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
    transform: scale(1.9);
  }
`;

const FormCard = styled(Card)`
  flex: 1;
  height: 100%;
  min-height: 90vh;
  width: 700px;
  backdrop-filter: blur(8px);
  font-size: 24px;
  background: none;
  backdrop-filter: blur(10px);
  &:hover {
    transform: scale(1);
  }
  backdrop-filter: blur(16px);
  box-shadow: 0 15px 25px rgba(129, 124, 124, 0.2);
`;

const Wrap = styled.div`
  margin: 80 auto;
  justify-content: center;
  text-align: center;
  border-radius: 25px;
  height: calc(100vh - 50px);
  transition: all 0.2s ease-in-out;
`;

const FormDropdown = styled.select`
  font-size: 20px;
  padding: 8px;
  border-radius: 25px;
  border: 1px solid #3467a1;
  background-color: #transparent;
  margin: 20px;
  &:focus {
    outline: none;
    border: 2px solid blue;
  }
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  flex-basis: 30%;
`;

const Select = styled.select`
  font-size: 16px;
  padding: 8px;
  flex-basis: 30%;
  border-radius: 25px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  width: 150px;
  padding: 8px;

  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 32px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Text = styled.p`
  padding: 5px;
  font-size: 20px;
`;

const Popup = styled.div`
  background-color: #629dda;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  height: 30px;
  width: 300px;
`;

const CardDiv = styled.div`
  position: absolute;
  top: 0%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: center;
  width: 120%;
  box-shadow: 0 15px 25px rgba(129, 124, 124, 0.2);
  height: 120%;
  z-index: 6;
  border-radius: 5px;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
  text-align: center;
  transform: scale(1.1);
  img {
    height: 60%;
  }
`;

const HiddenText = styled.p`
  font-size: 6px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`;
