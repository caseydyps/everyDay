import {
  faCircleXmark,
  faEllipsisH,
  faFilter,
  faPenToSquare,
  faPlus,
  faPlusCircle,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'firebase/firestore';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import Banner from '../../Components/Banner/Banner';
import DefaultButton, { ThreeDButton } from '../../Components/Button/Button';
import SideNav from '../../Components/Nav/SideNav';
import LoadingAnimation from '../../Components/loading';
import { AuthContext } from '../../config/Context/authContext';
import { db } from '../../config/firebase.config';
import { MembersSelector } from '../../Components/Selectors/MemberSelector';
import { ChatToggle } from '../../Components/Chat/ChatToggle';
import React from 'react';
function Milestone() {
  type EventType = {
    id: number;
    title: string;
    date: Date;
    member: string;
    image: string | null;
  };

  const { familyId, membersArray } = useContext(AuthContext);
  const [events, setEvents] = useState<EventType[]>([]);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDate, setNewEventDate] = useState<string>('');
  const [newEventMember, setNewEventMember] = useState<string>(
    membersArray.length > 0 ? membersArray[0].role : ''
  );
  const [newEventImage, setNewEventImage] = useState<Blob | MediaSource | null>(
    null
  );
  const MAX_FILE_SIZE = 1048487;
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventType | null>(null);
  const [file, setFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<ImageType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
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
    if (!newEventTitle || !newEventDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
        background: '#F6F8F8',
        confirmButtonColor: '#5981b0',
      });
      return;
    }

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
      setEvents((prevEvents: any) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Error adding new event to Firestore: ', error);
    }
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventMember('');
    setNewEventImage(null);
    setShowAddEvent(false);
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
    try {
      await deleteDoc(doc<any>(db, 'Family', familyId, 'Milestone', id));
      setEvents(events.filter((event) => event.id !== id));
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
      if (!title || !date || !member) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all required fields!',
        });
        return;
      }
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
      <Wrap>
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
            ></FormInput>
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
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Button
            type="submit"
            disabled={!date}
            title="Please fill in all required fields"
            style={{
              cursor: !date ? 'not-allowed' : 'pointer',
            }}
          >
            Save
          </Button>
        </form>
      </Wrap>
    );
  };

  useEffect(() => {
    async function fetchData() {
      const familyDocRef = collection(db, 'Family', familyId, 'Milestone');
      try {
        const querySnapshot = await getDocs(familyDocRef);
        const data: any = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }
    }

    fetchData();
  }, [familyId]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const handleToggleFilter = (): void => {
    setShowFilter(!showFilter);
    if (showAddEvent) {
      toggleAddEvent();
    }
  };

  const handlefilterSelectMember = (member: string | string[]) => {
    setFilter({ ...filter, member: member });
  };

  const [showAddEvent, setShowAddEvent] = useState<boolean>(false);
  const toggleAddEvent = (): void => {
    setShowAddEvent(!showAddEvent);
    if (showFilter) {
      setShowFilter(!showFilter);
    }
  };

  const [eventWrapWidth, setEventWrapWidth] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const alertMaxFileSize = () => {
    Swal.fire({
      icon: 'warning',
      text: 'Please upload an image that is smaller than 1MB.',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        alertMaxFileSize();
        event.target.value = ''; // clear the input field
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const fileUrl = reader.result as string;
          setFile(fileUrl);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  return (
    <Container>
      <SideNav></SideNav>
      <Wrapper>
        <ChatToggle />
        <Banner title="Time Machine" subTitle="Time less memories"></Banner>
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
              <>
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
                  <FormSelection
                    value={newEventMember}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewEventMember(e.target.value)
                    }
                  >
                    <option value="">Select member</option>
                    {membersArray.map((member: any, index: number) => (
                      <option key={index} value={member.role}>
                        {member.role}
                      </option>
                    ))}
                  </FormSelection>
                </FormField>
                <FormField>
                  <FormLabel>Image:</FormLabel>

                  {imagePreview ? (
                    <AvatarPreview src={imagePreview} alt="Preview" />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  )}
                </FormField>
              </>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <Button
                style={{ position: 'absolute', bottom: '25px', right: '150px' }}
                type="submit"
              >
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
                    onLayout={(event: any) =>
                      setEventWrapWidth(event.nativeEvent.layout.width)
                    }
                  >
                    <Dot
                      eventWrapWidth={eventWrapWidth}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: index % 2 === 0 ? `50%` : `50%`,
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
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 30px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const Wrap = styled.div`
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  width: 700px;
  padding: 20px;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-around;
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #414141;
`;

const Header = styled.h1`
  margin-top: 50px;
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 200px;
  color: #3467a1;
  border: 3px solid #3467a1;
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
      rgba(52, 103, 161, 0.5),
      #1e3d6b
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
  &:hover {
    box-shadow: 0 0 10px #f6f8f8, 0 0 20px #f6f8f8, 0 0 40px #f6f8f8;
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
  bottom: 45px;
  left: 10px;
  padding: 5px;
`;

const Button = styled(ThreeDButton)`
  margin: 5px;
  padding: 10px;
  border-radius: 25px;
  border: 2px solid #5981b0;
  background-color: #5981b0;
  color: #f6f8f8;
  :hover {
    background-color: #3467a1;
  }
`;

const MoreButton = styled(DefaultButton)`
  margin: 10px;
  color: #fff;
  padding: 5px;
  height: 20px;
  box-shadow: none;
  border: none;
  background-color: transparent;
`;
const CancelButton = styled(DefaultButton)`
  margin: 10px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: transparent;
  font-size: 20px;
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

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  width: 400px;
`;

const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  margin-top: 20px;
`;

const FormInput: any = styled.input`
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  width: 150px;
`;

const FormSelection: any = styled.select`
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  width: 150px;
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
`;

const AnimatedFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
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

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 #3467a1;
  }
  70% {
    box-shadow: 0 0 0 15px rgba(0, 255, 204, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 204, 0);
  }
`;
type Dot = {
  eventWrapWidth: any;
};

const Dot = styled.div<Dot>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3467a1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.5s ease-in-out;
  box-shadow: 0 0 5px black, 0 0 10px #3467a1, 0 0 15px #3467a1,
    0 0 20px #3467a1, 0 0 30px #3467a1, 0 0 40px #3467a1, 0 0 70px #3467a1,
    0 0 80px #3467a13a, 0 0 100px #3467a110, 0 0 150px #3467a15f;

  animation: ${pulse} 2s ease-in-out infinite;
`;

type EventWrapType = {
  onLayout?: (event: Event) => void;
};

const EventWrap = styled.div<EventWrapType>`
  position: relative;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 8px;
  width: 100%;
`;
