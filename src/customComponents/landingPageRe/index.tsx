import { loader, message } from 'chocolate/App';
import { useSubstrate } from 'chocolate/substrate-lib';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Switch } from 'react-router-dom';
import About from '../About';
import Gallery from '../Gallery';
import MenuBar from '../menuBar';
import ProjectProfile from '../ProjectProfile';
import ProjectsRe from '../ProjectsRe';
import Team from '../Team';
import WallOfShame from '../WallOfShame';
import './landing.css';

const client = new QueryClient();

function Main(): JSX.Element {
  const { apiState, apiError } = useSubstrate();

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  return (
    <div className='root-wrap'>
      <MenuBar />
      <QueryClientProvider contextSharing client={client}>
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
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/team'>
            <Team />
          </Route>
          <Route path='*'>{message('404! Not found', true)}</Route>
        </Switch>
      </QueryClientProvider>
    </div>
  );
}

export default Main;
