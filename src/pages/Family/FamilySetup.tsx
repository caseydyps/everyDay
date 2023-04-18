import FamilyMemberForm from './FamilyForm';
import UserAuthData from '../../Components/Login/Auth';

const FamilySetup = () => {
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    hasCreateFamily,
  } = UserAuthData();
  //   console.log('user', user);
  console.log('hasSetup', hasSetup);
  return <FamilyMemberForm />;
};

export default FamilySetup;
