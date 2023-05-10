import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../config/Context/authContext';
import { auth } from '../../config/firebase.config';
import styled from 'styled-components/macro';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';

const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isSent ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  height: 40px;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  padding: 5px 10px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
  border-radius: ${({ isSent }) =>
    isSent ? '20px 20px 5px 20px' : '20px 20px 20px 0'};
  background-color: ${(props) =>
    props.isSent
      ? '#5981b0'
      : 'linear-gradient(rgb(255, 143, 178) 0%, rgb(167, 151, 255) 50%, rgb(0, 229, 255) 100%)'};
  color: ${(props) => (props.isSent ? '#F6F8F8' : '#414141')};
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
  justify-content: center;
  align-items: center;
`;

const SenderName = styled.p`
  margin-top: 0px;
  color: #142850;
  font-size: 12px;
  position: absolute;
  left: -37px;
`;

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
  const { familyId } = useContext(AuthContext);
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
      const familyDocRef = collection(db, 'Family', familyId, 'members');
      const membersData: any = await getDocs(familyDocRef)
        .then((querySnapshot) =>
          querySnapshot.docs.map((doc) => ({ ...doc.data() }))
        )
        .catch((error) =>
          console.error('Error retrieving members data:', error)
        );
      setMembers(membersData);
    };
    fetchMembers();
  }, [familyId]);


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
  display: flex;
  justify-content: center; 
  align-items: center; 
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
  right: ${({ isSent }) => (isSent ? '-20px' : 'auto')};
  width: 100px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: -50px;
`;

export default Message;
