import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
import DefaultButton from '../../../Components/Button/Button';
const FilterSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 25px;
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.3);
  max-width: 700px;
  padding: 20px;
  position: absolute;
  color: #3467a1;
  top: 20%;
  right: 50%;
  transform: translate(+50%, 0%);
  z-index: 3;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const FilterButton = styled(DefaultButton)`
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 20px;
  background: transparent;
`;

const Text = styled.div`
  color: black;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  &:hover {
  }
`;

const StyledDateInput = styled.input.attrs({
  type: 'date',
})`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5981b0;
    box-shadow: 0 0 0 2px rgba(52, 103, 161, 0.3);
  }
`;

const FavoriteButton = styled(DefaultButton)`
  background: #b7cce2;
  color: white;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

interface FilterSectionProps {
  setShowFilterSection: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  selectedMember: string;
  handleFilterMember: (member: string) => void;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  showFavorite: boolean;
  setShowFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  setShowFilterSection,
  setSelectedMember,
  selectedMember,
  handleFilterMember,
  selectedDate,
  setSelectedDate,
  showFavorite,
  setShowFavorite,
}) => {
  return (
    <FilterSectionWrapper>
      <FilterButton onClick={() => setShowFilterSection(false)}>
        <FontAwesomeIcon icon={faXmarkCircle} />
      </FilterButton>
      <Text>
        Filter by member:
        <DefaultButton
          onClick={() => {
            setSelectedMember('');
          }}
          className={selectedMember === '' ? 'active' : ''}
        >
          All
        </DefaultButton>
        <MembersSelector onSelectMember={handleFilterMember} />
      </Text>
      <br />
      <Text>
        Filter by date:
        <StyledDateInput
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Text>
      <br />
      <br />
      <Text>
        Filter by favorite:
        <FavoriteButton
          onClick={() => setShowFavorite(!showFavorite)}
          className={showFavorite ? 'active' : ''}
        >
          {showFavorite ? 'Show all' : 'Show only favorites'}
        </FavoriteButton>
      </Text>
      <br />
    </FilterSectionWrapper>
  );
};

export default FilterSection;
