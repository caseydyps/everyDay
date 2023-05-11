import 'firebase/firestore';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import UserAuthData from '../../Components/Login/Auth';
import SignIn from '../../Components/Login/SignIn';
import aiImage from './ai.png';
import cart from './cart.png';
import gallery from './gallery.png';
import message from './message.png';
import { Card } from '../../Components/Card/Card';
const { v4: uuidv4 } = require('uuid');

function WelcomePage() {
  const {
    user,
    userName,
    userEmail,
    hasSetup,
    hasCreateFamily,
    handleFamilyCreate,
  } = UserAuthData();
  const familyId: string = uuidv4();
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
            <h1 style={{ fontFamily: 'Braah One' }}>
              Arrange your family with ease
            </h1>
            <RowWrap>
              <Card title="Get things done" imageSrc={cart} altText="GTD">
                Say goodbye to chaos and hello to productivity with our family
                task management system.
              </Card>
              <Card title="Smart input" imageSrc={aiImage} altText="AI">
                Our AI input system and GPT integration make event planning a
                breeze
              </Card>
              <Card
                title="Communicate"
                imageSrc={message}
                altText="Communicate"
              >
                Chat, draw, and share memories with our real-time messaging
                system and interactive doodle board
              </Card>
              <Card title="Memories" imageSrc={gallery} altText="Memories">
                Relive life's moments with our photo gallery. Organize and
                celebrate milestones effortlessly.
              </Card>
            </RowWrap>
          </CurveSection>
          <CurveSection>
            <h1 style={{ fontFamily: 'Braah One', color: '#3467a1' }}>
              Can't wait? Login in seconds!
            </h1>
            <SignIn />
          </CurveSection>
        </>
      )}
    </Container>
  );
}

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  padding-top: 70px;
  background: transparent;
  max-width: 100vw;
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

export const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 70px;
  flex-direction: column;
  justify-content: center;
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

export default WelcomePage;