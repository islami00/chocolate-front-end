/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NewReview } from 'chocolate/typeSystem/jsonTypes';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Header, Image, Modal } from 'semantic-ui-react';
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
  console.log('abe', ave);
  const { name, icon, Link: site, description } = data;
  const src = `https://avatars.dicebear.com/api/initials/${name}.svg`;
  return (
    <article className="head-profile">
      <section className="left">
        <Rating rating={ave} fixed />
        <Image
          alt="project logo"
          className="project-logo"
          wrapped
          rounded
          src={src}
          ui={false}
        />
      </section>

      <section className="right">
        <h2 className="About">About</h2>
        <p className="about_reviewer">{description}</p>
        <div className="ui two mini buttons">
          <Button as="a" color="purple" href={site} className="wh_top">
            Website
          </Button>
          <Button
            as="a"
            color="purple"
            href={`${site}/whitepaper`}
            className="wh_top"
          >
            Whitepaper
          </Button>
        </div>{' '}
      </section>
    </article>
  );
};
const SubmitReview: SumRev = function () {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button color="purple" className="purple" fluid>
            Submit a review
          </Button>
        }
      >
        <Modal.Header>Submit review</Modal.Header>
        <Modal.Content>
          <Image
            size="medium"
            src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
            wrapped
          />
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>
              We've found the following gravatar image associated with your
              e-mail address.
            </p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          {/* tx button here */}
          <Button
            content="Continue"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const ReviewSingle: React.FC<{ each: NewReview }> = function (props) {
  const { each } = props;
  const { content, userID } = each;
  const [readMore, setReadMore] = useState(false);
  const { reviewText, rating } = content;
  const [limit, setLimit] = useState(reviewText.length >= 181);
  let rev;
  if (limit) {
    rev = (
      <>
        {readMore ? reviewText : `${reviewText.substring(0, 181)}...`}
        <button
          className="link_button"
          type="button"
          onClick={() => setReadMore(!readMore)}
        >
          {readMore ? 'show less' : '  read more'}
        </button>
      </>
    );
  } else rev = reviewText;
  // limit text to 118 chars once length is more than 450px
  const src = `https://avatars.dicebear.com/api/identicon/${userID}.svg`;
  return (
    <Card color="purple">
      <Card.Content>
        <Card.Header>
          <Image src={src} floated="left" rounded size="mini" />
        </Card.Header>
        <Card.Description>{rev}</Card.Description>
      </Card.Content>
      <Card.Content extra floated="right">
        <Rating rating={rating} fixed />
      </Card.Content>
    </Card>
  );
};
const ReviewReel: RevReel = function (props) {
  const { isFetched } = props;
  let renderContent;
  if (!isFetched) renderContent = <i className="ui loader" />;
  else {
    const { data } = props;
    renderContent = data.map((each) => (
      <ReviewSingle each={each} key={JSON.stringify(each)} />
    ));
  }

  return (
    <article className="review_bttm ">
      <h2 className="About review_header card-list">Reviews</h2>
      <Card.Group className="box_indiv">{renderContent}</Card.Group>
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
        isLoading={lprm}
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
