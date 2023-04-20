import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebase.config';
import 'firebase/firestore';
import {
  collection,
  updateDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth } from '../../config/firebase.config';
const { v4: uuidv4 } = require('uuid');
const UserAuthData = () => {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState<string | null>(null);
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasSetup, setHasSetup] = useState<boolean>(false);
  const [hasCreateFamily, setHasCreateFamily] = useState<boolean>(false);
  const [familyId, setFamilyId] = useState<string>('');
  useEffect(() => {
    async function checkIfUserExists() {
      if (user) {
        setUserName(user.displayName);
        setGoogleAvatarUrl(user.photoURL);
        setUserEmail(user.email);
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
        const querySettingStatus = where('isSettingDone', '==', true);
        const queryFamily = query(familyCollection, queryUser);
        // const familyDocSnapshot = await getDoc(queryUser);

        // if (familyDocSnapshot.exists()) {
        //   console.log('familyDocSnapshot exists');
        //   const familyData = familyDocSnapshot.data();
        //   setFamilyId(familyData.familyId);
        // } else {
        //   console.log(`No document found with ID ${familyId}`);
        // }

        try {
          const matchingDocs = await getDocs(
            query(familyCollection, queryUser)
          );
          console.log('Matching documents:', matchingDocs.docs);
          matchingDocs.docs.forEach((doc) => {
            console.log(`Document ID: ${doc.id}`);
            setFamilyId(doc.id);
            console.log(`Document data:`, doc.data());
          });
          //get members
          const querySnapshot = await getDocs(queryFamily);
          const members = querySnapshot.docs[0];
          console.log(members);
          
          const familySettings = await getDocs(
            query(familyCollection, queryUser)
          );

          const memberRefs = await getDocs(query(familyCollection, queryUser));

          familySettings.docs.forEach((doc) => {
            console.log(`Document ID: ${doc.id}`);
            // setFamilyId(doc.id);
            console.log(`Document isSettingDone:`, doc.data().isSettingDone);
            setHasSetup(doc.data().isSettingDone);
          });

          if (matchingDocs.size > 0) {
            // Either no document with the user's email address exists or family settings are already done

            setHasCreateFamily(true);
            console.log('Set hasSetup to false');
            console.log(matchingDocs.size);
            console.log(familySettings);
          } else {
            // Either no document with the user's email address exists or family settings are already done
            setHasSetup(false);
            console.log('Set hasSetup to false');
            console.log(matchingDocs.size);
            console.log(familySettings);
          }
          //   const familyIds = matchingDocs.docs.map((doc) => doc.id);
          //   console.log('Family IDs:', familyIds);

          //   setHasCreateFamily(true);
          console.log('Set hasCreateFamily to true');
        } catch (error) {
          console.error('Error getting documents:', error);
        }
      }
    }

    checkIfUserExists();
  }, [userEmail]);

  const handleFamilyCreate = async (
    userName: string,
    userEmail: string,
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
      setFamilyId(familyId); // Save the familyId in the state
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
  };
};

export default UserAuthData;
