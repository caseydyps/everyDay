import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Wrapper = styled.div`
  display: flex;

  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputWrapper = styled.div`
  display: flex;

  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  color: #fff;
`;

const InputField = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  width: 50%;
  padding: 0.5rem;
  font-size: 1rem;
  font-family: Arial;
  font-weight: normal;
  line-height: 1.5;
  color: #fff;
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  flex: 2;
`;

function Financial() {
  const [currentSavings, setCurrentSavings] = useState('');
  const [goal, setGoal] = useState('');

  const handleCurrentSavingsChange = (event) => {
    setCurrentSavings(event.target.value);
  };

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const currentSavingsPercentage = ((currentSavings / goal) * 100 || 0).toFixed(
    1
  );
  const goalPercentage = 100 - currentSavingsPercentage;

  return (
    <Wrapper>
      <InputWrapper>
        <InputLabel htmlFor="current-savings">目前:</InputLabel>
        <InputField
          id="current-savings"
          value={currentSavings}
          onChange={handleCurrentSavingsChange}
          placeholder="輸入目前"
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel htmlFor="goal">目標:</InputLabel>
        <InputField
          id="goal"
          value={goal}
          onChange={handleGoalChange}
          placeholder="輸入目標"
        />
      </InputWrapper>
      <CircleWrapper style={{ width: 80, height: 80 }}>
        <CircularProgressbar
          value={currentSavingsPercentage}
          text={`${currentSavingsPercentage}%`}
          styles={{
            text: { fill: '#EB7A53' },
            background: {
              fill: '#EB7A53',
            },
            path: {
              // Path color
              stroke: `#EB7A53, ${currentSavingsPercentage / 100})`,
            },
          }}
        />
      </CircleWrapper>
    </Wrapper>
  );
}

export default Financial;
