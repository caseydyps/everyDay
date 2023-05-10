import FamilyMemberForm from './FamilyForm';
import { AuthContext } from '../../config/Context/authContext';
import { useContext } from 'react';
const FamilySetup = () => {
  const {hasSetup } =
    useContext(AuthContext);
  console.log('hasSetup', hasSetup);
  return <FamilyMemberForm />;
};

export default FamilySetup;
