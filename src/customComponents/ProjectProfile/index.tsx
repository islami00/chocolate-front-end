/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Rating } from '../Projects';
import { useApp } from '../state';
import { message } from '../utilities/message';
import { filter } from './majorUtils';
import './profile.css';
import { ProfileSum, PrProf, RevReel, SumRev } from './types';
import useAverage from './useAverage';
import useProject from './useProject';
import useProjectMeta from './useProjectMeta';
import useReviews from './useReviews';

const ProjectProfileSummary: ProfileSum = function (props) {
  const { isFetched } = props;
  if (!isFetched) return <i className="ui loader">"Loading"</i>;
  const { data, ave } = props;
  const { name, icon, Link: site, description } = data;
  const src = `https://avatars.dicebear.com/api/initials/${name}.svg`;
  return (
    <article className="head-profile">
      <section className="left">
        <section className="rating">{ave} </section>
        <section>
          <img className="reviewer_name" alt="project logo" src={src} />
        </section>
        <section>
          <a href={site} className="wh_top">
            Website
          </a>
          <a href={`${site}/whitepaper`} className="wh_top">
            Whitepaper
          </a>
        </section>
      </section>
      <section className="right">
        <h2 className="About">About</h2>
        <p className="about_reviewer">{description}</p>
      </section>
    </article>
  );
};
const SubmitReview: SumRev = function () {
  const modal = <></>;
  return (
    <div>
      {modal}
      <Button color="purple" fluid>
        Submit a review
      </Button>
    </div>
  );
};
const ReviewReel: RevReel = function (props) {
  const { isFetched } = props;
  let renderContent;
  if (!isFetched) renderContent = <i className="ui loader" />;
  else {
    const { data } = props;
    renderContent = data.map((each) => {
      const { content, userID } = each;
      const key = JSON.stringify(each);
      const { reviewText, rating } = content;
      const src = `https://avatars.dicebear.com/api/identicon/${userID}.svg`;
      return (
        <div key={key} className="box_1 card">
          <section className="card-head">
            {/* eslint-disable-next-line prettier/prettier */}
            <img src={src} alt="user logo" width="50px" height="50px" style= {{borderRadius:'50%'}} className="ui image tiny" />
          </section>
          <p>{reviewText}</p>
          <span className="card-right">
            <Rating rating={rating} fixed />
          </span>
        </div>
      );
    });
  }

  return (
    <article className="review_bttm ">
      <h2 className="review_header card-list">Reviews</h2>
      <section className="box_indiv">{renderContent}</section>
    </article>
  );
  /* eslint-enable prettier/prettier */
};
const ProjectProfile: PrProf = function (props) {
  const { data, id } = props;
  const { state } = useApp();
  const { userData } = state;
  const { accountAddress: addr } = userData;
  let canReview = true;
  if (data.ownerID.eq(addr)) canReview = false;
  // race!

  const {
    data: reviews,
    isLoading: lrev,
    isFetched: frev,
  } = useReviews(data, id, addr);

  const {
    data: projectMeta,
    isLoading: lprm,
    isFetched: fproj,
  } = useProjectMeta(data, id);
  // get average ranking
  const [avRate] = useAverage(data, projectMeta, frev, fproj, reviews);
  // structure data here. Button component and the like
  return (
    <main className="profile-wrap">
      <ProjectProfileSummary
        data={projectMeta}
        ave={avRate}
        isFetched={fproj}
      />
      <SubmitReview isLoading={lprm || lrev} disabled={canReview} />
      <ReviewReel data={reviews} isFetched={frev} />
    </main>
  );
};

const Main: React.FC = function () {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProject(id);
  if (isLoading) return <i className="ui loader" />;
  const four = message('Error, project not found', true);
  if (data === 0) return four;
  const re = filter(data);
  if (re !== 2) {
    if (re === 0)
      return (
        <p>
          This project has been rejected from the chocolate ecosystem due to
          being {data.proposalStatus.reason.toString()}
        </p>
      );
    if (re === 1) return <p>This project is currently proposed</p>;
    return four;
  }
  return <ProjectProfile data={data} id={id} />;
};

export default Main;
