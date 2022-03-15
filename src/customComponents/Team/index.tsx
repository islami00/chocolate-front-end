import { useState } from 'react';
import ChocolateRedSmall from '../../assets/chocolate-red-small.svg';

interface MemberProps {
  name: string;
  image: string;
  socials: any;
}
/**
 *
 * @description Renders a memberview
 */
const Member: React.FC<MemberProps> = function (props) {
  // eslint-disable-next-line react/prop-types
  const { image, name } = props;
  return (
    <article>
      <figure>
        <img src={image} alt='' />
        <figcaption>{name}</figcaption>
      </figure>
      {/* title here */}
      <span>{/* Render Socials */}</span>
    </article>
  );
};

const TeamList: React.FC = function () {
  const [team] = useState<any[]>([]);
  // fetch team from git - do this lazily on app instantiation.
  // teamlist.mapeach to img,name,title
  //  fill in members from fetch team
  const renderTeam = team.map((member) => <Member {...member} />);
  return <section>{renderTeam}</section>;
};

/**
 * @description  The team page
 *
 */
const Team: React.FC = function () {
  return (
    <article>
      <h1>Meet our Team</h1>
      <TeamList />
      <p>
        <b className='highlight-team'>I</b>ntegrity <b className='highlight-team'>D</b>iscipline{' '}
        <b className='highlight-team'>E</b>fficiency <b className='highlight-team'>A</b>daptability
      </p>
      <p>
        Team <img src={ChocolateRedSmall} alt='chocolate-emoji' /> is a meritocracy. No space for
        big egos here, only big dreams.
      </p>
    </article>
  );
};

export default Team;
