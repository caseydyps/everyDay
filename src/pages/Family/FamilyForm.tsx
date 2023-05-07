import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import Sidebar from '../../Components/Nav/Navbar';
import { CirclePicker, TwitterPicker } from 'react-color';
// import AvatarCreator from './Avatar';
// import { handleLoadAvatar } from './Avatar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import LoadingAnimation from '../../Components/loading';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { AuthContext } from '../../config/Context/authContext';
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
import { ThreeDButton } from '../../Components/Button/Button';
const FamilyMemberForm = () => {
  const { familyId } = UserAuthData();
  const { user, userEmail, hasSetup, setHasSetup, membersArray } =
    useContext(AuthContext);
  console.log(familyId);
  console.log('user', user);
  console.log('hasSetup', hasSetup);
  const [numberOfMembers, setNumberOfMembers] = useState<number>(1);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  // const handleFamilyConnect = async () => {
  //   e.preventDefault();
  // };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(members);
    const familyRef = collection(db, 'Family');
    const usersRef = collection(db, 'Family', familyId, 'members');
    const familyCollection = collection(db, 'Family');
    const queryUser = where('familyMembers', 'array-contains', {
      userEmail: userEmail,
    });
    try {
      const matchingDocs = await getDocs(query(familyCollection, queryUser));
      console.log(matchingDocs);
      const matchingDocRef = matchingDocs.docs[0].ref;
      console.log(matchingDocs);
      await updateDoc(matchingDocRef, { isSettingDone: true });

      // Delete all existing user documents
      const querySnapshot = await getDocs(usersRef);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      const familyDocRef = doc(db, 'Family', familyId);
      console.log(familyId);
      const familyData = {
        familyId: familyId,
        familyMembers: members.map((member) => ({ userEmail: member.email })),
        isSettingDone: true,
      };

      // Save each member as a separate document in the users collection
      members.forEach(async (member) => {
        await setDoc(doc(usersRef, member.name), member);
        await setDoc(familyDocRef, familyData);
        console.log(member.email);
      });

      console.log('Members have been saved to Firestore!');
      console.log(members);
      setFormSubmitted(true);
      setHasSetup(true);
    } catch (error) {
      console.error('Error saving members to Firestore: ', error);
    }
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

  // const handleLoadAvatar = () => {
  //   const avatarDetails = JSON.parse(localStorage.getItem('members'));

  //   if (avatarDetails) {
  //     setSeed(avatarDetails[index].seed);
  //     setEyebrows(avatarDetails[avatarIndex].eyebrows);
  //     setEyes(avatarDetails[avatarIndex].eyes);
  //     setHair(avatarDetails[avatarIndex].hair);
  //     setHairColor(avatarDetails[avatarIndex].hairColor);
  //     setMouth(avatarDetails[avatarIndex].mouth);
  //     setBackground(avatarDetails[avatarIndex].background);
  //     setFeature(avatarDetails[avatarIndex].feature);
  //     setFeaturesProbability(avatarDetails[avatarIndex].featuresProbability);
  //   }
  // };

  // useEffect(() => {
  //   handleLoadAvatar();
  // }, []);

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

  // const handleNumberOfMembersChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const numberOfMembers = parseInt(event.target.value);
  //   setNumberOfMembers(numberOfMembers);
  //   setMembers(
  //     Array(numberOfMembers)
  //       .fill(undefined)
  //       .map(
  //         (): FamilyMember => ({
  //           name: '',
  //           avatar: '',
  //           birthday: '',
  //           role: '',
  //           anniversaries: [],
  //           seed: '',
  //           eyebrows: '',
  //           eyes: '',
  //           hair: '',
  //           hairColor: '',
  //           hairProbability: 0,
  //           mouth: '',
  //           background: '',
  //           feature: '',
  //           featuresProbability: 0,
  //         })
  //       )
  //   );
  // };
  const handleMemberNameChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].name = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberEmailChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].email = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberBirthdayChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].birthday = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberRoleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].role = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberAnniversaryChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    const anniversaryDate = event.target.value;
    const anniversaryDescription = '';
    newMembers[index].anniversaries.push({
      date: anniversaryDate,
      description: anniversaryDescription,
    });
    setMembers(newMembers);
  };

  const handleMemberAnniversaryDateChange = (
    index: number,
    anniversaryIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].anniversaries[anniversaryIndex].date = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberAnniversaryDescriptionChange = (
    index: number,
    anniversaryIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].anniversaries[anniversaryIndex].description =
      event.target.value;
    setMembers(newMembers);
  };

  const handleAddAnniversary = (index: number) => {
    const newMembers = [...members];
    newMembers[index].anniversaries.push({ date: '', description: '' });
    setMembers(newMembers);
  };

  interface FormInputProps {
    type: string;
    min?: number;
    value: number | string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const handleNumberOfMembersIncrement = () => {
    setNumberOfMembers(numberOfMembers + 1);
    setMembers((prevMembers: any) => [
      ...prevMembers,
      {
        name: '',
        avatar: '',
        birthday: '',
        role: '',
        anniversaries: [],
        seed: '',
        eyebrows: '',
        eyes: '',
        hair: '',
        hairColor: '',
        hairProbability: 0,
        mouth: '',
        background: '',
        feature: '',
        featuresProbability: 0,
      },
    ]);
  };

  const handleNumberOfMembersDecrement = () => {
    if (numberOfMembers > 1) {
      const newNumberOfMembers = numberOfMembers - 1;
      setNumberOfMembers(newNumberOfMembers);
      setMembers((prevMembers) => prevMembers.slice(0, newNumberOfMembers));
    }
  };

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

  const handleSkinColorChange = (index: number, event: any) => {
    console.log(event);
    console.log('here');
    const newMembers = [...members];
    newMembers[index].skinColor = event.replace('#', '');
    setSkinColor(event.replace('#', ''));
    setMembers(newMembers);
  };
  const handleEyebrowsChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].eyebrows = event.target.value;
    setEyebrows(event.target.value);
    setMembers(newMembers);
  };
  const handleEyesChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].eyes = event.target.value;
    setEyes(event.target.value);
    setMembers(newMembers);
  };
  const handleHairChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const newMembers = [...members];

    // If "none" is selected, set hair to "short19" and probability to 0
    if (value === 'none') {
      setHair('short19');
      setHairProbability(0);
      newMembers[index].hair = 'short19';
      newMembers[index].hairProbability = 0;
    } else {
      // Otherwise, set hair to the selected value and probability to 100
      setHair(value);
      setHairProbability(100);
      newMembers[index].hair = value;
      newMembers[index].hairProbability = 100;
    }

    // Update the members array in local storage and state
    // localStorage.setItem('members', JSON.stringify(newMembers));
    setMembers(newMembers);
  };

  const handleHairColorChange = (index: number, event: any) => {
    const newMembers = [...members];
    newMembers[index].hairColor = event.replace('#', '');
    setHairColor(event.replace('#', ''));
    setMembers(newMembers);
  };

  const handleMouthChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].mouth = event.target.value;
    setMouth(event.target.value);
    setMembers(newMembers);
  };

  const handleBackgroundChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].background = event.target.value;
    setBackground(event.target.value);
    setMembers(newMembers);
  };

  const handleFeatureChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (value === 'none') {
      const newMembers = [...members];
      newMembers[index].feature = event.target.value;
      newMembers[index].featuresProbability = 0;
      newMembers[index].feature = 'mustache';
      setFeaturesProbability(0);
      setFeature('mustache');
      setMembers(newMembers);
    } else {
      const newMembers = [...members];
      newMembers[index].feature = event.target.value;
      setFeature(value);
      newMembers[index].featuresProbability = 100;
      setFeaturesProbability(100);
      setMembers(newMembers);
    }
  };

  const handleAvatarSave = (
    avatarUrl: string,
    index: number,
    seed: string,
    skinColor: string,
    eyebrows: string,
    eyes: string,
    hair: string,
    hairProbability: number,
    hairColor: string,
    mouth: string,
    background: string,
    feature: string,
    featuresProbability: number
  ) => {
    Swal.fire({
      title: 'Avatar setup success!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index
          ? {
              ...member,
              avatar: avatarUrl,
              seed: seed,
              skinColor: skinColor,
              eyebrows: eyebrows,
              eyes: eyes,
              hair: hair,
              hairProbability: hairProbability,
              hairColor: hairColor,
              mouth: mouth,
              background: background,
              feature: feature,
              featuresProbability: featuresProbability,
            }
          : member
      )
    );
  };
  const handleClick = () => {
    // Configure the confetti settings
    type Options = {
      angle: number;
      spread: number;
      startVelocity: number;
      elementCount: number;
      dragFriction: number;
      duration: number;
      stagger: number;
      colors: string[];

      gravity: number;
    };

    type Shape = string;
    const shapes: Shape[] = ['square', 'circle', 'triangle'].map(
      (shape) => shape as Shape
    );
    const config: Options = {
      angle: 90,
      spread: 45,
      startVelocity: 40,
      elementCount: 50,
      dragFriction: 0.12,
      duration: 3000,
      stagger: 3,
      colors: ['#F08080', '#FFD700', '#008000', '#00BFFF'],
      gravity: 1,
    };

    // Create the confetti animation
    confetti(config);
  };

  interface AddMinusInputProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    children: React.ReactNode;
  }

  function AddMinusInput(props: AddMinusInputProps) {
    const { value, onIncrement, onDecrement, children } = props;

    return (
      <FormField style={{ flexDirection: 'column' }}>
        <span style={{ marginTop: '0', color: 'white', fontSize: '16px' }}>
          {children}
        </span>
        <RowWrap>
          <Button
            style={{
              marginTop: '0',
              borderRadius: '50%',
              cursor: value === 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={onDecrement}
            disabled={value === 1}
          >
            v
          </Button>
          <span
            style={{
              textAlign: 'center',
              color: '#5981b0',
              fontSize: '24px',
              margin: '0 10px',
            }}
          >
            {value}
          </span>
          <Button
            style={{
              marginTop: '0',
              borderRadius: '50%',
              cursor: value > 5 ? 'not-allowed' : 'pointer',
            }}
            onClick={onIncrement}
            disabled={value > 5}
          >
            ʌ
          </Button>
        </RowWrap>
      </FormField>
    );
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
  return (
    <Container>
      {hasSetup ? (
        <Wrap>
          <Title>Family Members</Title>
          <ColumnWrap>
            <RowWrap>
              {members.map((member, index) => (
                <Card
                  key={index}
                  // onMouseOver={() => handleCardClick(index)}
                  // onMouseOut={handleCardLeave}
                >
                  <RowWrap>
                    <Text> {member.name}</Text>
                    <Split> | </Split>
                    <Text> {member.role}</Text>
                  </RowWrap>
                  <AvatarImage src={member.avatar} alt="avatar"></AvatarImage>
                  {selectedCardIndex === index && (
                    <CardDiv>
                      <HiddenText>{member.email}</HiddenText>
                      <HiddenText>{member.role}</HiddenText>
                      <HiddenText>{member.birthday}</HiddenText>
                    </CardDiv>
                  )}
                </Card>
              ))}
            </RowWrap>
          </ColumnWrap>

          <Button
            onClick={() => {
              setHasSetup(false);
              setFormSubmitted(false);
              setNumberOfMembers(members.length);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/dashboard';
            }}
          >
            Dashboard
          </Button>
        </Wrap>
      ) : (
        <>
          <FormContainer>
            <FormCard style={{ flex: '2', zIndex: '2', width: 'auto' }}>
              <Form onSubmit={handleFormSubmit}>
                <AddMinusInput
                  value={numberOfMembers}
                  onIncrement={handleNumberOfMembersIncrement}
                  onDecrement={handleNumberOfMembersDecrement}
                >
                  <Text
                    style={{
                      color: '#414141',
                    }}
                  >
                    How many members?
                  </Text>
                </AddMinusInput>

                {numberOfMembers > 0 && (
                  <div>
                    <div>
                      <Text>Set up your family one by one</Text>
                      <FormDropdown
                        value={currentMemberIndex}
                        onChange={(event) =>
                          setCurrentMemberIndex(parseInt(event.target.value))
                        }
                      >
                        {members.map((member, index) => (
                          <option key={index} value={index}>
                            {`Member ${index + 1}`}
                          </option>
                        ))}
                      </FormDropdown>
                      {members[currentMemberIndex] && (
                        <div>
                          <FormField>
                            <Text
                              style={{
                                color: '#414141',
                              }}
                            >
                              Name
                            </Text>
                            <FormInput
                              type="text"
                              value={members[currentMemberIndex].name}
                              onChange={(event) =>
                                handleMemberNameChange(
                                  currentMemberIndex,
                                  event
                                )
                              }
                            />
                          </FormField>

                          <FormField>
                            <Text
                              style={{
                                color: '#414141',
                              }}
                            >
                              Email
                            </Text>
                            <FormInput
                              type="text"
                              value={members[currentMemberIndex].email}
                              onChange={(event) =>
                                handleMemberEmailChange(
                                  currentMemberIndex,
                                  event
                                )
                              }
                            />
                          </FormField>

                          <FormField>
                            <Text
                              style={{
                                color: '#414141',
                              }}
                            >
                              Birthday
                            </Text>
                            <FormInput
                              type="date"
                              value={members[currentMemberIndex].birthday}
                              max={new Date().toISOString().split('T')[0]}
                              onChange={(event) =>
                                handleMemberBirthdayChange(
                                  currentMemberIndex,
                                  event
                                )
                              }
                            />
                          </FormField>

                          <FormField>
                            <Text
                              style={{
                                color: '#414141',
                              }}
                            >
                              Role{' '}
                            </Text>
                            <FormInput
                              type="text"
                              value={members[currentMemberIndex].role}
                              placeholder="爸爸/媽媽/女兒/兒子..."
                              onChange={(event) =>
                                handleMemberRoleChange(
                                  currentMemberIndex,
                                  event
                                )
                              }
                            />
                          </FormField>

                          {/* <FormField>
                          <FormLabel>紀念日</FormLabel>
                          {members[currentMemberIndex].anniversaries.map(
                            (anniversary, anniversaryIndex) => (
                              <ColumnWrap key={anniversaryIndex}>
                                <FormInput
                                  type="date"
                                  value={anniversary.date}
                                  onChange={(event) =>
                                    handleMemberAnniversaryDateChange(
                                      currentMemberIndex,
                                      anniversaryIndex,
                                      event
                                    )
                                  }
                                />
                                <FormInput
                                  type="text"
                                  value={anniversary.description}
                                  onChange={(event) =>
                                    handleMemberAnniversaryDescriptionChange(
                                      currentMemberIndex,
                                      anniversaryIndex,
                                      event
                                    )
                                  }
                                />
                              </ColumnWrap>
                            )
                          )}
                          <Button
                            onClick={() =>
                              handleAddAnniversary(currentMemberIndex)
                            }
                          >
                            Add Anniversary
                          </Button>
                        </FormField> */}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <></>

                <ConfettiButton onClick={handleClick} type="submit">
                  完成設定🎉
                </ConfettiButton>
              </Form>
            </FormCard>
            <FormCard style={{ flex: '3', width: 'auto' }}>
              {numberOfMembers > 0 && (
                <AvatarContainer>
                  <FormLabel style={{ color: '#414141', fontSize: '28px' }}>
                    Avator Setup
                  </FormLabel>
                  <FormField>
                    <ColumnWrap
                      key={currentMemberIndex}
                      data-index={currentMemberIndex}
                      data-on-Save={(
                        avatarUrl: string,
                        seed: string,
                        skinColor: string,
                        eyebrows: string,
                        eyes: string,
                        hair: string,
                        hairColor: string,
                        hairProbability: number,
                        mouth: string,
                        background: string,
                        feature: string,
                        featuresProbability: number
                      ) =>
                        handleAvatarSave(
                          avatarUrl,
                          currentMemberIndex,
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
                          featuresProbability
                        )
                      }
                    >
                      {/* <Label htmlFor="seed-select">Select a seed:</Label>
                      <Select
                        id="seed-select"
                        value={members[currentMemberIndex].seed}
                        onChange={(event) =>
                          handleSeedChange(currentMemberIndex, event)
                        }
                      >
                        <option value="Precious">Precious</option>
                        <option value="Cookie">Cookie</option>
                        <option value="Sassy">Sassy</option>
                      </Select> */}
                      <FlexWrap>
                        <Label htmlFor="skinColor-select">膚色:</Label>
                        <CirclePicker
                          width="600px"
                          color={members[currentMemberIndex].skinColor}
                          colors={[
                            '#fff1e6',
                            '#ffd9b3',
                            '#ffc299',
                            '#ffad80',
                            '#ff9966',
                            '#e68a00',
                            '#cc7a00',
                            '#b36b00',
                            '#994d00',
                            '#803300',
                          ]}
                          circleSize={32}
                          onChangeComplete={(color) =>
                            handleSkinColorChange(currentMemberIndex, color.hex)
                          }
                        />
                      </FlexWrap>
                      <RowWrapper>
                        <br />
                        <FlexWrap>
                          <Label htmlFor="eyebrows-select">眉毛:</Label>
                          <Select
                            id="eyebrows-select"
                            value={members[currentMemberIndex].eyebrows}
                            onChange={(event) =>
                              handleEyebrowsChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">濃眉</option>
                            <option value="variant02">兇眉</option>
                            <option value="variant03">細眉</option>
                            <option value="variant04">一字眉</option>
                            <option value="variant05">短眉</option>
                            <option value="variant07">八字眉</option>
                            <option value="variant08">挑眉</option>
                          </Select>
                        </FlexWrap>

                        <br />
                        <FlexWrap>
                          <Label htmlFor="eyes-select">眼睛:</Label>
                          <Select
                            id="eyes-select"
                            value={members[currentMemberIndex].eyes}
                            onChange={(event) =>
                              handleEyesChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">看右邊</option>
                            <option value="variant02">看左邊</option>
                            <option value="variant03">中間</option>
                            <option value="variant04">睡眼</option>
                            <option value="variant05">鬥雞眼</option>
                            <option value="variant18">白眼</option>
                            <option value="variant19">笑眼</option>
                            <option value="variant22">眨眼</option>
                            <option value="variant23">水汪汪</option>
                          </Select>
                        </FlexWrap>

                        <FlexWrap>
                          <Label htmlFor="hair-select">髮型:</Label>

                          <Select
                            id="hair-select"
                            value={members[currentMemberIndex].hair}
                            onChange={(event) =>
                              handleHairChange(currentMemberIndex, event)
                            }
                          >
                            <option value="long03">中短髮</option>
                            <option value="long06">大波浪</option>
                            <option value="long08">花圈</option>
                            <option value="long07">中長髮</option>
                            <option value="long10">包頭</option>
                            <option value="long13">雙包頭</option>
                            <option value="long15">雙馬尾</option>
                            <option value="long16">辮子</option>
                            <option value="long19">馬尾</option>
                            <option value="short01">瀏海</option>
                            <option value="short04">平頭</option>
                            <option value="short08">陽光</option>
                            <option value="short07">韓系</option>
                            <option value="short09">韓系2</option>
                            <option value="short12">呆頭</option>
                            <option value="short15">8+9</option>
                            <option value="short16">刺蝟</option>
                            <option value="short19">當兵</option>
                            {/* <option value="none">光頭</option> */}
                          </Select>
                        </FlexWrap>
                      </RowWrapper>

                      <FlexWrap>
                        <Label htmlFor="hair-color-select">髮色:</Label>
                        <CirclePicker
                          width="600px"
                          color={members[currentMemberIndex].hairColor}
                          colors={[
                            '#000000', // black
                            '#331a00', // dark brown
                            '#4d2600', // medium brown
                            '#663300', // chestnut brown
                            '#804d00', // auburn
                            '#b37300', // blonde
                            '#cc9900', // golden blonde
                            '#e6b800', // honey blonde
                            '#ffd966', // light blonde
                            '#ffffff', // white/gray
                          ]}
                          circleSize={32}
                          onChangeComplete={(color) =>
                            handleHairColorChange(currentMemberIndex, color.hex)
                          }
                        />
                        {/* 
                        <Select
                          id="hair-color-select"
                          value={members[currentMemberIndex].hairColor}
                          onChange={(event) =>
                            handleHairColorChange(currentMemberIndex, event)
                          }
                        >
                          <option value="0e0e0e">Black</option>
                          <option value="562306">Brown</option>
                          <option value="e6c770">Blonde</option>
                          <option value="6a4e35">Red</option>
                          <option value="796a45">Gray</option>
                          <option value="914b2d">Auburn</option>
                          <option value="733d1f">Chestnut</option>
                          <option value="f5d23d">Blonde Highlights</option>
                          <option value="221b15">Dark Brown</option>
                          <option value="b38a58">Light Brown</option>
                        </Select> */}
                      </FlexWrap>
                      <RowWrapper>
                        <br />
                        <FlexWrap>
                          <Label htmlFor="feature-select">特徵:</Label>
                          <Select
                            id="feature-select"
                            value={members[currentMemberIndex].feature}
                            onChange={(event) =>
                              handleFeatureChange(currentMemberIndex, event)
                            }
                          >
                            <option value="blush">臉紅😳</option>
                            <option value="freckles">雀斑</option>

                            <option value="none">無</option>
                          </Select>
                        </FlexWrap>
                        <br />
                        <FlexWrap>
                          <Label htmlFor="mouth-select">嘴巴:</Label>
                          <Select
                            id="mouth-select"
                            value={members[currentMemberIndex].mouth}
                            onChange={(event) =>
                              handleMouthChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">笑</option>
                            <option value="variant02">微笑</option>
                            <option value="variant03">喔</option>
                            <option value="variant10">閉嘴</option>
                            <option value="variant16">吐舌</option>
                            <option value="variant17">嘟嘴</option>
                            <option value="variant22">顆顆</option>
                            <option value="variant24">愛心</option>
                            <option value="variant26">大笑</option>
                            <option value="variant28">露齒笑</option>
                          </Select>
                        </FlexWrap>
                        <br />
                        <FlexWrap>
                          <Label htmlFor="background-color-select">
                            背景顏色:
                          </Label>

                          <Select
                            id="background-color-select"
                            value={members[currentMemberIndex].background}
                            onChange={(event) =>
                              handleBackgroundChange(currentMemberIndex, event)
                            }
                          >
                            <option value="transparent">Transparent</option>
                            <option value="f5f5f5">Light Gray</option>
                            <option value="b6e3f4">Blue</option>
                            <option value="d1d4f9">Purple</option>
                            <option value="ffd5dc">Pink</option>
                            <option value="ffffff">White</option>
                            <option value="607D8B">Grayish-blue</option>
                          </Select>
                        </FlexWrap>
                      </RowWrapper>
                    </ColumnWrap>
                  </FormField>
                  <AvatarImage
                    src={
                      members[currentMemberIndex]?.avatar
                        ? getAvatarUrl(members[currentMemberIndex])
                        : avatarUrl
                    }
                    alt="avatar"
                  />

                  <SaveButton
                    onClick={() =>
                      handleAvatarSave(
                        avatarUrl,
                        currentMemberIndex,
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
                        featuresProbability
                      )
                    }
                  >
                    Save Avatar
                  </SaveButton>
                </AvatarContainer>
              )}
            </FormCard>
          </FormContainer>
        </>
      )}
    </Container>
  );
};

export default FamilyMemberForm;

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
  text-align: left;
  align-items: center;
  display: flex;
  justify-content: space-evenly;
`;

const FlexWrap = styled.div`
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  margin: 15px;
`;

const AvatarWrap = styled.div`
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: center;
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
  color: '#414141';
`;

type FormInputProps = {
  colors?: string;
};

const FormInput = styled.input<FormInputProps>`
  display: block;
  width: 200px;
  padding: 0.5rem;
  border: 5px solid #3467a1;
  border-radius: 25px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  flex-basis: 70%;
  &:focus {
    outline: none;

    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
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
  max-width: 200px;
  max-height: 200px;
`;

const Button = styled(ThreeDButton)`
  background-color: #5981b0;
  color: #f6f8f8;
  border: 2px solid #f6f8f8;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 60px;
  margin: 10px;
  font-size: 16px;
  &:hover {
    transform: scale(1.1);
    color: #5981b0;
  }
`;
const SaveButton = styled(Button)`
  background-color: #5981b0;
  color: #f6f8f8;
  border: 2px solid #f6f8f8;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;

  font-size: 16px;
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
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
  //border: gold solid 3px;
  padding: 20px;
  justify-content: center;
  // background: linear-gradient(
  //   -45deg,
  //   white,
  //   #fff5c9,
  //   #9bb9de,
  //   #629dda,
  //   #ff9f4d,
  //   #142850
  // );
  /* display: flex;

  flex-direction: row;
  
  //animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 300% 300%; */
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: space-between;
  flex-wrap: wrap;
  min-width: 100%;
  text-align: center;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  min-width: 100%;
  text-align: center;
  justify-content: start; /* Center horizontally */
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
  justify-content: center;
  margin-top: 50px;
  z-index: 3;
`;

const SettingDoneBtn = styled.button``;

const Title = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-top: 50px;
  text-align: center;
  color: #5981b0;
  font-family: 'Braah One';
`;

const Card = styled.div`
  width: 200px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
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

const FormCard = styled(Card)`
  height: 100%;
  min-height: 60vh;
  width: auto;
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
  height: auto;
  transition: all 0.2s ease-in-out;
`;

const FormDropdown = styled.select`
  font-size: 20px;
  padding: 8px;
  border-radius: 25px;
  border: 1px solid #3467a1;
  background-color: transparent;
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
  color: #414141;
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
  font-size: 16px;
  padding: 5px;
  color: #414141;
`;

const Split = styled.p`
  font-size: 16px;
  padding: 5px;
  color: #414141;
`;

const Popup = styled.div`
  background-color: #629dda;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  height: 30px;
  width: 300px;
`;

const ConfettiButton = styled(Button)`
  position: fixed;
  width: 150px;
  left: 195%;
  bottom: 3%;
  z-index: 5;
  transform: translateX(-50%);
  &:hover {
    transform: scale(1.1) translateX(-50%);
  }
`;

const Background = styled.div`
  background-color: #142850;
  height: 100px;
  padding: 10px;
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
  width: 80%;
  box-shadow: 0 15px 25px rgba(129, 124, 124, 0.2);
  height: 90%;
  border-radius: 5px;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.2);
  padding: 20px;
  text-align: center;
  transform: scale(1.1);
  img {
    height: 60%;
  }
`;

const HiddenText = styled.p`
  font-size: 24px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`;
