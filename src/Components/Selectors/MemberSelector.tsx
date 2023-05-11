import React, { useContext, useState } from 'react';
import { AuthContext } from '../../config/Context/authContext';
import DefaultButton from '../Button/Button';
import styled from 'styled-components/macro';

export const MembersSelector = ({ onSelectMember }: MembersSelectorProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const { memberRolesArray } = useContext(AuthContext);
  const onMemberSelect = (member: string) => {
    setSelectedMember(member);
    onSelectMember(member);
  };
  return (
    <CategoryWrap>
      {memberRolesArray.map((member) => (
        <MemberSelectionButton
          key={member}
          member={member}
          selected={selectedMember === member}
          onClick={onMemberSelect}
        />
      ))}
    </CategoryWrap>
  );
};

interface MembersSelectorProps {
  onSelectMember: (selectedMembers: string) => void;
  selectedMembers?: string[] | string;
}

const CategoryWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const MemberButton = styled(DefaultButton)<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#3467a1' : '#F6F8F8')};
  color: ${(props) => (props.selected ? '#F6F8F8' : '#3467a1')};
  padding: 5px 10px;
  margin: 5px;
  border-radius: 25px;
  cursor: pointer;
`;

type MemberSelectionButtonProps = {
  member: string;
  selected: boolean;
  onClick: (member: string) => void;
};

function MemberSelectionButton({
  member,
  selected,
  onClick,
}: MemberSelectionButtonProps) {
  return (
    <MemberButton selected={selected} onClick={() => onClick(member)}>
      {member}
    </MemberButton>
  );
}
