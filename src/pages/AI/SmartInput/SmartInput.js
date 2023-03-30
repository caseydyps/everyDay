import styled from 'styled-components';
import React, { useState } from 'react';
import axios from 'axios';

const Wrapper = styled.div`
  width: 100vw;
  height: 100px;
  border: 2px solid black;
`;

const configJs = require('../../../config/config.js');

const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: configJs.openai.apiKey,
});

const openai = new OpenAIApi(config);

const SmartInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const runPrompt = async () => {
    const prompt = `
          This is the data base for my family:{
              "role": "Dad",
              "calendar": [
                {
                  "event": "Dentist Appointment",
                  "date": "2023-04-01",
                  "time": "10:00 AM"
                },
                {
                  "event": "Parent-Teacher Conference",
                  "date": "2023-04-07",
                  "time": "2:00 PM"
                }
              ],
              "todo": [
                {
                  "task": "Clean the garage",
                  "completed": false
                },
                {
                  "task": "Buy groceries",
                  "completed": true
                }
              ],
              "milestones": [
                {
                  "milestone": "Graduate from college",
                  "date": "2024-05-01"
                },
                {
                  "milestone": "Get a job",
                  "date": "2024-06-01"
                }
              ],
              "stickyNotes": [
                {
                  "title": "Important Phone Numbers",
                  "content": "Doctor: 555-1234, Dentist: 555-5678"
                },
                {
                  "title": "To Remember",
                  "content": "Get a haircut on Saturday"
                }
              ]
            }.${inputValue}. Return response in the following parsable JSON format in Traditional Chinese:
          {
              "S": "Suggestion",
              
          }
      `;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.5,
    });

    const parsableJSONresponse = response.data.choices[0].text;
    console.log(response.data);
    const parsedResponse = JSON.parse(parsableJSONresponse);
    console.log('parsedResponse:', parsedResponse);

    console.log('Suggestions: ', parsedResponse.S);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log('inputValue:', inputValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    runPrompt();
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <label>
          Input:
          <input type="text" value={inputValue} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Response:</p>
        <p>{responseValue}</p>
      </div>
    </Wrapper>
  );
};

export default SmartInput;
