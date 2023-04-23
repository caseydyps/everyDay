import styled, { keyframes } from 'styled-components/macro';
import { useState, useEffect, ChangeEvent } from 'react';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Layout from '../../Components/layout';
import { v4 as uuidv4 } from 'uuid';
import DefaultButton, { Card } from '../../Components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faPlus,
  faCirclePlus,
  faPlusCircle,
  faPenToSquare,
  faTrashCan,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import LoadingAnimation from '../../Components/loading';

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
import UserAuthData from '../../Components/Login/Auth';
import { MembersSelector } from '../AI/SmartInput';

function Milestone() {
  type EventType = {
    id: number;
    title: string;
    date: Date;
    member: string;
    image: string | null;
  };
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
    membersArray,
    memberRolesArray,
  } = UserAuthData();

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
  const [member, setMember] = useState<string>('');
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
      image: file ? file : null,
    };

    try {
      const eventsRef = collection(db, 'Family', familyId, 'Milestone');
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
        familyId,
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
      await deleteDoc(doc<any>(db, 'Family', familyId, 'Milestone', id));
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
        image: image ? image : null,
      };

      onEdit(editedEvent);
    };

    const handleEditMember = (member: string) => {
      setMember(member);
    };

    return (
      <Wrap style={{ top: '0%' }}>
        <CancelButton onClick={() => setIsEditing(false)}>
          <AnimatedFontAwesomeIcon
            icon={faCircleXmark}
          ></AnimatedFontAwesomeIcon>
        </CancelButton>
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
            <MembersSelector onSelectMember={handleEditMember} />
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const fileUrl = reader.result as string;
                    setImage(fileUrl);
                  };
                  reader.readAsDataURL(selectedFile);
                } else {
                  setImage(null);
                }
              }}
            />
          </FormField>
          <Button type="submit">Save</Button>
        </form>
      </Wrap>
    );
  };

  useEffect(() => {
    async function fetchData() {
      console.log(familyId);
      console.log(membersArray);
      const familyDocRef = collection(db, 'Family', familyId, 'Milestone');
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
  }, [familyId]);

  console.log(events);
  console.log(isEditing);

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const handleToggleFilter = (): void => {
    setShowFilter(!showFilter);
    if (showAddEvent) {
      toggleAddEvent();
    }
  };

  const handleSelectMember = (member: string) => {
    event.preventDefault();

    setNewEventMember(member);
  };
  const handlefilterSelectMember = (member: string) => {
    event.preventDefault();
    setFilter({ ...filter, member: member });
  };

  const [showAddEvent, setShowAddEvent] = useState<boolean>(false);
  const toggleAddEvent = (): void => {
    setShowAddEvent(!showAddEvent);
    if (showFilter) {
      setShowFilter(!showFilter);
    }
  };

  return (
    <Container>
      <ColumnWrap>
        <ContentWrapper>
          <EventContainer>
            {filterEvents(events)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event, index) => {
                const dateObj = new Date(event.date);
                const monthName = dateObj.toLocaleString('default', {
                  month: 'short',
                });
                return (
                  <>
                    <EventBox key={event.id}>
                      <ColumnWrap>
                        <EventImage
                          src={
                            event.image ||
                            'https://source.unsplash.com/random/?city,night'
                          }
                          alt=""
                        />
                        <DateBox>
                          <DateInfo>
                            <Month>{monthName}</Month>
                            <Day>{dateObj.getDate()}</Day>
                            <Year>{dateObj.getFullYear()}</Year>
                          </DateInfo>
                        </DateBox>
                        <InfoWrap>
                          <EventTitle>{event.title}</EventTitle>
                          <EventTitle>|</EventTitle>
                          <EventTitle>{event.member}</EventTitle>
                        </InfoWrap>
                        <RowWrap>
                          <Button onClick={() => handleEditEvent(event)}>
                            <AnimatedFontAwesomeIcon
                              icon={faPenToSquare}
                            ></AnimatedFontAwesomeIcon>
                          </Button>
                          <Button onClick={() => handleDeleteEvent(event.id)}>
                            <AnimatedFontAwesomeIcon
                              icon={faTrashCan}
                            ></AnimatedFontAwesomeIcon>
                          </Button>
                        </RowWrap>
                      </ColumnWrap>
                    </EventBox>
                    {/* <EventDot
                      style={{
                        alignSelf: 'center',
                      }}
                    /> */}
                  </>
                );
              })}
          </EventContainer>
          {isEditing ? (
            <EditEventForm event={editedEvent} onEdit={handleEditFormSubmit} />
          ) : (
            <form onSubmit={handleNewEventSubmit} />
          )}
        </ContentWrapper>
        <LoadingAnimation />
      </ColumnWrap>
    </Container>
  );
}

export default Milestone;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  width: 600px;
  align-items: center;
  position: relative;
`;

const Wrap = styled(Card)`
  background-color: rgba(52, 103, 161, 0.8);
  display: flex;
  min-width: 800px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  z-index: 2;
  position: absolute;
  top: 30%;
  color: #fff;
`;

const Header = styled.h1`
  margin-top: 50px;
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: trasparent;
`;

const EventContainer = styled.div`
  max-width: 100%;
  height: 100%;
  display: flex;
  overflow-x: scroll;
  padding: 0px;
  -webkit-overflow-scrolling: touch;

  /* Style the scrollbar */
  &::-webkit-scrollbar {
    width: 58px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3467a1;
    border-radius: 58px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #fff5c9;
  }
`;

const EventBox = styled.div`
  width: 95%;
  max-height: 400px;

  border-radius: 20px;
  display: flex;
  background-color: #white;
  justify-content: space-between;
  margin: 10px;

  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* added box shadow */
`;
const EventTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-right: 5px;
  margin-left: 5px;
  color: white;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.7); /* added text shadow */
`;

const EventDate: any = styled.div`
  font-size: 10px;
  text-align: center;
`;

const EventMember = styled.div`
  font-size: 18px;
  text-align: center;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const DateBox = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  background-color: #fff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 20%;
  bottom: 80px; /* changed top property to bottom */
  left: 10px;
  padding: 5px;
`;

const Button = styled(DefaultButton)`
  margin: 10px;
`;
const CancelButton = styled(DefaultButton)`
  margin: 10px;
  position: absolute;
  right: 0;
  top: 0;
`;

type ImageType = {
  src: string;
  alt: string;
};
const EventImage = styled.img<any>`
  width: 100%;
  height: 25vh;
  object-fit: cover;
  border-radius: 20px;
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

  width: 400px;
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
  justify-content: center;
  align-items: center;
  margin-top: 2s0px;
  height: auto;
`;

const bounce = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const AnimatedFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  // &:hover {
  //   animation: ${bounce} 0.5s;
  // }
`;

const DateInfo = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Year = styled.div`
  font-size: 8px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
`;

const Month = styled.div`
  font-size: 8px;
  margin-bottom: 5px;
  color: black;
`;

const Day = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: coral;
`;
