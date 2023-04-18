import styled from 'styled-components/macro';
import { useState, useEffect, ChangeEvent } from 'react';
// import Timeline from './Timeline';
import Sidebar from '../../Components/Nav/Navbar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  updateDoc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  writeBatch,
  deleteDoc,
  doc,
  query,
  where,
  arrayUnion,
} from 'firebase/firestore';

function Milestone() {
  type EventType = {
    id: number;
    title: string;
    date: Date;
    member: string;
    image: string | null;
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDate, setNewEventDate] = useState<string>('');
  const [newEventMember, setNewEventMember] = useState<string>('');
  const [newEventImage, setNewEventImage] = useState<Blob | MediaSource | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<ImageType | null>(null);
  type NewEvent = {
    id: number;
    title: string;
    date: Date;
    member: string;
    image: string;
  };

  type HandleNewEventSubmit = (e: React.FormEvent<HTMLFormElement>) => void;

  const handleNewEventSubmit: HandleNewEventSubmit = async (e) => {
    e.preventDefault();
    console.log(newEventDate);
    const newEvent = {
      id: uuidv4(),
      title: newEventTitle,
      date: newEventDate,
      member: newEventMember,
      image: file ? URL.createObjectURL(file) : null,
    };

    try {
      const eventsRef = collection(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'Milestone'
      );
      await setDoc(doc(eventsRef, newEvent.id), newEvent);
      console.log('New event has been added to Firestore!');
      setEvents((prevEvents: any) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Error adding new event to Firestore: ', error);
    }

    // Clear the form fields
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventMember('');
    setNewEventImage(null);
  };

  type AvatarPreviewProps = {
    avatar: string;
    src: string;
  };

  const AvatarPreview = ({ avatar }: any) => {
    return <img src={avatar} alt="Avatar" />;
  };

  const handleEditEvent = (event: EventType) => {
    setEditedEvent(event);
    setIsEditing(true);
  };

  const filterEvents = (events: EventType[]) => {
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

  type FilterType = {
    member: string;
    startDate: Date | null;
    endDate: Date | null;
    title: string;
  };
  const [filter, setFilter] = useState<FilterType>({
    member: '',
    startDate: null,
    endDate: null,
    title: '',
  });
  type HandleEditFormSubmit = (editedEvent: EventType) => void;
  const handleEditFormSubmit: HandleEditFormSubmit = async (editedEvent) => {
    try {
      const eventsRef = doc(
        db,
        'Family',
        'Nkl0MgxpE9B1ieOsOoJ9',
        'Milestone',
        editedEvent.id.toString()
      );
      await updateDoc(eventsRef, editedEvent);
      console.log('Event updated successfully!');
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editedEvent.id ? editedEvent : event
        )
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event: ', error);
    }
  };

  const handleDeleteEvent = async (id: any) => {
    console.log(id);
    try {
      await deleteDoc(
        doc<any>(db, 'Family', 'Nkl0MgxpE9B1ieOsOoJ9', 'Milestone', id)
      );
      setEvents(events.filter((event) => event.id !== id));
      console.log(events);
      console.log('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  const EditEventForm: any = ({
    event,
    onEdit,
  }: {
    event: EventType;
    onEdit: HandleEditFormSubmit;
  }) => {
    const [title, setTitle] = useState(event.title);
    const [date, setDate] = useState<string | Date>(event.date);
    const [member, setMember] = useState(event.member);
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const editedEvent: any = {
        ...event,
        title,
        date: date,
        member,
        image: image ? URL.createObjectURL(image) : null,
      };

      onEdit(editedEvent);
    };

    return (
      <form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel>Title:</FormLabel>
          <FormInput
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </FormField>
        <FormField>
          <FormLabel>Date:</FormLabel>
          <FormInput
            type="date"
            value={date}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
          />
        </FormField>
        <FormField>
          <FormLabel>Member:</FormLabel>
          <FormInput
            type="text"
            value={member}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMember(e.target.value)
            }
          />
        </FormField>
        <FormField>
          <FormLabel>Image:</FormLabel>
          <FormInput
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files?.[0] || null)
            }
          />
        </FormField>
        <button type="submit">Save</button>
      </form>
    );
  };

  useEffect(() => {
    const familyDocRef = collection(
      db,
      'Family',
      'Nkl0MgxpE9B1ieOsOoJ9',
      'Milestone'
    );

    async function fetchData() {
      try {
        const querySnapshot = await getDocs(familyDocRef);
        const data: any = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }
    }

    fetchData();
  }, []);
  console.log(events);
  console.log(isEditing);

  return (
    <Container>
      <Wrapper>
        <Header>Milestone</Header>
        <Wrap>
          <h3>Filter</h3>
          <FormField>
            <FormLabel>Title:</FormLabel>
            <FormInput
              type="text"
              value={filter.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter({ ...filter, title: e.target.value })
              }
            />
          </FormField>

          <FormField>
            <FormLabel>Member:</FormLabel>
            <FormInput
              type="text"
              value={filter.member}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter({ ...filter, member: e.target.value })
              }
            />
          </FormField>

          <FormField>
            <FormLabel>Start Date:</FormLabel>
            <FormInput
              type="date"
              value={filter.startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter({ ...filter, startDate: new Date(e.target.value) })
              }
            />
          </FormField>

          <FormField>
            <FormLabel>End Date:</FormLabel>
            <FormInput
              type="date"
              value={filter.endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter({ ...filter, endDate: new Date(e.target.value) })
              }
            />
          </FormField>
        </Wrap>

        <ContentWrapper>
          <FormWrapper>
            <Form onSubmit={handleNewEventSubmit}>
              <FormField>
                <FormLabel>Title:</FormLabel>
                <FormInput
                  type="text"
                  value={newEventTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewEventTitle(e.target.value)
                  }
                />
              </FormField>
              <FormField>
                <FormLabel>Date:</FormLabel>
                <FormInput
                  type="date"
                  value={newEventDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewEventDate(e.target.value)
                  }
                />
              </FormField>
              <FormField>
                <FormLabel>Member:</FormLabel>
                <FormInput
                  type="text"
                  value={newEventMember}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewEventMember(e.target.value)
                  }
                />
              </FormField>
              <FormField>
                <FormLabel>Image:</FormLabel>

                {imagePreview ? (
                  <AvatarPreview src={imagePreview} alt="Preview" />
                ) : (
                  <input
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setFile(files[0]);
                      }
                    }}
                  />
                )}
              </FormField>
              <FormButton type="submit">Add Event</FormButton>
            </Form>
          </FormWrapper>

          <EventContainer>
            {/* <Timeline events={events} /> */}

            {filterEvents(events)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
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
                      <EventDate>{event.date}</EventDate>
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
          </EventContainer>
          {isEditing ? (
            <EditEventForm event={editedEvent} onEdit={handleEditFormSubmit} />
          ) : (
            <form onSubmit={handleNewEventSubmit} />
          )}
        </ContentWrapper>
      </Wrapper>
    </Container>
  );
}

export default Milestone;

const Wrapper = styled.div`
  width: 80vw;
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ColumnWrap = styled.div`
  background-color: #bbdefb;
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
`;

const Wrap = styled.div`
  background-color: #bbdefb;
  display: flex;
  flex-direction: row;
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

const EventDate: any = styled.div`
  font-size: 18px;
  text-align: center;
`;

const EventMember = styled.div`
  font-size: 18px;
  text-align: center;
`;
type ImageType = {
  src: string;
  alt: string;
};
const EventImage = styled.img<any>`
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

const FormInput: any = styled.input`
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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
