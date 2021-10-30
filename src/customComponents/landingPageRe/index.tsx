import { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
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

const queryCache = new QueryCache();
const client = new QueryClient({ queryCache });

function Main(): JSX.Element {
  const { apiState, apiError } = useSubstrate();
  const [back, setBack] = useState(false);

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  return (
    <div className={`root-wrap ${back ? 'background' : ''}`}>
      <QueryClientProvider contextSharing client={client}>
        <Router>
          <MenuBar setBack={setBack} />
          <Switch>
            <Route exact path="/">
              <ProjectsRe />
            </Route>
            <Route path="/gallery">
              <Gallery />
            </Route>
            <Route path="/wall-of-shame">
              <WallOfShame />
            </Route>
            <Route path="/project/:id">
              <ProjectProfile />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/team">
              <Team />
            </Route>
            <Route path="*">{message('404! Not found', true)}</Route>
          </Switch>
          <ReactQueryDevtools initialIsOpen={false} />
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default Main;
