import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { NewMetaData } from '../../../typeSystem/jsonTypes';
import { Rating } from '../../Projects';
import { useCid } from '../hooks';
import { SubRev } from '../types';
import { SubmitReviewTx } from './SubmitReviewTx';

const SubmitReviewForm: SubRev = function () {
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);
  // form data
  const initForm = { id, cid: '' };
  const [rate, setRate] = useState(0);
  const [submittedReview, setSubmittedReview] = useState(initForm);
  // get cache
  const [review, setReview] = useState('');
  const queryKey = ['project', 'meta', id];
  const qClient = useQueryClient();
  const cachedProj = qClient.getQueryCache().find<NewMetaData>(queryKey);
  if (!cachedProj.state) debugger; // found an error where this showed up as undefined
  const proj = cachedProj.state.data;
  // setup the query, then refetch when data is in place or manually on error.
  const { data, isLoading, isError, refetch } = useCid(submitted, review, rate);
  const doRefetch = () => {
    refetch()
      .then((value) => qClient.setQueryData(['cid', review, rate], value))
      .catch(console.error);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  // setup conditional renders
  let content;
  // set the submitted review once fetched and submitted
  useEffect(() => {
    if ((submitted && !isLoading && !isError) || data) setSubmittedReview({ id, cid: data.cid });
    if (isError) setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, isLoading, isError, id]);
  if ((submitted && !isLoading && !isError) || (data && submittedReview.cid)) {
    content = <SubmitReviewTx {...submittedReview} />;
  } else {
    content = (
      <Form onSubmit={handleSubmit}>
        <Form.Input fluid label='Project' value={proj.name} />
        <Form.TextArea
          label='Body'
          required
          value={review}
          onChange={(e, { value }) => setReview(value.toString())}
          placeholder='Write your review here'
        />
        <Rating fixed={false} setOuterRate={setRate} />
        <Form.Button
          content={isError ? 'Retry' : 'Submit'}
          fluid
          color='purple'
          onClick={() => isError && doRefetch()}
          loading={isLoading || undefined}
        />
      </Form>
    );
  }

  return <div>{content}</div>;
};
export { SubmitReviewForm };
