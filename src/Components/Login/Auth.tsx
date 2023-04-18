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
  query,
  where,
} from 'firebase/firestore';
import { auth } from '../../config/firebase.config';

const UserAuthData = () => {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = useState<string | null>(null);
  const [googleAvatarUrl, setGoogleAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasSetup, setHasSetup] = useState<boolean>(false);
  const [hasCreateFamily, setHasCreateFamily] = useState<boolean>(false);

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
        const matchingDocs = await getDocs(query(familyCollection, queryUser));
        const familySettings = await getDocs(
          query(familyCollection, querySettingStatus)
        );

        if (matchingDocs.size > 0 && familySettings.size > 0) {
          // A document with the user's email address exists and family settings are not yet done
          setHasSetup(true);
        } else {
          // Either no document with the user's email address exists or family settings are already done
          setHasSetup(false);
        }
        setHasCreateFamily(true);
      }
    }

    checkIfUserExists();
  }, [userEmail]);

  return {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    hasCreateFamily,
    setHasCreateFamily,
  };
};

export default UserAuthData;
