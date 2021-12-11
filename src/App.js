/* eslint-disable import/no-unresolved */
import 'semantic-ui-css/semantic.min.css';
import AuthView from './Auth-View';
import LandingPage from './customComponents/landingPageRe';
import { AppContextProvider } from './customComponents/state';
// styles
import './styles/index.css';
import { SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';


/** @type {Record<"PROVIDER_LOCAL"| "PROVIDER_PLAYGROUND" | "PROVIDER_PHONE",string> | undefined} */
let nodeConfig;
if (process.env.NODE_ENV === 'development') {
  // Use config when not running local node.
  if (process.env.REACT_APP_NODE_CONFIG) nodeConfig = JSON.parse(process.env.REACT_APP_NODE_CONFIG);
}

export default function RenderMe() {
  return (
    <SubstrateContextProvider socket={nodeConfig ? nodeConfig.PROVIDER_LOCAL : undefined}>
      <AppContextProvider>
        <AuthView/>
        {/* <LandingPage /> */}
        <DeveloperConsole />
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
