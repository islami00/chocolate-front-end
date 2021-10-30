/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// regular imports
// substrate imports
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
// eslint-disable-next-line import/no-unresolved
import LandingPage from './customComponents/landingPageRe';
import { AppContextProvider, useApp } from './customComponents/state';
// eslint-disable-next-line import/no-unresolved
import { loader, message } from './customComponents/utilities';
// styles
import './styles/index.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state, dispatch } = useApp();
  const { userData } = state;

  const accountPair =
    userData.accountAddress && keyringState === 'READY' && keyring && keyring.getPair(userData.accountAddress);

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  // for splitting - TO-DO later
  // to allow free access to content, place this check along with async load accounts(from useSubstrate) on pages that require an account to proceed. It will be a button component that says, load your account. Once ready, it will then render success and continue on
  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)");
  }
  if (!userData.accountType) {
    return loader('Loading your preferences...', true);
  }
  // To-do: complete user flow
  return (
    <div>
      <h1>What once was only an app</h1>
    </div>
  );
}

export function App() {
  return <Main />;
}
/** @type {Record<"PROVIDER_LOCAL"| "PROVIDER_PLAYGROUND" | "PROVIDER_PHONE",string> | undefined} */
let nodeConfig;
if (process.env.NODE_ENV === 'development') {
  // Use config when not running local node.
  if (process.env.REACT_APP_NODE_CONFIG) nodeConfig = JSON.parse(process.env.REACT_APP_NODE_CONFIG);
}

export default function RenderMe() {
  return (
    // Wrapping in app and substrate context preserves state. There is only the issue of routing completely resetting on refresh
    <SubstrateContextProvider socket={nodeConfig ? nodeConfig.PROVIDER_LOCAL : undefined}>
      <AppContextProvider>
        <LandingPage />
        <DeveloperConsole />
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
