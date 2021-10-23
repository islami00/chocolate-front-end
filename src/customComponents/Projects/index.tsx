// type imports
import Identicon from '@polkadot/react-identicon';
// default imports
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// icons
import { Button, Icon } from 'semantic-ui-react';
import ChocolateRedSmall from '../../assets/chocolate-red-small.svg';
import Pensive from '../../assets/pensive-face-emoji.svg';
import { ProjectWithIndex } from '../../typeSystem/jsonTypes';
// styles
import './projects.scss';

/** @type {React.FC<{rating:import('@polkadot/types/types').AnyNumber; fixed:boolean;}>} */
const Rating: React.FC<{
  rating: import('@polkadot/types/types').AnyNumber;
  fixed: boolean;
}> = function (props) {
  // expect rating to 2dp
  const { rating, fixed } = props;
  const [rated, setRated] = useState(0);
  const [hover, setHover] = useState(0);
  useEffect(() => {
    if (fixed) setRated(Number(rating));
  }, []);
  return (
    <form onSubmit={e => e.preventDefault()}>
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [...Array(5)].map((_, i) => {
          const currentRating = i + 1;
          return (
            <label>
              <input
                className='rate'
                type='radio'
                name='Rating'
                id=''
                value={currentRating}
                onClick={!fixed && (() => setRated(currentRating))}
              />
              <img
                src={ChocolateRedSmall}
                alt='Rating'
                onMouseEnter={!fixed && (() => setHover(currentRating))}
                onMouseLeave={!fixed && (() => setHover(0))}
                className='rate_choc'
                style={{
                  opacity: `${currentRating <= (hover || rated) ? 1 : 0.5}`,
                }}
              />
            </label>
          );
        })
      }
    </form>
  );
};
/**
 * @description Houses a single project
 * @type {React.FC<{data: ProjectWithIndex}>} - Give proper types later
 */
const ProjectView: React.FC<{ data: ProjectWithIndex }> = function (props) {
  const { data } = props;
  const { Id, project } = data;
  const { ownerID, proposalStatus, metaData } = project;
  const { projectName: name } = metaData;
  const { status } = proposalStatus;
  let rateBar = <></>;
  let toProject = <></>;
  if (status === 'Accepted') {
    rateBar = <Rating rating={5} fixed />;
    toProject = (
      <Button
        as={Link}
        to={`/projects/${Id.toString()}`}
        color='brown'
        icon
        labelPosition='right'
        size='medium'
        role='link'>
        To Project
        <Icon name='arrow right' />
      </Button>
    );
  }
  return (
    <section className='project'>
      <Identicon
        key={`substrate_icon_${ownerID}`}
        value={ownerID.toString()}
        size={48}
        theme='substrate'
      />
      <div className='description'>
        <h2>{name}</h2>
        {rateBar}
      </div>
      {toProject}
    </section>
  );
};

/**
 * @description Houses the projects
 * @type  {React.FC<{data : ProjectWithIndex[]; gallery?:boolean;shame?:boolean}>}
 */
export const ProjectsView: React.FC<{
  data: ProjectWithIndex[];
  gallery?: boolean;
  shame?: boolean;
}> = function (props) {
  const { data, gallery, shame } = props;

  // make sure to edit as we expand for overflow
  data.sort((a, b) => Number(a.Id) - Number(b.Id));
  let render;
  let header;
  let desc;
  /** @param {ProjectWithIndex} project */
  const toProject = (project: ProjectWithIndex) => (
    <ProjectView data={project} key={project.Id.toString()} />
  );
  if (gallery) {
    header = 'Projects covered by chocolate';
    desc =
      'This is an exhaustive gallery of the different projects in chocolate currently';
    const accepted = data.filter(
      each => each.project.proposalStatus.status === 'Accepted'
    );
    const proposed = data.filter(
      each => each.project.proposalStatus.status === 'Proposed'
    );
    const r1 = accepted.map(toProject);
    const r2 = proposed.map(toProject);
    render = (
      <section>
        <h2>Accepted projects</h2>
        {r1}
        <h2>Proposed projects</h2>
        {r2}
      </section>
    );
  }
  if (shame) {
    header = 'Wall of Shame';
    desc = <img src={Pensive} alt='Pensive face emoji' />;
    const malicious = data.filter(
      each =>
        each.project.proposalStatus.status === 'Rejected' &&
        each.project.proposalStatus.reason === 'malicious'
    );
    const r = malicious.map(toProject);
    render = (
      <section>
        <h2>Rejected Projects</h2>
        {r}
      </section>
    );
  }
  return (
    <article>
      <h1>{header}</h1>
      <p>{desc}</p>
      {render}
    </article>
  );
};
ProjectsView.defaultProps = {
  gallery: false,
  shame: false,
};
