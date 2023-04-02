import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import Timeline from './Timeline';

const Wrapper = styled.div`
  width: 100vw;
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  margin-top: 50px;
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;

const ContentWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const EventContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
`;

const EventBox = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid #999;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px;
  overflow: hidden;

  &:nth-child(odd) {
    align-self: flex-end;
  }

  &:nth-child(even) {
    align-self: flex-start;
  }
  position: relative;
`;
const EventTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const EventDate = styled.div`
  font-size: 18px;
  text-align: center;
`;

const EventMember = styled.div`
  font-size: 18px;
  text-align: center;
`;

const EventImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const FormWrapper = styled.div`
  width: 80%;
  margin: 50px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 5px;
`;

const FormButton = styled.button`
  font-size: 16px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #3e8e41;
  }
`;
const TimelineWrapper = styled.div`
  position: absolute;
  width: 2px;
  height: 100%; /* change height to 100% */
  right: 50%;
  margin: 0 20px;
  background-color: #aaa;
`;

const EditButton = styled.button`
  font-size: 16px;
  padding: 5px 10px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0b7dda;
  }
`;

const EventDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #aaa;
`;

function Milestone() {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventMember, setNewEventMember] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  const handleNewEventSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: events.length + 1,
      title: newEventTitle,
      date: new Date(newEventDate),
      member: newEventMember,
      image: newEventImage,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Clear the form fields
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventMember('');
    setNewEventImage('');
  };

  const handleEditEvent = (event) => {
    EditEventForm;
    setEditedEvent(event);
    setIsEditing(true);
  };

  const handleEditFormSubmit = (editedData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === editedEvent.id ? { ...event, ...editedData } : event
      )
    );
    setIsEditing(false);
  };

  function EditEventForm({ event, onEdit }) {
    const [title, setTitle] = useState(event.title);
    const [date, setDate] = useState(event.date.toISOString().slice(0, 10));
    const [member, setMember] = useState(event.member);
    const [image, setImage] = useState(event.image);

    const handleSubmit = (e) => {
      e.preventDefault();

      const editedEvent = {
        ...event,
        title,
        date: new Date(date),
        member,
        image,
      };

      onEdit(editedEvent);
    };

    return (
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel>Title:</FormLabel>
          <FormInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel>Date:</FormLabel>
          <FormInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel>Member:</FormLabel>
          <FormInput
            type="text"
            value={member}
            onChange={(e) => setMember(e.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel>Image:</FormLabel>
          <FormInput
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </FormField>
        <FormButton type="submit">Save Changes</FormButton>
      </Form>
    );
  }

  function getEventYearRange(events) {
    const years = events.map((event) => event.date.getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return { minYear, maxYear };
  }

  useEffect(() => {
    // Fetch events from server or set initial events
    const initialEvents = [
      {
        id: 1,
        title: 'Get married',
        date: new Date(2023, 3, 15),
        member: 'John Doe',
        image:
          'https://fastly.picsum.photos/id/238/200/200.jpg?hmac=O4Jc6lqHVfaKVzLf8bWssNTbWzQoaRUC0TDXod9xDdM',
      },
      {
        id: 2,
        title: 'Event 2',
        date: new Date(2023, 3, 17),
        member: 'Jane Smith',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
    ];

    setEvents(initialEvents);
  }, []);

  //   const handleDrop = (event, index) => {
  //     const draggedEvent = events[event.index];
  //     setEvents((prevEvents) => {
  //       const newEvents = [...prevEvents];
  //       newEvents.splice(event.index, 1);
  //       newEvents.splice(index, 0, draggedEvent);
  //       return newEvents;
  //     });
  //   };

  return (
    <Wrapper>
      <Header>Milestone</Header>
      <ContentWrapper>
        <FormWrapper>
          <Form onSubmit={handleNewEventSubmit}>
            <FormField>
              <FormLabel>Title:</FormLabel>
              <FormInput
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </FormField>
            <FormField>
              <FormLabel>Date:</FormLabel>
              <FormInput
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
              />
            </FormField>
            <FormField>
              <FormLabel>Member:</FormLabel>
              <FormInput
                type="text"
                value={newEventMember}
                onChange={(e) => setNewEventMember(e.target.value)}
              />
            </FormField>
            <FormField>
              <FormLabel>Image:</FormLabel>
              <FormInput
                type="text"
                value={newEventImage}
                onChange={(e) => setNewEventImage(e.target.value)}
              />
            </FormField>
            <FormButton type="submit">Add Event</FormButton>
          </Form>
        </FormWrapper>

        <EventContainer>
          <Timeline events={events} />

          {events
            .sort((a, b) => a.date - b.date)
            .map((event, index) => (
              <>
                <EventBox
                  key={event.id}
                  style={{
                    alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
                    marginTop: '40px',
                    marginLeft: index % 2 === 0 ? '0px' : '20px',
                    marginRight: index % 2 === 0 ? '20px' : '0px',
                  }}
                >
                  <EditButton onClick={() => handleEditEvent(event)}>
                    Edit
                  </EditButton>
                  <EventImage src={event.image} alt="Event" />
                  <EventTitle>{event.title}</EventTitle>
                  <EventDate>{event.date.toDateString()}</EventDate>
                  <EventMember>Member: {event.member}</EventMember>
                </EventBox>
                <EventDot
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </>
            ))}

          {isEditing && (
            <EditEventForm event={editedEvent} onEdit={handleEditFormSubmit} />
          )}
        </EventContainer>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Milestone;
