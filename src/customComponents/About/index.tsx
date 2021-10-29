import ChocolatePurpleSmall from '../../assets/chocolate-purple-small.svg';
import './about.css';
/**
 * ## The About Page
 * @description It is a simple paragraph of text for now
 */
const About: React.FC = function () {
  return (
    <main className='about-wrap'>
      <p className='mission'>
        “To provide a safe path to onboard the next 1 billion users of crypto
        &amp; blockchain by eliminating Web 3.0 scams.”
      </p>
      <img src={ChocolatePurpleSmall} alt='chocolate!' />
    </main>
  );
};

export default About;
