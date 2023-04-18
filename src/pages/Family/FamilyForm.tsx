import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
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

const FamilyMemberForm = () => {
  const [numberOfMembers, setNumberOfMembers] = useState<number>(0);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(members);

    const usersRef = collection(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'users');

    try {
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
    } catch (error) {
      console.error('Error saving members to Firestore: ', error);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const familyDocRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'users'
      );
      const membersData: any = await getDocs(familyDocRef).then(
        (querySnapshot) => querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      );
      console.log(membersData);
      setMembers(membersData);

      if (membersData.length > 0) {
        setFormSubmitted(true);
      }
    };
    fetchMembers();
  }, []);

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
    localStorage.setItem('members', JSON.stringify(newMembers));
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
        <button onClick={onDecrement}>-</button>
        <input
          type="number"
          min={numberOfMembers}
          value={value}
          onChange={() => {}}
        />
        <button onClick={onIncrement}>+</button>
      </FormField>
    );
  }

  return (
   
   
   <Container>
      {formSubmitted ? (
        <div>
          <p>家庭成員:</p>
          <ColumnWrap>
            {members.map((member, index) => (
              <div key={index}>
                <p>Name: {member.name}</p>
                <p>Birthday: {member.birthday}</p>
                <p>Role: {member.role}</p>
                <p>
                  Anniversaries:{' '}
                  {member.anniversaries.map((anniversary, anniversaryIndex) => (
                    <span key={anniversaryIndex}>
                      {anniversary.date} - {anniversary.description}{' '}
                    </span>
                  ))}
                </p>
                <img src={member.avatar} alt="avatar"></img>
              </div>
            ))}
          </ColumnWrap>

          <button
            onClick={() => {
              setFormSubmitted(false);
              setNumberOfMembers(members.length);
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <Form onSubmit={handleFormSubmit}>
          <AddMinusInput
            value={numberOfMembers}
            onIncrement={handleNumberOfMembersIncrement}
            onDecrement={handleNumberOfMembersDecrement}
          >
            How many family members do you have?
          </AddMinusInput>

          <RowWrap>
            {members.map((member, index) => {
              console.log(member);
              console.log(member.hairProbability);
              return (
                <div key={index}>
                  <FormField>
                    <FormLabel>Name of Family Member {index + 1}</FormLabel>
                    <FormInput
                      type="text"
                      value={member.name}
                      onChange={(event) => handleMemberNameChange(index, event)}
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>Birthday of Family Member {index + 1}</FormLabel>
                    <FormInput
                      type="date"
                      value={member.birthday}
                      onChange={(event) =>
                        handleMemberBirthdayChange(index, event)
                      }
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>Role of Family Member {index + 1}</FormLabel>
                    <FormInput
                      type="text"
                      value={member.role}
                      onChange={(event) => handleMemberRoleChange(index, event)}
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>
                      Anniversary of Family Member {index + 1}
                    </FormLabel>
                    {member.anniversaries.map(
                      (anniversary, anniversaryIndex) => (
                        <div key={anniversaryIndex}>
                          <FormInput
                            type="date"
                            value={anniversary.date}
                            onChange={(event) =>
                              handleMemberAnniversaryDateChange(
                                index,
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
                                index,
                                anniversaryIndex,
                                event
                              )
                            }
                          />
                        </div>
                      )
                    )}
                    <button onClick={() => handleAddAnniversary(index)}>
                      Add Anniversary
                    </button>
                  </FormField>

                  <FormField>
                    <FormLabel>Avatar of Family Member {index + 1}</FormLabel>
                    {/* <AvatarCreator
                    index={index}
                    onSave={(
                      avatarUrl,
                      seed,
                      eyebrows,
                      eyes,
                      hair,
                      hairColor,
                      mouth,
                      background,
                      feature,
                      featuresProbability
                    ) =>
                      handleAvatarSave(
                        avatarUrl,
                        index,
                        seed,
                        eyebrows,
                        eyes,
                        hair,
                        hairColor,
                        mouth,
                        background,
                        feature,
                        featuresProbability
                      )
                    }
                  /> */}

                    <div
                      key={index}
                      data-index={index}
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
                          index,
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
                      <label htmlFor="seed-select">Select a seed:</label>
                      <select
                        id="seed-select"
                        value={member.seed}
                        onChange={(event) => handleSeedChange(index, event)}
                      >
                        <option value="Precious">Precious</option>
                        <option value="Cookie">Cookie</option>
                        <option value="Sassy">Sassy</option>
                      </select>
                      <br />
                      <label htmlFor="eyebrows-select">Select eyebrows:</label>
                      <select
                        id="eyebrows-select"
                        value={member.eyebrows}
                        onChange={(event) => handleEyebrowsChange(index, event)}
                      >
                        <option value="variant01">Thick</option>
                        <option value="variant02">Variant 2</option>
                        <option value="variant03">Variant 3</option>
                        <option value="variant04">Variant 4</option>
                        <option value="variant05">Variant 5</option>
                      </select>
                      <br />
                      <label htmlFor="eyes-select">Select eyes:</label>
                      <select
                        id="eyes-select"
                        value={member.eyes}
                        onChange={(event) => handleEyesChange(index, event)}
                      >
                        <option value="variant01">Variant 1</option>
                        <option value="variant02">Variant 2</option>
                        <option value="variant03">Variant 3</option>
                      </select>
                      <br />
                      <label htmlFor="hair-select">Select hair style:</label>
                      <select
                        id="hair-select"
                        value={member.hair}
                        onChange={(event) => handleHairChange(index, event)}
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
                      </select>

                      <label htmlFor="hair-color-select">
                        Select hair color:
                      </label>
                      <select
                        id="hair-color-select"
                        value={member.hairColor}
                        onChange={(event) =>
                          handleHairColorChange(index, event)
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
                      </select>
                      <br />
                      <label htmlFor="feature-select">Select feature:</label>
                      <select
                        id="feature-select"
                        value={member.feature}
                        onChange={(event) => handleFeatureChange(index, event)}
                      >
                        <option value="blush">blush</option>
                        <option value="freckles">freckles</option>
                        <option value="none">none</option>
                      </select>

                      <label htmlFor="mouth-select">Select mouth:</label>
                      <select
                        id="mouth-select"
                        value={member.mouth}
                        onChange={(event) => handleMouthChange(index, event)}
                      >
                        <option value="variant01">Variant 1</option>
                        <option value="variant02">Variant 2</option>
                        <option value="variant03">Variant 3</option>
                      </select>
                      <label htmlFor="background-color-select">
                        Select background color:
                      </label>
                      <select
                        id="background-color-select"
                        value={member.background}
                        onChange={(event) =>
                          handleBackgroundChange(index, event)
                        }
                      >
                        <option value="f5f5f5">Light Gray</option>
                        <option value="b6e3f4">Blue</option>
                        <option value="d1d4f9">Purple</option>
                        <option value="transparent">Transparent</option>
                      </select>
                    </div>

                    <Button
                      onClick={() =>
                        handleAvatarSave(
                          avatarUrl,
                          index,
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
              );
            })}
          </RowWrap>
          <AvatarContainer>
            <img src={avatarUrl} alt="avatar"></img>
          </AvatarContainer>
          <FormButton type="submit">Submit</FormButton>
        </Form>
      )}
    </Container>
  );
};

export default FamilyMemberForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
`;

const AvatarContainer = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #0077cc;
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
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
  font-size: 16px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;
