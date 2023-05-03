import { createContext, useState, useEffect, useCallback } from 'react';
import React, { ReactNode } from 'react';
import GoogleButton from 'react-google-button';
import { auth } from '../../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import UserAuthData from '../../Components/Login/Auth';

type AuthContextType = {
  isLogin: boolean;
  user: {
    name: string;
    image: string;
    role: string;
    email: string;
    userUID: string;
  };
  loading: boolean;
  userEmail: string | null;
  hasSetup: boolean;
  login: () => void;
  logout: () => void;
  familyId: string;
  memberRolesArray: string[];
  membersArray: any;
  setHasSetup: any;
};

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  user: {
    name: '',
    image: '',
    role: '',
    email: '',
    userUID: '',
  },
  userEmail: '',
  loading: false,
  hasSetup: false,
  login: () => {},
  logout: () => {},
  familyId: '',
  memberRolesArray: [],
  membersArray: [],
  setHasSetup: () => {},
});

const style = {
  wrapper: `flex justify-center`,
};

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const SignIn = () => {
  return (
    <div className={style.wrapper}>
      <GoogleButton onClick={googleSignIn} />
    </div>
  );
};

export default SignIn;

type User = {
  name?: string | null;
  image?: string;
  role?: string;
  email?: string | null;
  userUID?: string;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const {
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    setHasSetup,
    hasCreateFamily,
    familyId,
    memberRolesArray,
    membersArray,
    setHasCreateFamily,
    handleFamilyCreate,
  } = UserAuthData();
  //   const handleLoginResponse = useCallback(async (response) => {
  //     const result = await getRedirectResult(auth);
  //     const user = result.user;
  //     if (user) {
  //       const { displayName, photoURL, email, uid } = user;
  //       setUser({
  //         name: displayName,
  //         image: photoURL,
  //         email: email,
  //         userUID: uid,
  //       });
  //       setIsLogin(true);
  //     }
  //     setLoading(false);
  //   }, []);

  //   useEffect(() => {
  //     handleLoginResponse();
  //   }, [handleLoginResponse]);

  const login = async () => {
    console.log('login');
    googleSignIn();
  };

  const logout = async () => {
    await signOut(auth);
    setIsLogin(false);
    setUser({});
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        loading,
        login,
        logout,
        familyId,
        userEmail,
        hasSetup,
        memberRolesArray,
        membersArray,
        setHasSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
