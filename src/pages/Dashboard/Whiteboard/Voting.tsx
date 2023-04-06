import React, { useState } from 'react';
import Vote from './Vote';

function Voting() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);
  const [voteCreated, setVoteCreated] = useState(false);

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Title:', title);
    console.log('Options:', options);

    // Save to local storage
    const vote = { title, options };
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    votes.push(vote);
    localStorage.setItem('votes', JSON.stringify(votes));
    setVoteCreated(true);
  };

  

  return (
    <div>
      <h1>Create a New Vote</h1>
      {!voteCreated ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {options.map((option, index) => (
            <div key={index}>
              <label htmlFor={`option-${index}`}>Option {index + 1}:</label>
              <input
                id={`option-${index}`}
                type="text"
                value={option}
                onChange={(event) => handleOptionChange(index, event)}
              />
              <button type="button" onClick={() => handleRemoveOption(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddOption}>
            Add Option
          </button>
          <button type="submit">Create Vote</button>
        </form>
      ) : (
        <Vote title={title} options={options} />
      )}
    </div>
  );
}

export default Voting;
