/* eslint-disable import/no-unresolved */
import 'semantic-ui-css/semantic.min.css';
import LandingPage from './customComponents/landingPageRe';
import { AppContextProvider } from './customComponents/state';
// styles
import './styles/index.css';
import { SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

/** @type {Record<"PROVIDER_LOCAL"| "PROVIDER_PLAYGROUND" | "PROVIDER_PHONE",string> | undefined} */
let nodeConfig;
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_NODE_CONFIG) {
  // Use config when not running local node.
  nodeConfig = {
    PROVIDER_LOCAL: process.env.REACT_APP_PROVIDER_LOCAL,
    PROVIDER_PLAYGROUND: process.env.REACT_APP_PROVIDER_PLAYGROUND,
    PROVIDER_PHONE: process.env.REACT_APP_PROVIDER_PHONE,
  };
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
