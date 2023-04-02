import React, { useState } from 'react';
import styled from 'styled-components';

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
      Array(numberOfMembers).fill({
        name: '',
        avatar: '',
        birthday: '',
        role: '',
        anniversary: '',
      })
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
    newMembers[index].anniversary = event.target.value;
    setMembers(newMembers);
  };

  return (
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
            <FormInput
              type="date"
              value={member.anniversary}
              onChange={(event) => handleMemberAnniversaryChange(index, event)}
            />
          </FormField>
        </div>
      ))}

      <FormButton type="submit">Submit</FormButton>
    </Form>
  );
};

export default FamilyMemberForm;
