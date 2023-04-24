import styled from 'styled-components/macro';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase.config';

const UserAvatar = () => {
  const [user] = useAuthState(auth);
  const userName = user ? user.displayName : null;
  const avatarUrl = user ? user.photoURL : null;
  return <>{avatarUrl && <Avatar src={avatarUrl} alt="" />}</>;
};

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  margin: auto;
  &:hover {
    transform: scale(1.1);
  }
  border: 3px solid white;
`;

export default UserAvatar;
