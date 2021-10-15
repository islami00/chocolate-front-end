import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import MenuBar from "../menuBar";
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
    <div>
      <MenuBar />
      <LandingContent/>
    </div>
  );
}

export default Main;
