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
import LandingPage from './customComponents/landingPageRe';
// custom components - Default export if it can contain many. Export for specific like loading
import { Loading } from './customComponents/loading';
import { Menu } from './customComponents/Menu';
import Projects from './customComponents/Projects';
import Review from './customComponents/Review';
import SignUp from './customComponents/SignUp';
import { AppContextProvider, useApp } from './customComponents/state';
import WallOfShame from './customComponents/WallOfShame';
// styles
import './styles/index.css';
// substrate imports
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

export const message = (/** @type {import('@polkadot/types/types').AnyJson} */ err, fof = false) => (
  <Err four={fof} this_error={err} />
);
function Main() {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { state, dispatch } = useApp();
  const { userData } = state;

  const accountPair =
    userData.accountAddress && keyringState === 'READY' && keyring && keyring.getPair(userData.accountAddress);

  /** @param {string} text */
  const loader = (text, greet = false) => <Loading message={text} img={chocolateLogo} {...{ greet }} />;

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
      <Menu>
        {/* Load accounts here on render */}
        <AccountSelector />
      </Menu>
      <DeveloperConsole />
      <Switch>
        {userData.accountType === 'unset' && <Redirect exact from='/app' to='/app/sign-up/unset' />}
        <Route exact path='/app'>
          <Home />
        </Route>
        <Route path='/app/review'>
          <Review />
        </Route>
        <Route path='/app/projects'>
          <Projects />
        </Route>
        <Route path='/app/council'>
          <Council />
        </Route>
        <Route path='/app/wall-of-shame'>
          <WallOfShame />
        </Route>
        <Route exact path='/app/sign-up'>
          <SignUp />
        </Route>
        <Route exact path='/app/sign-up/:id'>
          <SignUp />
        </Route>
        <Route path='*'>{message('404! Not found', true)}</Route>
      </Switch>
    </div>
  );
}

export function App() {
  return <Main />;
}

export default function RenderMe() {
  console.log(document.location.pathname, { loc1: document.location }, document.location);
  const message = (/** @type {import('@polkadot/types/types').AnyJson} */ err, fof = false) => (
    <Err four={fof} this_error={err} />
  );
  return (
    // Wrapping in app and substrate context preserves state. There is only the issue of routing completely resetting on refresh
    <SubstrateContextProvider>
      <AppContextProvider>
        <Router>
          <Switch>
            <Redirect exact from='/substrate-front-end-template' to='/' />
            <Route path='/'>
              <LandingPage />
            </Route>
            <Route path='/app'>
              <App />
            </Route>
            <Route path='*'>{message('404! Not found', true)}</Route>
          </Switch>
        </Router>
      </AppContextProvider>
    </SubstrateContextProvider>
  );
}
// to-do: decorator: refactor for button triggered load accounts
// to-do: decorator: static landing page route before load app - check index.js
