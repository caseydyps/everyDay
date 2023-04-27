import styled, { keyframes } from 'styled-components/macro';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
// import Timeline from './Timeline';
import Sidebar from '../../Components/Nav/Navbar';
import { db } from '../../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Layout from '../../Components/layout';
import SideNav from '../../Components/Nav/SideNav';
import { v4 as uuidv4 } from 'uuid';
import Time from '../../Components/Banner/time.png';
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
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import LoadingAnimation from '../../Components/loading';
import { Chrono } from 'react-chrono';
import Banner from '../../Components/Banner/Banner';
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
  const [newEventMember, setNewEventMember] = useState<string | string[]>('');
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
    member: any;
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
    const [member, setMember] = useState<string | string[]>(event.member);
    const [image, setImage] = useState<any>(null);

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

    const handleEditMember = (member: string | string[]) => {
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

  const handleSelectMember = (member: string | string[]) => {
    // event.preventDefault();

    setNewEventMember(member);
  };
  const handlefilterSelectMember = (member: string | string[]) => {
    // event.preventDefault();
    setFilter({ ...filter, member: member });
  };

  const [showAddEvent, setShowAddEvent] = useState<boolean>(false);
  const toggleAddEvent = (): void => {
    setShowAddEvent(!showAddEvent);
    if (showFilter) {
      setShowFilter(!showFilter);
    }
  };

  const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

  const Gradient = styled.div`
    --size: 50px;
    --speed: 20s;
    --easing: cubic-bezier(0.8, 0.2, 0.2, 0.8);

    width: 600px;
    height: 300px;
    filter: blur(calc(var(--size) / 5));
    background-image: linear-gradient(
      hsl(158, 82%, 57%, 85%),
      hsl(252, 82%, 57%)
    );

    animation: ${rotate} var(--speed) var(--easing) alternate infinite;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

    @media (min-width: 720px) {
      --size: 500px;
    }
  `;

  const Body = styled.body`
    background-color: #222;
    position: absolute;
    inset: 0;
    display: flex;
    place-content: center;
    align-items: center;
    overflow: hidden;
  `;

  const BannerContainer = styled.div`
    width: 100vw-200px;
    height: 25vh;

    border: 3px solid white;
    position: relative; /* Added to set stacking context */

    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.8),
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.3),
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      ),
      linear-gradient(
        -45deg,

        #3467a1,
        #555555,
        #1034a6,
        #1b4d3e,
        #1034a6,
        #ff69b4
      );
    display: flex;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.9);
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
  `;

  const BannerTitle = styled.h1`
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    border: 3px solid white;
    padding: 20px;
    font-size: 36px;
    z-index: 2; /* Increased z-index value */
  `;

  const BannerSubTitle = styled.h2`
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 20px;
    text-align: center;
    z-index: 1;
  `;

  const BannerImg = styled.img`
    width: auto;
    height: 250px;
    position: absolute;
    right: 10%;
  `;
  const [eventWrapWidth, setEventWrapWidth] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };

  return (
    <Container>
      <SideNav></SideNav>
      <Wrapper>
        <BannerContainer>
          <Gradient />
          <BannerTitle>TIME MACHINE</BannerTitle>
          <BannerSubTitle>Time less memories</BannerSubTitle>
          <BannerImg src={Time} alt="Banner" />
        </BannerContainer>

        <RowWrap>
          <Button onClick={handleToggleFilter}>
            <AnimatedFontAwesomeIcon icon={faFilter}></AnimatedFontAwesomeIcon>
            篩選器
          </Button>
          <Button onClick={toggleAddEvent}>
            <AnimatedFontAwesomeIcon icon={faPlus}></AnimatedFontAwesomeIcon>
            新增里程碑
          </Button>
        </RowWrap>

        {showFilter && (
          <Wrap>
            <CancelButton onClick={() => setShowFilter(false)}>
              <AnimatedFontAwesomeIcon
                icon={faCircleXmark}
              ></AnimatedFontAwesomeIcon>
            </CancelButton>
            <FormField>
              <FormLabel>事件:</FormLabel>
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
              <MembersSelector onSelectMember={handlefilterSelectMember} />
              <FormInput
                type="text"
                value={filter.member}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilter({ ...filter, member: e.target.value })
                }
              />
            </FormField>

            <FormField>
              <FormLabel>開始日期:</FormLabel>
              <FormInput
                type="date"
                value={filter.startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilter({
                    ...filter,
                    startDate: new Date(e.target.value),
                  })
                }
              />
            </FormField>

            <FormField>
              <FormLabel>結束日期:</FormLabel>
              <FormInput
                type="date"
                value={filter.endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilter({ ...filter, endDate: new Date(e.target.value) })
                }
              />
            </FormField>
          </Wrap>
        )}

        {showAddEvent && (
          <Wrap>
            <Form onSubmit={handleNewEventSubmit}>
              <CancelButton onClick={() => setShowAddEvent(false)}>
                <AnimatedFontAwesomeIcon
                  icon={faCircleXmark}
                ></AnimatedFontAwesomeIcon>
              </CancelButton>
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
                <MembersSelector onSelectMember={handleSelectMember} />
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
                        const reader = new FileReader();
                        reader.onload = () => {
                          const fileUrl = reader.result as string;
                          setFile(fileUrl);
                        };
                        reader.readAsDataURL(files[0]);
                      }
                    }}
                  />
                )}
              </FormField>
              <Button type="submit">
                {'新增事件'}
                <AnimatedFontAwesomeIcon
                  icon={faPlusCircle}
                ></AnimatedFontAwesomeIcon>
              </Button>
            </Form>
          </Wrap>
        )}

        <Header>STORY BEGINS!</Header>
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
                  <EventWrap
                    onLayout={(event) =>
                      setEventWrapWidth(event.nativeEvent.layout.width)
                    }
                  >
                    <Dot
                      eventWrapWidth={eventWrapWidth}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left:
                          index % 2 === 0
                            ? `${435}px`
                            : `calc(100% - ${435}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    ></Dot>
                    <EventBox
                      key={event.id}
                      style={{
                        alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
                        marginRight: index % 2 === 0 ? '0px' : '600px',
                        marginLeft: index % 2 === 0 ? '600px' : '0px',
                      }}
                    >
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
                        <ButtonRowWrap>
                          {showButtons && (
                            <>
                              <Button onClick={() => handleEditEvent(event)}>
                                <AnimatedFontAwesomeIcon
                                  icon={faPenToSquare}
                                ></AnimatedFontAwesomeIcon>
                              </Button>
                              <Button
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <AnimatedFontAwesomeIcon
                                  icon={faTrashCan}
                                ></AnimatedFontAwesomeIcon>
                              </Button>
                            </>
                          )}
                          <MoreButton onClick={handleToggleButtons}>
                            <AnimatedFontAwesomeIcon
                              icon={faEllipsisH}
                            ></AnimatedFontAwesomeIcon>
                          </MoreButton>
                        </ButtonRowWrap>
                      </ColumnWrap>
                    </EventBox>
                    {/* <EventDot
                      style={{
                        alignSelf: 'center',
                      }}
                    /> */}
                  </EventWrap>
                );
              })}
          </EventContainer>
          {isEditing ? (
            <EditEventForm event={editedEvent} onEdit={handleEditFormSubmit} />
          ) : (
            <form onSubmit={handleNewEventSubmit} />
          )}
        </ContentWrapper>
        <Header>CONTINUED ON</Header>
        <LoadingAnimation />
      </Wrapper>
    </Container>
  );
}

export default Milestone;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  width: 100%;
  align-items: center;
  position: relative;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  padding: 20px;
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
  top: 20%;
  color: #fff;
`;

const Header = styled.h1`
  margin-top: 50px;
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #00ffcc;
  border: 3px solid #00ffcc;
  border-radius: 25px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
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
  flex-direction: column;
  overflow-x: scroll;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  -webkit-overflow-scrolling: touch;

  /* Style the scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3467a1;
    border-radius: 58px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #3467a1;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background-color: transparent;
    background-image: linear-gradient(
      to bottom,

      #2e9f42,
      #b98bfb
    );
    transform: translateX(-50%);
  }
`;

const EventBox = styled.div`
  width: auto;
  max-height: 400px;

  margin-right: 20px;
  border-radius: 20px;
  transition: box-shadow 0.5s ease-in-out;
  display: flex;
  background-color: white;
  justify-content: space-between;
  margin: 10px;

  position: relative;
  box-shadow: 3px 3px 5px black; /* added box shadow */
  &:hover {
    box-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 40px #00ffcc; /* added glow effect */
    transform: scale(1.05);
  }
`;
const EventTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  margin-right: 5px;
  margin-left: 5px;
  color: #3467a1;
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
  justify-content: center;
  align-items: space-between;

  right: 0;
`;

const ButtonRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  position: absolute;
  right: 0;
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const DateBox = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  background-color: #fff;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 20%;
  bottom: 45px; /* changed top property to bottom */
  left: 10px;
  padding: 5px;
`;

const Button = styled(DefaultButton)`
  margin: 10px;
  border: 3px solid #f5f5f5;
`;

const MoreButton = styled(DefaultButton)`
  margin: 10px;
  color: #fff;
  padding: 5px;
  height: 20px;
  box-shadow: none;
  background-color: transparent;
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
  height: 200px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
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

export const GradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0px;
  background-color: transparent;
  width: 100vw;
  height: 100%;
  border: 3px solid gold;
  background: linear-gradient(
    -45deg,
    #3467a1,
    #555555,
    #1034a6,
    #1b4d3e,
    #1034a6,
    #ff69b4
  );
  background-size: 300% 300%;

  animation: ${GradientAnimation} 20s ease-in-out infinite;
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

const TimelineContainer = styled.div`
  position: relative;
`;
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 #00ffcc;
  }
  70% {
    box-shadow: 0 0 0 15px rgba(0, 255, 204, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 204, 0);
  }
`;

const Dot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #00ffcc;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.5s ease-in-out;
  box-shadow: 0 0 5px black, 0 0 10px #00ffcc, 0 0 15px #00ffcc,
    0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc,
    0 0 70px rgba(0, 255, 204, 0.4), 0 0 80px rgba(0, 255, 204, 0.4),
    0 0 100px rgba(0, 255, 204, 0.4), 0 0 150px rgba(234, 255, 204, 0.4);

  animation: ${pulse} 2s ease-in-out infinite;
`;

const DateText = styled.div`
  margin-left: 20px;
  font-size: 16px;
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 12px;
  bottom: 12px;

  left: 11px;
  right: 0;
  border-left: 2px solid #aaa;
`;

const EventWrap = styled.div`
  position: relative;
`;
