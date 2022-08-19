import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import styled from 'styled-components';
Amplify.configure(awsconfig);
function App() {
  return (
    <Authenticator>
    {({ signOut, user }) => (
      <Main>
        <h1>Hello {user?.username}</h1>
        <button onClick={signOut}>Sign out</button>
      </Main>
    )}
  </Authenticator>
  );
}

export default withAuthenticator(App);

const Main = styled.main`
background-color: red ;
`