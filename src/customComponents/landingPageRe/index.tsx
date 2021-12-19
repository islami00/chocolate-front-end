import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignUp from 'chocolate/polkadot-apac-hackathon/Auth-View/sign-up-interaction';
import AuthProvider from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
import Login from 'chocolate/polkadot-apac-hackathon/Auth-View/login-interaction';
import { useSubstrate } from '../../substrate-lib';
import About from '../About';
import Gallery from '../Gallery';
import MenuBar from '../menuBar';
import ProjectProfile from '../ProjectProfile';
import ProjectsRe from '../ProjectsRe';
import Team from '../Team';
import { loader, message } from '../utilities';
import WallOfShame from '../WallOfShame';
import './landing.css';
import UserProfile from '../../polkadot-apac-hackathon/userProfile';

const queryCache = new QueryCache({
  onError: (error: Error, query) => {
    // only show errors for refetches. So intial error should be handled locally.
    if (query.state.data !== undefined) {
      toast.error(`Something went wrong ${error.message}`);
    }
  },
});
const client = new QueryClient({ queryCache });

function Main(): JSX.Element {
  const { apiState, apiError } = useSubstrate();
  const [back, setBack] = useState(false);

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  return (
    <div className={`root-wrap ${back ? 'background' : ''}`}>
      <QueryClientProvider contextSharing client={client}>
        <AuthProvider>
          <Router>
            <MenuBar setBack={setBack} />
            <Switch>
              <Route exact path='/'>
                <ProjectsRe />
              </Route>
              <Route path='/gallery'>
                <Gallery />
              </Route>
              <Route path='/wall-of-shame'>
                <WallOfShame />
              </Route>
              <Route path='/project/:id'>
                <ProjectProfile />
              </Route>

              <Route path='/user/:web3Address'>
                <UserProfile />
              </Route>
              <Route path='/sign-up'>
                <SignUp />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/team'>
                <Team />
              </Route>
              <Route path='*'>{message('404! Not found', true)}</Route>
            </Switch>
          </Router>
          <Toaster position='bottom-right' />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default Main;
