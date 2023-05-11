import styled from 'styled-components/macro';
import React, { useState } from 'react';
import DefaultButton from '../Button/Button';

export const CategorySelector = ({
  onSelect,
}: CategorySelectorProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['#Calendar', '#Todo', '#Milestone'];
  const onCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelect(category);
  };

  return (
    <CategorySelectorContainer>
      {categories.map((category) => (
        <CategoryButton
          key={category}
          active={selectedCategory === category}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </CategoryButton>
      ))}
    </CategorySelectorContainer>
  );
};

interface CategorySelectorProps {
  onSelect: (category: string) => void;
}

const CategorySelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const CategoryButton = styled(DefaultButton)<{ active?: boolean }>`
  font-size: 16px;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 25px;
  cursor: pointer;

  ${(props) =>
    props.active &&
    `
    background-color: #3467a1;
    color: #F6F8F8;
  `}
`;
