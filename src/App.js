/* eslint-disable import/no-unresolved */
import 'semantic-ui-css/semantic.min.css';
import LandingPage from './customComponents/landingPageRe';
import { AppContextProvider, useApp } from './customComponents/state';
import { loader, message } from './customComponents/utilities';
// styles
import './styles/index.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state, dispatch } = useApp();
  const { userData } = state;

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
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
    <SubstrateContextProvider socket={nodeConfig ? nodeConfig.PROVIDER_PLAYGROUND : undefined}>
      <AppContextProvider>
        <LandingPage />
        <DeveloperConsole />
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
