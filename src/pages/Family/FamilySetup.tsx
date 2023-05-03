import FamilyMemberForm from './FamilyForm';
import UserAuthData from '../../Components/Login/Auth';
import { AuthContext } from '../../config/Context/authContext';
import { useContext } from 'react';
const FamilySetup = () => {
  // const {
  //   user,
  //   userName,
  //   googleAvatarUrl,
  //   userEmail,
  //   hasSetup,
  //   hasCreateFamily,
  // } = UserAuthData();
  const { user, userEmail, hasSetup, familyId, membersArray } =
    useContext(AuthContext);
  //   console.log('user', user);
  console.log('hasSetup', hasSetup);
  return <FamilyMemberForm />;
};

export default FamilySetup;
