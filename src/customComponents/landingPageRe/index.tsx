import { message } from 'chocolate/App';
import { Route, Switch } from 'react-router-dom';
import About from '../About';
import Gallery from '../Gallery';
import MenuBar from '../menuBar';
import ProjectProfile from '../ProjectProfile';
import ProjectsRe from '../ProjectsRe';
import Team from '../Team';
import WallOfShame from '../WallOfShame';
import './landing.css';

function Main(): JSX.Element {
  return (
    <div className='root-wrap'>
      <MenuBar />
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
    </div>
  );
}

export default Main;
