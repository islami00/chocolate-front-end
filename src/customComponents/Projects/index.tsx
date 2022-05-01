/* eslint-disable react/prop-types */
// type imports
import Identicon from '@polkadot/react-identicon';
import { AnyNumber } from '@polkadot/types/types';
// default imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// icons
import { Button, Icon, Label } from 'semantic-ui-react';
import ChocolateRedSmall from '../../assets/chocolate-red-small.svg';
import Pensive from '../../assets/pensive-face-emoji.svg';
import { HumanNewProjectWithIndex } from '../../typeSystem/jsonTypes';
// styles
import './projects.scss';

type ReactNumberDis = React.Dispatch<React.SetStateAction<number>>;
/** @description rating component, optionally interactive */
export const Rating: React.FC<{
  rating?: AnyNumber;
  fixed: boolean;
  setOuterRate?: ReactNumberDis | ((rate: number) => ReturnType<ReactNumberDis>);
}> = function (props) {
  const { fixed } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const [rating, setOuterRate] = [props.rating, props.setOuterRate];
  const [rated, setRated] = useState(0);
  const [hover, setHover] = useState(0);
  // debug
  useEffect(() => {
    if (rating) setRated(Number(rating));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);
  useEffect(() => {
    if (!fixed) setOuterRate(rated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixed, rated]);
  return (
    <section className='review-wrap'>
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        Array.from(Array(5)).map((undef, i) => {
          const currentRating = i + 1;

          return (
            <label key={`choc_bar${currentRating}`}>
              <input
                className='rate'
                type='radio'
                name='Rating'
                value={currentRating}
                onClick={!fixed ? () => setRated(currentRating) : undefined}
              />
              <img
                src={ChocolateRedSmall}
                alt='Rating'
                onMouseEnter={!fixed ? () => setHover(currentRating) : undefined}
                onMouseLeave={!fixed ? () => setHover(0) : undefined}
                className='rate_choc'
                style={{
                  opacity: `${currentRating <= (hover || rated) ? 1 : 0.5}`,
                }}
              />
            </label>
          );
        })
      }
      <Label pointing='left' color='purple'>
        {rated.toPrecision(2)}
      </Label>
    </section>
  );
};
/** @description Houses a single project */
const ProjectView: React.FC<{ data: HumanNewProjectWithIndex }> = function (props) {
  const { data } = props;
  const { Id, project } = data;
  const { ownerID, proposalStatus, metadata } = project;
  const { name } = metadata;
  const { status } = proposalStatus;
  let rateBar = <></>;
  let toProject: JSX.Element = <></>;
  if (status === 'Accepted') {
    const rating = Number(project.totalReviewScore) / Number(project.numberOfReviews);
    rateBar = <Rating rating={rating} fixed />;
    toProject = (
      <Button
        as={Link}
        to={`/project/${Id}`}
        color='brown'
        icon
        labelPosition='right'
        size='medium'
        role='link'
      >
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

/** @description Houses the projects -- Refactor to new when ready */
export const ProjectsView: React.FC<{
  data: HumanNewProjectWithIndex[];
  gallery?: boolean;
  shame?: boolean;
}> = function (props) {
  const { data, gallery, shame } = props;

  // make sure to edit as we expand for overflow
  data.sort((a, b) => Number(a.Id) - Number(b.Id));
  let render;
  let header;
  let desc;
  const toProject = (project: HumanNewProjectWithIndex) => (
    <ProjectView data={project} key={project.Id.toString()} />
  );
  if (gallery) {
    header = 'Projects covered by chocolate';
    desc = 'This is an exhaustive gallery of the different projects in chocolate currently';
    const accepted = data.filter((each) => each.project.proposalStatus.status === 'Accepted');
    const proposed = data.filter((each) => each.project.proposalStatus.status === 'Proposed');
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
      (each) =>
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
