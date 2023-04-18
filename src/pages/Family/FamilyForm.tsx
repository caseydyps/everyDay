import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import Sidebar from '../../Components/Nav/Navbar';
// import AvatarCreator from './Avatar';
// import { handleLoadAvatar } from './Avatar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
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
      const matchingDocRef = matchingDocs.docs[0].ref;
      console.log(matchingDocs);
      await updateDoc(matchingDocRef, { isSettingDone: true });

      // Delete all existing user documents
      const querySnapshot = await getDocs(usersRef);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Save each member as a separate document in the users collection
      members.forEach(async (member) => {
        await setDoc(doc(usersRef, member.name), member);
      });

      console.log('Members have been saved to Firestore!');
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
        (data) => data.familyId === familyId
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

  const handleNumberOfMembersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numberOfMembers = parseInt(event.target.value);
    setNumberOfMembers(numberOfMembers);
    setMembers(
      Array(numberOfMembers)
        .fill(undefined)
        .map(
          (): FamilyMember => ({
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
          })
        )
    );
  };
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
    setMembers((prevMembers) => [
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
    if (numberOfMembers > 0) {
      const newNumberOfMembers = numberOfMembers - 1;
      setNumberOfMembers(newNumberOfMembers);
      setMembers((prevMembers) => prevMembers.slice(0, newNumberOfMembers));
    }
  };

  const [seed, setSeed] = useState<string>('Sassy');
  const [eyebrows, setEyebrows] = useState<string>('variant01');
  const [eyes, setEyes] = useState<string>('variant01');
  const [hair, setHair] = useState<string>('short01');
  const [hairProbability, setHairProbability] = useState<number>(100);
  const [hairColor, setHairColor] = useState<string>('0e0e0e');
  const [mouth, setMouth] = useState<string>('variant01');
  const [background, setBackground] = useState<string>('f5f5f5');
  const [feature, setFeature] = useState<string>('blush');
  const [featuresProbability, setFeaturesProbability] = useState<number>(100);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`
  );

  function getAvatarUrl(member: any): string {
    return `https://api.dicebear.com/6.x/adventurer/svg?seed=${member.seed}&eyebrows=${member.eyebrows}&eyes=${member.eyes}&hair=${member.hair}&hairProbability=${member.hairProbability}&hairColor=${member.hairColor}&mouth=${member.mouth}&backgroundColor=${member.background}&features=${member.feature}&featuresProbability=${member.featuresProbability}`;
  }

  useEffect(() => {
    const member = {
      seed,
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
    const baseUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${seed}&eyebrows=${eyebrows}&eyes=${eyes}&hair=${hair}&hairProbability=${hairProbability}&hairColor=${hairColor}&mouth=${mouth}&backgroundColor=${background}&features=${feature}&featuresProbability=${featuresProbability}`;

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

  const handleHairColorChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newMembers = [...members];
    newMembers[index].hairColor = event.target.value;
    setHairColor(event.target.value);
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
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index
          ? {
              ...member,
              avatar: avatarUrl,
              seed: seed,
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

  interface AddMinusInputProps {
    value: number | string;
    onIncrement: () => void;
    onDecrement: () => void;
    children: React.ReactNode;
  }

  function AddMinusInput(props: AddMinusInputProps) {
    const { value, onIncrement, onDecrement, children } = props;

    return (
      <FormField>
        <FormLabel>{children}</FormLabel>
        <Button onClick={onDecrement}>-</Button>
        <Input
          type="number"
          min={numberOfMembers}
          value={value}
          onChange={() => {}}
        />
        <Button onClick={onIncrement}>+</Button>
      </FormField>
    );
  }

  console.log('hasSetup', hasSetup, 'formSubmitted', formSubmitted);

  return (
    <Container>
      {hasSetup ? (
        <Wrap>
          <Title>家庭成員</Title>
          <ColumnWrap>
            <RowWrap>
              {members.map((member, index) => (
                <Card key={index}>
                  <p>姓名: {member.name}</p>
                  <p>生日: {member.birthday}</p>
                  <p>Role: {member.role}</p>
                  <p>
                    紀念日:{' '}
                    {member.anniversaries.map(
                      (anniversary, anniversaryIndex) => (
                        <span key={anniversaryIndex}>
                          {anniversary.date} - {anniversary.description}{' '}
                        </span>
                      )
                    )}
                  </p>
                  <img src={member.avatar} alt="avatar"></img>
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
        </Wrap>
      ) : (
        <FormContainer>
          <Form onSubmit={handleFormSubmit}>
            <AddMinusInput
              value={numberOfMembers}
              onIncrement={handleNumberOfMembersIncrement}
              onDecrement={handleNumberOfMembersDecrement}
            >
              您有幾位家庭成員?
            </AddMinusInput>
            {numberOfMembers > 0 && (
              <RowWrap>
                <RowWrap>
                  <FormDropdown
                    value={currentMemberIndex}
                    onChange={(event) =>
                      setCurrentMemberIndex(parseInt(event.target.value))
                    }
                  >
                    {members.map((member, index) => (
                      <option key={index} value={index}>
                        {`Family Member ${index + 1}`}
                      </option>
                    ))}
                  </FormDropdown>
                  {members[currentMemberIndex] && (
                    <div>
                      <FormField>
                        <FormLabel>
                          Name of Family Member {currentMemberIndex + 1}
                        </FormLabel>
                        <FormInput
                          type="text"
                          value={members[currentMemberIndex].name}
                          onChange={(event) =>
                            handleMemberNameChange(currentMemberIndex, event)
                          }
                        />
                      </FormField>

                      <FormField>
                        <FormLabel>
                          Email of Family Member {currentMemberIndex + 1}
                        </FormLabel>
                        <FormInput
                          type="text"
                          value={members[currentMemberIndex].email}
                          onChange={(event) =>
                            handleMemberEmailChange(currentMemberIndex, event)
                          }
                        />
                      </FormField>

                      <FormField>
                        <FormLabel>
                          Birthday of Family Member {currentMemberIndex + 1}
                        </FormLabel>
                        <FormInput
                          type="date"
                          value={members[currentMemberIndex].birthday}
                          onChange={(event) =>
                            handleMemberBirthdayChange(
                              currentMemberIndex,
                              event
                            )
                          }
                        />
                      </FormField>

                      <FormField>
                        <FormLabel>
                          Role of Family Member {currentMemberIndex + 1}
                        </FormLabel>
                        <FormInput
                          type="text"
                          value={members[currentMemberIndex].role}
                          onChange={(event) =>
                            handleMemberRoleChange(currentMemberIndex, event)
                          }
                        />
                      </FormField>

                      <FormField>
                        <FormLabel>
                          Anniversary of Family Member {currentMemberIndex + 1}
                        </FormLabel>
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
                      </FormField>

                      <FormField>
                        <FormLabel>
                          Avatar of Family Member {currentMemberIndex + 1}
                        </FormLabel>

                        <RowWrap
                          key={currentMemberIndex}
                          data-index={currentMemberIndex}
                          data-on-Save={(
                            avatarUrl: string,
                            seed: string,
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
                          <Label htmlFor="seed-select">Select a seed:</Label>
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
                          </Select>
                          <br />
                          <Label htmlFor="eyebrows-select">
                            Select eyebrows:
                          </Label>
                          <Select
                            id="eyebrows-select"
                            value={members[currentMemberIndex].eyebrows}
                            onChange={(event) =>
                              handleEyebrowsChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">Thick</option>
                            <option value="variant02">Variant 2</option>
                            <option value="variant03">Variant 3</option>
                            <option value="variant04">Variant 4</option>
                            <option value="variant05">Variant 5</option>
                          </Select>
                          <br />
                          <Label htmlFor="eyes-select">Select eyes:</Label>
                          <Select
                            id="eyes-select"
                            value={members[currentMemberIndex].eyes}
                            onChange={(event) =>
                              handleEyesChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">Variant 1</option>
                            <option value="variant02">Variant 2</option>
                            <option value="variant03">Variant 3</option>
                          </Select>
                          <br />
                          <Label htmlFor="hair-select">
                            Select hair style:
                          </Label>
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
                            <option value="long15">雙馬尾</option>
                            <option value="long16">馬尾</option>
                            <option value="short01">瀏海</option>
                            <option value="short04">平頭</option>
                            <option value="short07">韓系</option>
                            <option value="short09">韓系2</option>
                            <option value="short12">呆頭</option>
                            <option value="short15">8+9</option>
                            <option value="short16">刺蝟</option>
                            <option value="short19">當兵</option>
                            <option value="none">光頭</option>
                          </Select>

                          <Label htmlFor="hair-color-select">
                            Select hair color:
                          </Label>
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
                          </Select>
                          <br />
                          <Label htmlFor="feature-select">
                            Select feature:
                          </Label>
                          <Select
                            id="feature-select"
                            value={members[currentMemberIndex].feature}
                            onChange={(event) =>
                              handleFeatureChange(currentMemberIndex, event)
                            }
                          >
                            <option value="blush">blush</option>
                            <option value="freckles">freckles</option>
                            <option value="none">none</option>
                          </Select>

                          <Label htmlFor="mouth-select">Select mouth:</Label>
                          <Select
                            id="mouth-select"
                            value={members[currentMemberIndex].mouth}
                            onChange={(event) =>
                              handleMouthChange(currentMemberIndex, event)
                            }
                          >
                            <option value="variant01">Variant 1</option>
                            <option value="variant02">Variant 2</option>
                            <option value="variant03">Variant 3</option>
                          </Select>
                          <Label htmlFor="background-color-select">
                            Select background color:
                          </Label>
                          <Select
                            id="background-color-select"
                            value={members[currentMemberIndex].background}
                            onChange={(event) =>
                              handleBackgroundChange(currentMemberIndex, event)
                            }
                          >
                            <option value="f5f5f5">Light Gray</option>
                            <option value="b6e3f4">Blue</option>
                            <option value="d1d4f9">Purple</option>
                            <option value="transparent">Transparent</option>
                          </Select>
                        </RowWrap>

                        <Button
                          onClick={() =>
                            handleAvatarSave(
                              avatarUrl,
                              currentMemberIndex,
                              seed,
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
                        </Button>
                      </FormField>
                    </div>
                  )}
                </RowWrap>
                <ColumnWrap>
                  {numberOfMembers > 0 && (
                    <AvatarContainer>
                      <img src={avatarUrl} alt="avatar"></img>
                    </AvatarContainer>
                  )}

                  <FormButton type="submit">Save</FormButton>
                </ColumnWrap>
              </RowWrap>
            )}
          </Form>
        </FormContainer>
      )}
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
  max-width: 1200px;
  margin: 0 auto;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
  margin: 0 auto;
  text-align: center;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const FormInput = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 5px solid #3467a1;
  border-radius: 25px;
  font-size: 32px;
  line-height: 1.5;
  font-weight: bold;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

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
  margin-top: 1rem;
  margin-bottom: 1rem;

  > img {
    width: 500px;
    height: 500px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
`;

const Button = styled.button`
  background-color: #fff5c9;
  color: #3467a1;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 30px;
  font-size: 40px;
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
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  );
  display: flex;
  border-top: 4px solid white;
  flex-direction: column;
  justify-content: center;
  animation: ${GradientAnimation} 20s ease-in-out infinite;
  background-size: 200% 500%;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SettingDoneBtn = styled.button``;

const Title = styled.div`
  font-size: 72px;
  font-weight: bold;
  margin: 0 auto;
  text-align: center;
  color: white;
`;

const Card = styled.div`
  width: calc(33.33% - 10px);
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  font-size: 36px;
  background-color: #transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

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

const Wrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
`;

const FormDropdown = styled.select`
  font-size: 32px;
  padding: 8px;
  border-radius: 25px;
  border: 1px solid #3467a1;
  background-color: #transparent;
  margin-top: 20px;
  &:focus {
    outline: none;
    border: 2px solid blue;
  }
`;

const Label = styled.label`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Select = styled.select`
  font-size: 32px;
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 25px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  width: 200px;
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
