import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import Timeline from './Timeline';
import ImageSlider from './Slider';

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid black;
`;

const ColumnWrap = styled.div`
  background-color: #bbdefb;
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
`;

const Header = styled.h1`
  margin-top: 50px;
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;

const ContentWrapper = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #e3f2fd;
`;

const EventContainer = styled.div`
  max-width: 80%;
  height: 100%;
  display: flex;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  /* Style the scrollbar */
  &::-webkit-scrollbar {
    width: 58px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 58px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
`;

const EventBox = styled.div`
  width: auto;

  border: 2px solid #999;
  border-radius: 10px;
  display: flex;

  justify-content: space-between;
  margin: 10px;

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

const DeleteButton = styled.button`
  font-size: 16px;
  padding: 5px 10px;
  background-color: #e57373;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ef5350;
  }
`;

const EventDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #aaa;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
`;

const SearchIcon = styled.i`
  font-size: 20px;
  color: #999;
  margin-right: 5px;
`;

const SearchInputField = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
`;

function MilestoneMini() {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventMember, setNewEventMember] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleNewEventSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: events.length + 1,
      title: newEventTitle,
      date: new Date(newEventDate),
      member: newEventMember,
      image: URL.createObjectURL(file),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Clear the form fields
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventMember('');
    setNewEventImage('');
  };

  const AvatarPreview = ({ avatar }) => {
    return <img src={avatar} alt="Avatar" />;
  };

  const handleEditEvent = (event) => {
    EditEventForm;
    setEditedEvent(event);
    setIsEditing(true);
  };

  const filterEvents = (events) => {
    return events.filter((event) => {
      let match = true;

      if (filter.member !== '') {
        match =
          match &&
          event.member.toLowerCase().includes(filter.member.toLowerCase());
      }

      if (filter.startDate !== null) {
        match = match && event.date >= filter.startDate;
      }

      if (filter.endDate !== null) {
        match = match && event.date <= filter.endDate;
      }

      if (filter.title !== null) {
        match =
          match &&
          event.title.toLowerCase().includes(filter.title.toLowerCase());
      }

      return match;
    });
  };

  const [filter, setFilter] = useState({
    member: '',
    startDate: null,
    endDate: null,
    title: '',
  });

  const handleEditFormSubmit = (editedData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === editedEvent.id ? { ...event, ...editedData } : event
      )
    );
    setIsEditing(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImage('');
    }
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
        image: URL.createObjectURL(image),
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

          {imagePreview ? (
            <AvatarPreview src={imagePreview} alt="Preview" />
          ) : (
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          )}
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
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
        image: 'https://picsum.photos/200',
      },
      {
        id: 3,
        title: 'Event 3',
        date: new Date(2023, 3, 22),
        member: 'Bob Johnson',
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
  console.log(events);

  return (
    <Wrapper>
      <Header>Milestone</Header>
      {/* <SearchInputField
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      /> */}

      {/* <Wrap>
        <h3>Filter</h3>
        <FormField>
          <FormLabel>Title:</FormLabel>
          <FormInput
            type="text"
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel>Member:</FormLabel>
          <FormInput
            type="text"
            value={filter.member}
            onChange={(e) => setFilter({ ...filter, member: e.target.value })}
          />
        </FormField>

        <FormField>
          <FormLabel>Start Date:</FormLabel>
          <FormInput
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: new Date(e.target.value) })
            }
          />
        </FormField>

        <FormField>
          <FormLabel>End Date:</FormLabel>
          <FormInput
            type="date"
            value={filter.endDate}
            onChange={(e) =>
              setFilter({ ...filter, endDate: new Date(e.target.value) })
            }
          />
        </FormField>
      </Wrap> */}

      <ContentWrapper>
        {/* <FormWrapper>
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

              {imagePreview ? (
                <AvatarPreview src={imagePreview} alt="Preview" />
              ) : (
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              )}
            </FormField>
            <FormButton type="submit">Add Event</FormButton>
          </Form>
        </FormWrapper> */}

        <EventContainer>
          <Timeline events={events} />

          {filterEvents(events)
            .sort((a, b) => a.date - b.date)
            .map((event, index) => (
              <>
                <EventBox
                  key={event.id}
                  style={{
                    alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
                    marginTop: index % 2 === 0 ? '0px' : '400px',
                    marginBottom: index % 2 === 0 ? '400px' : '0px',
                  }}
                >
                  <EditButton onClick={() => handleEditEvent(event)}>
                    Edit
                  </EditButton>
                  <ColumnWrap>
                    <EventImage src={event.image} alt="Event" />
                    <EventTitle>{event.title}</EventTitle>
                    <EventDate>{event.date.toDateString()}</EventDate>
                    <EventMember>Member: {event.member}</EventMember>s
                  </ColumnWrap>

                  <DeleteButton onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </DeleteButton>
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

export default MilestoneMini;
