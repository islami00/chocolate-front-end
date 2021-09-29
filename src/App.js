// regular imports
import React, { useState, createRef } from 'react';
import { Sticky, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// substrate imports
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';
// stock components
import AccountSelector from './AccountSelector';
// custom components - Default export if it can contain many. Export for specific like loading
import { Loading } from './customComponents/loading';
import { Err } from './customComponents/err';
import Home from './customComponents/Home';
import Review from './customComponents/Review';
import Projects from './customComponents/Projects';
import Council from './customComponents/Council';
import WallOfShame from './customComponents/WallOfShame';
import { Menu } from './customComponents/Menu';
import { useApp, AppContextProvider } from './customComponents/state';
// utility imports
import { chocolateLogo } from './customComponents/constants';
// styles
import './styles/index.scss';

function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state } = useApp();
  const { userData } = state;
  const accountPair = userData.accountAddress && keyringState === 'READY' && keyring.getPair(userData.accountAddress);

  const loader = (text) => <Loading message={text} img={chocolateLogo} />;
  const message = (err) => <Err this_error={err} />;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)");
  }

  return (
    <div>
      <Router>
        <Menu>
          <AccountSelector />
          <DeveloperConsole />
        </Menu>
        <Switch>
          <Redirect from='/substrate-front-end-template' to='/' />
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/review'>
            <Review />
          </Route>
          <Route path='/projects'>
            <Projects />
          </Route>
          <Route path='/council'>
            <Council />
          </Route>
          <Route path='/wall-of-shame'>
            <WallOfShame />
          </Route>
        </Switch>
      </Router>
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
