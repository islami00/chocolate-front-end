// regular imports
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
// stock components
import AccountSelector from './AccountSelector';
// utility imports
import { chocolateLogo } from './customComponents/constants';
import Council from './customComponents/Council';
import { Err } from './customComponents/err';
import Home from './customComponents/Home';
// custom components - Default export if it can contain many. Export for specific like loading
import { Loading } from './customComponents/loading';
import { Menu } from './customComponents/Menu';
import Projects from './customComponents/Projects';
import Review from './customComponents/Review';
import SignUp from './customComponents/SignUp';
import { AppContextProvider, useApp } from './customComponents/state';
import WallOfShame from './customComponents/WallOfShame';
// styles
import './styles/index.scss';
// substrate imports
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state, dispatch } = useApp();
  const { userData } = state;

  const accountPair =
    userData.accountAddress && keyringState === 'READY' && keyring && keyring.getPair(userData.accountAddress);

  /** @param {string} text */
  const loader = (text, greet = false) => <Loading message={text} img={chocolateLogo} {...{ greet }} />;

  const message = (/** @type {import('@polkadot/types/types').AnyJson} */ err) => <Err this_error={err} />;

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
      <Router>
        <Menu>
          <AccountSelector />
          <DeveloperConsole />
        </Menu>
        <Switch>
          <Redirect from='/substrate-front-end-template' to='/' />
          {userData.accountType === 'unset' && <Redirect exact from='/' to='/sign-up/unset' />}
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
          <Route exact path='/sign-up'>
            <SignUp />
          </Route>
          <Route exact path='/sign-up/:id'>
            <SignUp />
          </Route>
          <Route path='*'>{message('404! Not found')}</Route>
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
// to-do: decorator: refactor for button triggered load accounts
