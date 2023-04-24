import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components/macro';
import { LoadButton } from '../../Components/Button/Button';
import UserAuthData from '../../Components/Login/Auth';
import { db } from '../../config/firebase.config';
import {
  collection,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import UserAvatar from '../../Components/Nav/Avatar';

const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isSent ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  height: 50px;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ isSent }) =>
    isSent ? '20px 20px 5px 20px' : '20px 20px 20px 0'};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: ${(props) =>
    props.isSent
      ? '#90CAF9'
      : 'linear-gradient(rgb(255, 143, 178) 0%, rgb(167, 151, 255) 50%, rgb(0, 229, 255) 100%)'};
  color: ${(props) => (props.isSent ? 'white' : 'black')};
  backdrop-filter: blur(8px);
  ${({ isSent }) =>
    isSent
      ? `
  margin-left: auto;
  margin-right: 0;
  `
      : `
  margin-left: 0;
  margin-right: auto;
  position: relative;
  `}
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the child element horizontally */
  align-items: center; /* Center the child element vertically */
`;

const SenderName = styled.p`
  margin-top: 0px;
  color: #142850;
  font-size: 0.8rem;
`;

interface MessageProps {
  message: {
    uid: string;
    name: string;
    text: string;
    timestamp: Date;
  };
}

interface MessageBubbleProps {
  isSent: boolean;
}

interface Props {
  message: MessageType;
  isSent: boolean;
}

interface MessageType {
  uid: string;
  name: string;
  text: string;
  timestamp: any;
  avatarUrl: string;
  avatar: string;
  email: string;
}

const Message: any = ({ message }: Props) => {
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    familyId,
    setHasSetup,
  } = UserAuthData();
  const isSent = message.uid === auth.currentUser?.uid;

  const date = message.timestamp && message.timestamp.toDate();

  const [members, setMembers] = useState<any[]>([]);
  const formatDate = (date: Date) => {
    if (!date || !date.getMonth) {
      return '';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day} ${hour}:${minute}`;
  };

  useEffect(() => {
    const fetchMembers = async () => {
      console.log(familyId);
      const familyDocRef = collection(db, 'Family', familyId, 'members');
      const membersData: any = await getDocs(familyDocRef)
        .then((querySnapshot) =>
          querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        )
        .catch((error) =>
          console.error('Error retrieving members data:', error)
        );
      console.log(membersData);
      setMembers(membersData);
    };
    fetchMembers();
  }, [familyId]);

  console.log(formatDate(date));

  type Member = {
    email: string;
    role: string;
    avatar: string;
  };

  return (
    <Wrapper>
      <MessageContainer>
        {isSent ? null : (
          <Avatar
            src={
              members.find((member: any) => member.email === message.email)
                ?.avatar
            }
            alt=""
          />
        )}

        <MessageBubble isSent={isSent}>
          {isSent ? null : (
            <SenderName>
              {members.find((member) => member.email === message.email)?.role}
            </SenderName>
          )}

          <p>{message.text}</p>
          <Time isSent={isSent}>{formatDate(date)}</Time>
        </MessageBubble>
      </MessageContainer>
    </Wrapper>
  );
};

const MessageContainer = styled.div`
  margin: 10 auto;
  // overflow: auto;
  display: flex;
  justify-content: center; // Center the container horizontally
  align-items: center; // Center the container vertically
  width: 80%;
  height: 100%;
  padding: 10px;
`;

const Time = styled.p<MessageBubbleProps>`
  font-size: 0.5rem;
  margin-bottom: 0;
  color: #777;
  position: absolute;
  bottom: -20px;
  right: ${({ isSent }) => (isSent ? '0px' : 'auto')};
  width: 100px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: -50px;
`;

export default Message;
