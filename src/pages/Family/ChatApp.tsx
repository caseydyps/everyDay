import React from 'react';
import Navbar from './Navbar';
import Chat from './Chat';
import SmartInput from '../AI/SmartInput';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from '../../Components/layout';


function ChatApp() {
  const [user] = useAuthState(auth);
  //  console.log(user)
  return (
    <Layout>
      <div>
        <section>
          {/* Navbar */}
          <Navbar />
          {user ? <Chat /> : null}
          <SmartInput />
        </section>
      </div>
    </Layout>
  );
}

export default ChatApp;
