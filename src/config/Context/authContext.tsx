import { createContext, useState } from 'react';
import { ReactNode } from 'react';
import GoogleButton from 'react-google-button';
import { auth } from '../../config/firebase.config';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import UserAuthData from '../../Components/Login/Auth';
import React from 'react';
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
    userEmail,
    hasSetup,
    setHasSetup,
    familyId,
    memberRolesArray,
    membersArray,
  } = UserAuthData();
  
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
