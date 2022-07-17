/* eslint-disable import/no-unresolved */
import 'semantic-ui-css/semantic.min.css';
import LandingPage from './customComponents/landingPageRe';
import { AppContextProvider } from './customComponents/state';
// styles
import './styles/index.css';
import { SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

export default function RenderMe() {
  return (
    <SubstrateContextProvider>
      <AppContextProvider>
        <LandingPage />
        <DeveloperConsole />
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
