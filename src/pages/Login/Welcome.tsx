import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../config/Context/authContext';
import { auth } from '../../config/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignIn from '../../Components/Login/SignIn';
import LogOut from '../../Components/Login/LogOut';
import styled, { keyframes } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import aiImage from './ai.png';
import cart from './cart.png';
import gallery from './gallery.png';
import message from './message.png';
// import { color, backgroundColor } from '../../theme';
import { NavList, NavItem } from '../../Components/Nav/Navbar';
import { db, storage } from '../../config/firebase.config';
import 'firebase/firestore';
import firebase from 'firebase/app';
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
import UserAuthData from '../../Components/Login/Auth';
import checkIfUserExists from '../../Components/Login/Auth';
import DefaultButton from '../../Components/Button/Button';
import LoadingAnimation from '../../Components/loading';
const { v4: uuidv4 } = require('uuid');

const CardContainer = styled.div`
  height: 300px;
  width: 250px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 12px;
  -webkit-border-radius: 12px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  margin: 10px;
  padding: 20px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #1e3d6b;
  font-family: 'Braah One';
`;

const CardImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  text-align: center;
  margin-top: 10px;
`;

type CardProps = {
  title: string;
  imageSrc: string;
  altText: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, imageSrc, altText, children }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardImage src={imageSrc} alt={altText} />
      <CardText>{children}</CardText>
    </CardContainer>
  );
};

function WelcomePage() {
  const {
    user,
    userName,
    googleAvatarUrl,
    userEmail,
    hasSetup,
    hasCreateFamily,
    setHasCreateFamily,
    handleFamilyCreate,
  } = UserAuthData();
  // const { user, userEmail, hasSetup, familyId, membersArray } =
  //   useContext(AuthContext);
  // const [loggedfamilyId, setLoggedFamilyId] = useState<string | null>(null);
  const familyId: string = uuidv4();

  console.log('user', user);
  console.log('hasSetup', hasSetup);
  console.log('hasCreateFamily', hasCreateFamily);
  if (hasSetup === true) {
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  }

  return (
    <Container>
      {user ? (
        <>
          {hasSetup ? (
            <Wrap>
              {/* <ColumnWrap> */}
              {/* <RowWrap>
                  <LinkButton to="/dashboard">Straight to Dashboard</LinkButton>
                </RowWrap>
                <ColumnWrap>
                  <RowWrap>
                    <Wording>or,</Wording>
                    <LinkButton to="/ai">
                      Ask anything about your family!
                    </LinkButton>
                  </RowWrap>
                </ColumnWrap> */}
              {/* </ColumnWrap> */}

              <Section style={{ backgroundColor: 'transparent' }}>
                <h1 style={{ color: '#5981b0', fontFamily: 'Braah One' }}>
                  Welcome home, {userName}!
                </h1>
                <p style={{ color: '#5981b0' }}>
                  Hang on, your dashboard is loading.
                </p>
              </Section>
            </Wrap>
          ) : (
            <>
              {/* <LoadingAnimation /> */}
              <WelcomeSection>
                <h2 style={{ marginTop: '300px' }}>
                  Two step away from finishing setup.
                </h2>
                {hasCreateFamily ? (
                  <LinkButton to="/family" style={{ fontSize: '28px' }}>
                    Family members setup
                  </LinkButton>
                ) : (
                  <LinkButton
                    onClick={() =>
                      handleFamilyCreate(userName, userEmail, familyId)
                    }
                    style={{ fontSize: '28px' }}
                  >
                    Create your family
                  </LinkButton>
                )}
              </WelcomeSection>
            </>
          )}
        </>
      ) : (
        <Section style={{ backgroundColor: 'transparent' }}>
          <h1 style={{ color: '#5981b0', fontFamily: 'Braah One' }}>
            Welcome to EVERYDAY!
          </h1>
          <p
            style={{
              color: '#5981b0',
              fontFamily: 'Braah One',
              fontSize: '24px',
            }}
          >
            Your everyday family assistant !
          </p>
          <SignIn />
        </Section>
      )}

      {!user && (
        <>
          <CurveSection style={{ height: 'auto' }}>
            {/* <NavLink to="/family">{googleAvatarUrl}</NavLink> */}

            <h1 style={{ fontFamily: 'Braah One' }}>
              Arrange your family with ease
            </h1>
            {/* <p>Love in a family is like a flame.</p>
            <p>
              The more it is fueled by kindness and care, the warmer and
              stronger it grows.
            </p> */}
            <RowWrap>
              <Card title="Get things done" imageSrc={cart} altText="GTD">
                Organize your tasks with ease. Keep track of deadlines and
                delegate tasks efficiently with our intuitive task management
                system.
              </Card>
              <Card title="Smart input" imageSrc={aiImage} altText="AI">
                Our AI-powered input system predicts your text, saving you time
                and hassle. With GPT integration, you can get insights and ask
                questions about your family's events.
              </Card>
              <Card
                title="Communicate"
                imageSrc={message}
                altText="Communicate"
              >
                Stay connected with your loved ones in real-time using our
                messaging system. Keep each other updated, and add a personal
                touch with our fun doodle board.
              </Card>
              <Card title="Memories" imageSrc={gallery} altText="Memories">
                Capture and relive life's precious moments with our built-in
                photo gallery. Organize by event or date, and celebrate
                milestones with ease.
              </Card>
            </RowWrap>
          </CurveSection>

          <CurveSection>
            <h1 style={{ fontFamily: 'Braah One', color: '#3467a1' }}>
              Can't wait? Login in seconds!
            </h1>
            {/* <NavLink to="/family">{googleAvatarUrl}</NavLink> */}
            <SignIn />
          </CurveSection>

          {/* <CircleButton></CircleButton> */}
        </>
      )}
      {/* <LoadingAnimation /> */}
    </Container>
  );
}

const WelcomeMessage = styled.h1`
  text-align: center;
  margin: auto;

  font-weight: bold;
  color: white;

  flex: 1;
`;

const WelcomeSubMessage = styled.h1`
  text-align: center;
  margin: auto;
  font-size: 28px;
  font-weight: bold;
  color: white;

  flex: 1;
`;

export const GradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  
`;

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  padding-top: 70px;
  background: transparent;
  max-width: 100vw;
  //  border: 2px solid #5981b0;
`;

const WelcomeSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  max-width: 100vh;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
`;

const BubbleSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  padding-top: 100px;
  background: #1e3d6b;
  max-width: 100vw;
`;

const CurveSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  padding-top: 90px;
  padding-bottom: 80px;
  background: transparent;
  margin-top: 20px;
`;

const Curve = styled.div`
  position: absolute;
  height: 200px;
  width: 100%;
  bottom: 0;
  text-align: center;
`;

// const Card = styled.div`
//   height: 200px;
//   width: 200px;
//   background-color: rgba(255, 255, 255, 0.25);
//   backdrop-filter: blur(6px);
//   -webkit-backdrop-filter: blur(6px);
//   border: 1px solid rgba(255, 255, 255, 0.18);
//   box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
//   -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
//   border-radius: 12px;
//   -webkit-border-radius: 12px;
//   color: rgba(255, 255, 255, 0.75);
//   text-align: center;
//   margin: 10px;
//   padding: 10px;
// `;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 70px;
  /* background: linear-gradient(
    45deg,
    white,
    #fff5c9,
    #9bb9de,
    #629dda,
    #ff9f4d,
    #142850
  ); */

  flex-direction: column;
  justify-content: center;
  //animation: ${GradientAnimation} 20s ease-in-out infinite;
  //background-size: 200% 500%;
`;

const CircleButton = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%; /* half of width or height */
  background-color: #3467a1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
  margin: auto;
  &:hover {
    transform: scale(1.1);
  }
`;

const ColumnWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  margin: auto;
`;

const Wrap = styled.div`
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
`;

const Slogan = styled.h2`
  color: white;
  background-color: #629dda;
  border-radius: 5px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  padding: 5px;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: auto;
  &:hover {
    transform: scale(1.1);
  }
  border: 6px solid #629dda;
`;

const LinkButton: any = styled(Link)`
  background-color: transparent;
  color: #414141;
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 28px;
  font-weight: bold;
  margin: auto;
  z-index: 3;
  &:hover {
    transform: scale(1.05);
  }
`;

const Wording = styled.div`
  background-color: transparent;
  color: #f6f8f8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw;
  font-weight: bold;
  margin: auto;
`;

const AiInput = styled.input`
  min-width: 500px;
  height: 60px;
  margin: 50px auto;
  padding: 5px;
  border: none;
  border-radius: 25px;
  font-size: 2.5vw;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #629dda;
  }
`;

const ConfirmButton = styled(DefaultButton)`
  background-color: blue;
  color: white;
`;

const CancelButton = styled(DefaultButton)`
  background-color: white;
  color: blue;
`;

const EditButton = styled(DefaultButton)`
  background-color: gray;
  color: white;
`;

const NavLink = styled(Link)``;

export default WelcomePage;
