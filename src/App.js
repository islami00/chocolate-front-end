import React, { useState, createRef } from 'react';
import { Sticky, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
// substrate imports
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';
// stock components
import AccountSelector from './AccountSelector';

// custom components
import { Loading } from './customComponents/loading';
import { Err } from './customComponents/err';
import { Login } from './customComponents/Login';
import { Home } from './customComponents/Home';
// styles
import './styles/index.scss';

function Main() {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress);
  // my state logic
  /* Bind component to active state. Default is home. Change state in nav links. Can do so via checking url params - but that would mean unmounting. sigh. */
  /* Problem: avoid having to reload the page from routing. */
  // react router solves this. Hope it works here
  const loader = (text) => <Loading message={text} />;
  const message = (err) => <Err this_error={err} />;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)");
  }

  if (accountAddress && !isSignedUp) {
    return <Login user={accountAddress} setIsSignedUp={setIsSignedUp} />;
    const useSignUp = (param) => {
      console.log(param);
    };
    //api.query.usersModule.users(keyring.getPairs()[0].address).then((resp)=>console.log(resp.value.isEmpty))
    useSignUp(accountPair.address);
  }

  const contextRef = createRef();

  return (
    // Handle state here, share it with children
    <div ref={contextRef}>
      {/* <Menu> */}
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} setIsSignedUp={setIsSignedUp} />
      </Sticky>
      <DeveloperConsole />
      {/* <Menu/> */}
      {/* <PageContent> */}
      {/* Switch and link to route here */}
      {/* <PageContent/> */}
    </div>
  );
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
