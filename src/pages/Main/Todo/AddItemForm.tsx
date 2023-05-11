import React, { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import DefaultButton from '../../../Components/Button/Button';
import { AuthContext } from '../../../config/Context/authContext';
import { MembersSelector } from '../AI/SmartInput';
type FamilyMember = {
  name: string;
  role: string;
  avatarSrc: string;
};

type Item = {
  title: string;
  due: string | null;
  member: FamilyMember;
};

type AddItemFormProps = {
  groupIndex: number;
  onAddItem: (groupIndex: number, item: Item) => void;
};

function AddItemForm({ groupIndex, onAddItem, onCancel }: any) {
  const [title, setTitle] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showMembersSelector, setShowMembersSelector] = useState(false);
  const [dueDateNeeded, setDueDateNeeded] = useState(false);
  const { membersArray } = useContext(AuthContext);
  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleDateChange(date: Date) {
    setDueDate(date);
  }

  function handleMemberChange(member: string | string[]) {
    const getMemberAvatar = (memberName: string | string[]) => {
      const member = membersArray.find((m: any) => m.role === memberName);
      return member ? member.avatar : null;
    };
    const memberAvatar = getMemberAvatar(member);
    setSelectedMember(memberAvatar);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedMember !== null) {
      const due = dueDateNeeded ? dueDate.toLocaleDateString() : null;
      const member = selectedMember;
      onAddItem(groupIndex, { title, due, member });
      setTitle('');
      setDueDate(new Date());
      setSelectedMember(null);
      setDueDateNeeded(false);
    }
  }

  function handleDueDateNeededChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const isChecked = event.target.checked;
    setDueDateNeeded(isChecked);
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Label>
          Title:
          <TitleInput type="text" value={title} onChange={handleTitleChange} />
        </Label>

        <Label>
          <input
            type="checkbox"
            checked={dueDateNeeded}
            onChange={handleDueDateNeededChange}
          />
          Due date needed
        </Label>

        {dueDateNeeded && (
          <DueDateLabel>
            Due Date:
            <DatePicker selected={dueDate} onChange={handleDateChange} />
          </DueDateLabel>
        )}

        <MembersSelectorWrap>
          <MembersSelector
            onSelectMember={(selectedMember) => {
              setShowMembersSelector(false);
              handleMemberChange(selectedMember);
            }}
          />
        </MembersSelectorWrap>

        <Button type="submit">Add Todo</Button>
      </Form>
    </>
  );
}

const Button = styled(DefaultButton)`
  display: flex;
  margin: 20px;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: start;
  margin-top: 1rem;
  padding: 10px;
  justify-content: space-between;
  label {
    margin-top: 0.5rem;
  }
  input[type='text'],
  input[type='checkbox'] {
    margin-left: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
  }
  input[type='checkbox'] {
    margin-left: 0;
  }

  input[type='submit'] {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    border: none;
    background-color: dodgerblue;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  input[type='submit']:hover {
    background-color: #4a90e2;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
`;

const DueDateLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 20px;
`;

const MembersSelectorWrap = styled.div`
  position: relative;
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

export default AddItemForm;
