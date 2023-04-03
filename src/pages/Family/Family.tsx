import React, { useState } from 'react';
import styled from 'styled-components/macro';
import AvatarCreator from './Avatar';

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
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
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

const FamilyMemberForm = () => {
  const [numberOfMembers, setNumberOfMembers] = useState(0);
  const [members, setMembers] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(members);
  };

  const handleNumberOfMembersChange = (event) => {
    const numberOfMembers = parseInt(event.target.value);
    setNumberOfMembers(numberOfMembers);
    setMembers(
      Array(numberOfMembers)
        .fill()
        .map(() => ({
          name: '',
          avatar: '',
          birthday: '',
          role: '',
          anniversaries: [],
        }))
    );
  };
  const handleMemberNameChange = (index, event) => {
    const newMembers = [...members];
    newMembers[index].name = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberAvatarChange = (index, event) => {
    const newMembers = [...members];
    newMembers[index].avatar = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberBirthdayChange = (index, event) => {
    const newMembers = [...members];
    newMembers[index].birthday = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberRoleChange = (index, event) => {
    const newMembers = [...members];
    newMembers[index].role = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberAnniversaryChange = (index, event) => {
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
    index,
    anniversaryIndex,
    event
  ) => {
    const newMembers = [...members];
    newMembers[index].anniversaries[anniversaryIndex].date = event.target.value;
    setMembers(newMembers);
  };

  const handleMemberAnniversaryDescriptionChange = (
    index,
    anniversaryIndex,
    event
  ) => {
    const newMembers = [...members];
    newMembers[index].anniversaries[anniversaryIndex].description =
      event.target.value;
    setMembers(newMembers);
  };

  const handleAddAnniversary = (index) => {
    const newMembers = [...members];
    newMembers[index].anniversaries.push({ date: '', description: '' });
    setMembers(newMembers);
  };

  const options = {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': '7a8bf5ee76mshcabf5fb42b03522p193735jsn4bb169ac5097',
      'X-RapidAPI-Host': 'doppelme-avatars.p.rapidapi.com',
    },
  };

  // fetch('https://doppelme-avatars.p.rapidapi.com/avatar/1101', options)
  //   .then((response) => response.json())
  //   .then((response) => console.log(response))
  //   .catch((err) => console.error(err));

  // const avatarUrl =
  //   'https://www.doppelme.com/transparent/DM1861290DMYZJR/avatar.png';
  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <FormField>
          <FormLabel>How many family members do you have?</FormLabel>
          <FormInput
            type="number"
            min="0"
            value={numberOfMembers}
            onChange={handleNumberOfMembersChange}
          />
        </FormField>

        {members.map((member, index) => (
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
              <FormLabel>Avatar of Family Member {index + 1}</FormLabel>
              <FormInput
                type="text"
                value={member.avatar}
                onChange={(event) => handleMemberAvatarChange(index, event)}
              />
            </FormField>

            <FormField>
              <FormLabel>Birthday of Family Member {index + 1}</FormLabel>
              <FormInput
                type="date"
                value={member.birthday}
                onChange={(event) => handleMemberBirthdayChange(index, event)}
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
              <FormLabel>Anniversary of Family Member {index + 1}</FormLabel>
              {member.anniversaries.map((anniversary, anniversaryIndex) => (
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
              ))}
              <button onClick={() => handleAddAnniversary(index)}>
                Add Anniversary
              </button>
            </FormField>
          </div>
        ))}

        <FormButton type="submit">Submit</FormButton>
      </Form>
      <AvatarCreator />
      <AvatarCreator />
      <AvatarCreator />
      <h1>My Avatar</h1>
      {/* <img src={avatarUrl} alt="Avatar" /> */}
    </>
  );
};

export default FamilyMemberForm;
