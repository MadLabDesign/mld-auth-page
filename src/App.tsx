import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(awsconfig);
function App() {
  return (
    <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Hello {user?.username}</h1>
        <button onClick={signOut}>Sign out</button>
      </main>
    )}
  </Authenticator>
  );
}

export default withAuthenticator(App);
