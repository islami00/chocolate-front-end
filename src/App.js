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
import { Home } from './customComponents/Home';
import { useApp, AppContextProvider } from './customComponents/state';
// styles
import './styles/index.scss';

const image = 'https://avatars.githubusercontent.com/u/89528034?s=300&v=4';

function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state } = useApp();
  const { userData } = state;
  const accountPair = userData.accountAddress && keyringState === 'READY' && keyring.getPair(userData.accountAddress);

  const loader = (text) => <Loading message={text} img={image} />;
  const message = (err) => <Err this_error={err} />;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)");
  }

  const contextRef = createRef();

  return (
    // Handle state here, share it with children
    <div ref={contextRef}>
      {/* <Menu> */}
      <Sticky context={contextRef}>
        <AccountSelector />
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
      <AppContextProvider>
        <Main />
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
