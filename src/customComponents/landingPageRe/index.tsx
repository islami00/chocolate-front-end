import { message } from 'chocolate/App';
import { Route, Switch } from 'react-router';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import About from '../About';
import MenuBar from "../menuBar";
import ProjectsRe from '../ProjectsRe';
import Team from '../Team';
import './landing.css';
function LandingContent() {
  return (
    <main className='main-content-wrap'>
      <section className='landing'>
        <h1 className='project-name'>Chocolate</h1>
        <p><b className='tagline'>Ending scam &amp; spam</b> in crypto once and for all.<br/>
        Bringing triple-layered protection to Web 3.0</p>
        <a href='/projects' className='btn'>Explore Projects</a>
      </section>
        <section><img src={ChocolateRedBig} alt="A big Chocolate bar with a red wrapper!" /></section>
    </main>
  )
}

function Main() {
  return (
    <div className='root-wrap'>
      <MenuBar />
      <Switch>
        <Route exact path='/'>
          <LandingContent/>
        </Route>
        <Route path='/about'>
          <About></About>
        </Route>
        <Route path='/projects'>
          <ProjectsRe></ProjectsRe>
        </Route>
        <Route path='/team'>
          <Team></Team>
        </Route>
        <Route path='*'>
          {message('404! Not found', true)}
        </Route>
      </Switch>
    </div>
  );
}

export default Main;
