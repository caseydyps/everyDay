import styled from 'styled-components/macro';
import React, { useState } from 'react';
const Wrapper = styled.div`
  width: 80vw;
  height: auto;
  border: 2px solid black;
  display: flex;
  flex-direction: row;
`;
const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  margin-bottom: 0.5rem;
`;

const InputField = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #0077cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #005ea8;
  }
`;

const ResponseDisplay = styled.div`
  background-color: #f2f2f2;
  border-radius: 4px;
  padding: 1rem;
`;

type CategoryButtonProps = {
  active?: boolean;
  onClick: () => void;
};
const CategoryButton = styled.button<CategoryButtonProps>`
  font-size: 18px;
  padding: 10px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #007aff;
    color: #fff;
  `}
`;

const CategorySelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const configJs = require('../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

type CategorySelectorProps = {
  onSelect: (category: string) => void;
};

const CategorySelector = ({ onSelect }: CategorySelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = [
    '#Calendar',
    '#Todo',
    '#Album',
    '#AI',
    '#StickyNotes',
    '#Milestone',
  ];

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
const members = ['Daddy', 'Mom', 'Baby'];
type MembersSelectorProps = {
  selectedMembers?: string[];
  onSelectMember: (members: string[]) => void;
};

const MembersSelector = ({
  selectedMembers = ['Daddy', 'Mom', 'Baby'],
  onSelectMember,
}: MembersSelectorProps) => {
  const handleSelectMember = (member: string) => {
    if (selectedMembers.includes(member)) {
      onSelectMember(selectedMembers.filter((m) => m !== member));
    } else {
      onSelectMember([...selectedMembers, member]);
    }
  };

  return (
    <div>
      {members.map((member) => (
        <button
          key={member}
          style={{
            background: selectedMembers.includes(member) ? 'blue' : 'grey',
            color: 'white',
            padding: '5px 10px',
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => handleSelectMember(member)}
        >
          {member}
        </button>
      ))}
    </div>
  );
};

const SmartInputMini = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([
    'Daddy',
    'Mom',
    'Baby',
  ]);
  const handleCategorySelect = (category: string) => {
    setCategory(category);
  };

  const handleSelectMember = (member: string[]) => {
    setSelectedMembers(member);
  };

  const runPrompt = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    let categoryFeedback = '';
    if (category === '#Calendar') {
      let prompt = `
      User input: ${inputValue}
      today is ${formattedDate}
      
      請依照傳統行事曆格式，生成以下 JSON 回應：

      行事曆：
      {
        "event": "事件名稱",
        "category": ${category},
        "startTime": "開始時間 (YYYY-MM-DD HH:MM)",
        "endTime": "結束時間 (YYYY-MM-DD HH:MM)",
        "members": ${selectedMembers},
        "response": "${categoryFeedback} 回應訊息"
      }
    
    `;

      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });

      setResponseValue(response.data.choices[0].text);
    }
    if (category === '#Todo') {
      let prompt = `
      
      使用者輸入: ${inputValue}
  今天日期是 ${formattedDate}
  請依照繁體中文格式，生成以下 JSON 回應：

  待辦事項：
  {
    "task": "任務描述",
    "category": ${category},
    "dueTime": "截止時間 (YYYY-MM-DD HH:MM)",
    "members": ${selectedMembers},
    "completed": false,
    "response": "完成任務後，請不要忘記將其標記為完成。回應訊息"
  }
    `;
      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      setResponseValue(response.data.choices[0].text);
    }

    if (category === '#StickyNotes') {
      let prompt = `
      使用者輸入: ${inputValue}
  今天日期是 ${formattedDate}
  請依照繁體中文格式，生成以下 JSON 回應：
  便利貼：
  {
    "title": "便利貼標題",
    "category": ${category},
    "content": "便利貼內容",
    "response": "此便利貼已添加到您的便利貼列表。回應訊息"
  }
    `;
      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      setResponseValue(response.data.choices[0].text);
    }
    if (category === '#Milestone') {
      let prompt = `
    使用者輸入：${inputValue}
    今天是${formattedDate}。

    請生成一個包含以下字段的JSON回應：

    里程碑:
    {
      "milestone": "里程碑描述",
      "category": ${category},
      "date": "里程碑日期（YYYY-MM-DD）",
      "members": ${selectedMembers},
      "response": "恭喜您達成里程碑！回應信息"
    }
  `;
      let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.5,
      });
      setResponseValue(response.data.choices[0].text);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    await runPrompt();
  };

  return (
    <Container>
      <Wrapper>
        <CategorySelector onSelect={handleCategorySelect} />
        <MembersSelector
          onSelectMember={handleSelectMember}
          selectedMembers={selectedMembers}
        />
        <InputForm onSubmit={handleSubmit}>
          <InputLabel>
            Input:
            <InputField
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </InputLabel>
          <SubmitButton type="submit">Submit</SubmitButton>
        </InputForm>
        {responseValue && (
          <ResponseDisplay>
            <p>Response:</p>
            <p>{responseValue}</p>
          </ResponseDisplay>
        )}
      </Wrapper>
    </Container>
  );
};

export default SmartInputMini;
