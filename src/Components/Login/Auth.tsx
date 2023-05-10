import 'firebase/firestore';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase.config';
const { v4: uuidv4 } = require('uuid');
const UserAuthData = () => {
  const [user] = useAuthState(auth);
  console.log(user);
  const [userName, setUserName] = useState<string | null>(null);
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasSetup, setHasSetup] = useState<boolean>(false);
  const [hasCreateFamily, setHasCreateFamily] = useState<boolean>(false);
  const [membersArray, setMembersArray] = useState<any>([]);
  const [memberRolesArray, setMemberRolesArray] = useState<string[]>([]);
  const [familyId, setFamilyId] = useState<string>('');
  useEffect(() => {
    async function checkIfUserExists() {
      if (user) {
        setUserName(user.displayName);
        setGoogleAvatarUrl(user.photoURL);
        setUserEmail(user.email);
        console.log(user);
      }
    }

    checkIfUserExists();
  }, [user]);

  useEffect(() => {
    async function checkIfUserExists() {
      console.log('userEmail' + userEmail);
      if (userEmail) {
        console.log('here');
        const familyCollection = collection(db, 'Family');
        const queryUser = where('familyMembers', 'array-contains', {
          userEmail: userEmail,
        });
        const queryFamily = query(familyCollection, queryUser);

        try {
          const matchingDocs = await getDocs(
            query(familyCollection, queryUser)
          );

          matchingDocs.docs.forEach((doc) => {
            setFamilyId(doc.id);
          });
          const querySnapshot = await getDocs(queryFamily);
          const members = querySnapshot.docs[0];

          const familySettings = await getDocs(
            query(familyCollection, queryUser)
          );

          familySettings.docs.forEach((doc) => {
            setHasSetup(doc.data().isSettingDone);
          });

          if (matchingDocs.size > 0) {
            setHasCreateFamily(true);
          } else {
            setHasSetup(false);
          }
        } catch (error) {
          console.error('Error getting documents:', error);
        }
      }
    }

    checkIfUserExists();
  }, [userEmail]);

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
      type Member = (typeof membersData)[number];
      const memberRoles = membersData.map((member: Member) => member.role);
      setMembersArray(membersData);
      setMemberRolesArray(memberRoles);
    };
    fetchMembers();
  }, [familyId]);

  const handleFamilyCreate = async (
    userName: string | null,
    userEmail: string | null,
    familyId: string
  ) => {
    console.log(familyId);
    const familyDocRef = doc(db, 'Family', familyId);
    const familyData = {
      familyId: familyId,
      familyMembers: [{ userEmail }],
      isSettingDone: false,
    };

    try {
      await setDoc(familyDocRef, familyData);
      console.log('Family created successfully!');
      setHasCreateFamily(true);
      setFamilyId(familyId); 
    } catch (error) {
      console.error('Error creating family:', error);
      alert('Failed to create family. Please try again.');
    }
  };

  return {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    hasCreateFamily,
    setHasCreateFamily,
    familyId,
    handleFamilyCreate,
    setHasSetup,
    membersArray,
    memberRolesArray,
  };
};

export default UserAuthData;
