import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AddItemForm({ groupIndex, onAddItem }) {
  const [title, setTitle] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [dueDateNeeded, setDueDateNeeded] = useState(false);
  const family = [
    {
      name: 'Dad',
      role: 'Parent',
      avatarSrc:
        'https://api.dicebear.com/6.x/adventurer/svg?seed=Dad&eyebrows=variant01&eyes=variant01&hair=short01&hairProbability=100&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
    },
    {
      name: 'Mom',
      role: 'Parent',
      avatarSrc:
        'https://api.dicebear.com/6.x/adventurer/svg?seed=Mom&eyebrows=variant01&eyes=variant01&hair=long03&hairProbability=100&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
    },
    {
      name: 'Kid',
      role: 'Child',
      avatarSrc:
        'https://api.dicebear.com/6.x/adventurer/svg?seed=Kid&eyebrows=variant01&eyes=variant01&hair=short19&hairProbability=0&hairColor=0e0e0e&mouth=variant01&backgroundColor=transparent&features=blush&featuresProbability=100',
    },
  ];
  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleDateChange(date: Date) {
    setDueDate(date);
  }

  function handleMemberChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const memberIndex = parseInt(event.target.value);
    setSelectedMember(memberIndex);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const member = family[selectedMember];
    const due = dueDateNeeded ? dueDate.toLocaleDateString() : null;
    console.log('Title:', title);
    console.log('Due:', due);
    onAddItem(groupIndex, { title, due, member });
    setTitle('');
    setDueDate(new Date());
    setSelectedMember(null);
    setDueDateNeeded(false);
  }

  function handleDueDateNeededChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const isChecked = event.target.checked;
    setDueDateNeeded(isChecked);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={handleTitleChange} />
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={dueDateNeeded}
          onChange={handleDueDateNeededChange}
        />
        Due date needed
      </label>

      {dueDateNeeded ? (
        <label>
          Due Date:
          <DatePicker selected={dueDate} onChange={handleDateChange} />
        </label>
      ) : null}
      <br />

      <br />
      <label>Members:</label>
      <br />
      {family.map((member, index) => (
        <label key={index}>
          <input
            type="radio"
            name="family-member"
            value={index}
            checked={selectedMember === index}
            onChange={handleMemberChange}
          />
          {member.name}
        </label>
      ))}
      <br />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItemForm;
