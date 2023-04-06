import React from 'react';

function Vote({ title, options }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
}

export default Vote;
