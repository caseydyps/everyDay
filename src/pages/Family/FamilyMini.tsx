import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { db } from '../../config/firebase.config';
import Popper from '@mui/material/Popper';
import { AuthContext } from '../../config/Context/authContext';
import { collection, getDocs } from 'firebase/firestore';

const FamilyMemberForm = () => {
  const { user, userEmail, hasSetup, familyId, membersArray } =
    useContext(AuthContext);
  console.log('user', user);
  console.log('hasSetup', hasSetup);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchMembers = async () => {
      console.log(familyId);
      const familyDocRef = collection(db, 'Family', familyId, 'members');
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
      setMembers(membersData);
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

  interface AddMinusInputProps {
    value: number | string;
    onIncrement: () => void;
    onDecrement: () => void;
    children: React.ReactNode;
  }
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setHoverIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };
  function getCurrentAge(dateOfBirth: string) {
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

        {monthString && <span>{monthString}</span>}
      </div>
    );
  }
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Container>
      <BoxTitle>{members.length}</BoxTitle>
      {members.map((member, index) => (
        <Card
          key={index}
          onMouseEnter={(event) => handleMouseEnter(event, index)}
          onMouseLeave={handleMouseLeave}
        >
          <AvatarImage src={member.avatar} alt="avatar" />
          {hoverIndex === index && (
            <StyledPopper open={Boolean(anchorEl)} anchorEl={anchorEl}>
              <>
                {member.role}
                <br />
                {member.birthday}
                {getCurrentAge(member.birthday)}
              </>
            </StyledPopper>
          )}
        </Card>
      ))}
    </Container>
  );
};

export default FamilyMemberForm;

const BoxTitle = styled.h3`
  position: absolute;
  right: 10px;
  top: -10px;
  color: #1e3d6b;
`;

const StyledPopper = styled(Popper)`
  padding: 20px;
  margin-top: 50px;
  border-radius: 10px;
  justify-content: space-around;
  align-items: center;
  display: flex;
  width: 100px;
  height: 60px;
  font-size: 16px;
  color: #f6f8f8;
  text-align: center;
  background-color: #5981b0;
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
`;

const AvatarImage = styled.img`
  max-width: 50px;
  max-height: 50px;
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
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  position: relative;
  justify-content: center;
  animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 300% 300%;
`;

const Card = styled.div`
  width: 50px;
  margin-top: 20px;
  border-radius: 50%;
  font-size: 36px;
  background-color: transparent;
  height: 50px;

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
    transform: scale(1.05);
  }
`;
