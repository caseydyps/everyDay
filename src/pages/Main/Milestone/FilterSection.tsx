import React from 'react';
import styled from 'styled-components';
import {
  faCircleXmark,
  faFilter,
  faPlus,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultButton from '../../../Components/Button/Button';
import { MembersSelector } from '../../../Components/Selectors/MemberSelector';
const AnimatedFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const Wrap = styled.div`
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  width: 700px;
  padding: 20px;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-around;
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #414141;
`;

const CancelButton = styled(DefaultButton)`
  margin: 10px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: transparent;
  font-size: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 400px;
`;

const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  margin-top: 20px;
`;

const FormInput: any = styled.input`
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  width: 150px;
`;

const FilterSection = ({
  setShowFilter,
  filter,
  setFilter,
  handlefilterSelectMember,
}) => {
  return (
    <Wrap>
      <CancelButton onClick={() => setShowFilter(false)}>
        <AnimatedFontAwesomeIcon icon={faCircleXmark} />
      </CancelButton>
      <FormField>
        <FormLabel>事件:</FormLabel>
        <FormInput
          type="text"
          value={filter.title}
          onChange={(e) => setFilter({ ...filter, title: e.target.value })}
        />
      </FormField>
      <FormField>
        <FormLabel>Member:</FormLabel>
        <MembersSelector onSelectMember={handlefilterSelectMember} />
      </FormField>
      <FormField>
        <FormLabel>開始日期:</FormLabel>
        <FormInput
          type="date"
          value={filter.startDate}
          onChange={(e) =>
            setFilter({ ...filter, startDate: new Date(e.target.value) })
          }
        />
      </FormField>
      <FormField>
        <FormLabel>結束日期:</FormLabel>
        <FormInput
          type="date"
          value={filter.endDate}
          onChange={(e) =>
            setFilter({ ...filter, endDate: new Date(e.target.value) })
          }
        />
      </FormField>
    </Wrap>
  );
};

export default FilterSection;
