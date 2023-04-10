import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Sidebar from '../../Components/SideBar/SideBar';
import AvatarCreator from './Avatar';

interface FamilyMember {
  name: string;
  avatar: string;
  birthday: string;
  role: string;
  anniversaries: { date: string; description: string }[];
}

const FamilyMemberForm = () => {
  const [numberOfMembers, setNumberOfMembers] = useState<number>(0);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleAvatarSave = (avatarUrl: string, index: number) => {
    console.log('Avatar URL:', avatarUrl);
    setMembers((prevMembers) =>
      prevMembers.map((member, i) =>
        i === index ? { ...member, avatar: avatarUrl } : member
      )
    );
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(members);
    setFormSubmitted(true);
  };

  const handleNumberOfMembersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numberOfMembers = parseInt(event.target.value);
    setNumberOfMembers(numberOfMembers);
    setMembers(
      Array(numberOfMembers)
        .fill(undefined)
        .map(() => ({
          name: '',
          avatar: '',
          birthday: '',
          role: '',
          anniversaries: [],
        }))
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
    value: number;
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

  function FormInput(props: FormInputProps) {
    const { type, min, value, onChange } = props;

    return <input type={type} min={min} value={value} onChange={onChange} />;
  }

  interface FormFieldProps {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    children: React.ReactNode;
  }
  function FormField(props: FormFieldProps) {
    const { label, value, onIncrement, onDecrement, children } = props;

    return (
      <div>
        <label>
          {label}
          <button onClick={onDecrement}>-</button>
          <FormInput type="number" min={0} value={value} onChange={() => {}} />
          <button onClick={onIncrement}>+</button>
          {children}
        </label>
      </div>
    );
  }

  return (
    <Container>
      <Sidebar />
      <Form onSubmit={handleFormSubmit}>
        <FormField
          label="How many family members do you have?"
          value={numberOfMembers}
          onIncrement={handleNumberOfMembersIncrement}
          onDecrement={handleNumberOfMembersDecrement}
        ></FormField>

        <RowWrap>
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

              <FormField>
                <FormLabel>Avatar of Family Member {index + 1}</FormLabel>
                <AvatarCreator
                  index={index}
                  onSave={(avatarUrl) => handleAvatarSave(avatarUrl, index)}
                />
              </FormField>
            </div>
          ))}
        </RowWrap>

        <FormButton type="submit">Submit</FormButton>
      </Form>
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
