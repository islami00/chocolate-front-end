/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// regular imports
// substrate imports
import { AnyJson } from '@polkadot/types/types';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
// utility imports
import { chocolateLogo } from './customComponents/constants';
import { Err } from './customComponents/err';
import LandingPage from './customComponents/landingPageRe';
// custom components - Default export if it can contain many. Export for specific like loading
import { Loading } from './customComponents/loading';
import { AppContextProvider, useApp } from './customComponents/state';
// styles
import './styles/index.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

export const message = (/** @type {AnyJson} */ err, fof = false) => <Err four={fof} this_error={err} />;
export const loader = (/** @type {string} */ text, greet = false) => (
  <Loading message={text} img={chocolateLogo} {...{ greet }} />
);
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
let nodeConfig;
if (process.env.NODE_ENV === 'development') {
  nodeConfig = JSON.parse(process.env.REACT_APP_NODE_CONFIG);
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
