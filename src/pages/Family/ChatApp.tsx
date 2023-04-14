import React from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import SmartInput from '../AI/SmartInput';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';

const style = {
  appContainer: `max-w-[728px] mx-auto text-center`,
  sectionContainer: `flex flex-col h-[90vh] bg-gray-100 mt-10 shadow-xl border relative`,
};

function ChatApp() {
  const [user] = useAuthState(auth);
  //  console.log(user)
  return (
    <div className={style.appContainer}>
      <section className="{style.sectionContainer}">
        {/* Navbar */}
        <Navbar />
        {user ? <Chat /> : null}
        <SmartInput />
      </section>
    </div>
  );
}

export default ChatApp;
