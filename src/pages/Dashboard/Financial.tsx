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
`;

const InputLabel = styled.label`
  font-size: 12px;
  color: #fff;
`;

const InputField = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  width: 50%;

  font-size: 8px;
  font-family: Arial;
  font-weight: normal;
  line-height: 1.5;
  color: #fff;
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Financial() {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);

  const handleCurrentSavingsChange = (event: any) => {
    setCurrentSavings(event.target.value);
  };

  const handleGoalChange = (event: any) => {
    setGoal(event.target.value);
  };

  const currentSavingsPercentage: any = (
    (currentSavings / goal) * 100 || 0
  ).toFixed(1);

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
      <CircleWrapper style={{ width: 50, height: 50 }}>
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
