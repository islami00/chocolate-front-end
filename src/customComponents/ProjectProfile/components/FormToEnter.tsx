import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { Rating } from '../../Projects';
import type { CacheAction } from './SubmitReviewForm';

export interface RawFormData {
  rating: number;
  comment: string;
}
export interface LocalFormProps {
  projectName: string;
  id: string;
  dispatchCache: React.Dispatch<CacheAction>;
  cachedForm: RawFormData;
}
type FormEventTypes = React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>;
const FormToEnter: React.FC<LocalFormProps> = (props) => {
  // rid yourself of the props
  const { dispatchCache, id, cachedForm } = props;
  const [rawInput, setRawInput] = useState<RawFormData>(cachedForm);
  // next step
  const [next, setNext] = useState<boolean>(false);
  // handle input changes
  const handleInputChange = (e: FormEventTypes) => {
    const { name, value } = e.target;
    setRawInput({ ...rawInput, [name]: value });
  };
  // handle rating controls
  const setRate = (rate: number) => setRawInput({ ...rawInput, rating: rate });

  // go to next on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // call dispatch which will in turn cache
    dispatchCache({ type: 'stage1', stage1: { ...rawInput }, id });
    // move to next step
    setNext(true);
  };
  useEffect(() => {
    // set the form to the cached form
    setRawInput(cachedForm);
  }, [cachedForm]);
  // go to next stage.
  if (next) return <Redirect to={`/project/${id}/stage/2`} />;
  // ui for form
  // get project for display
  console.count('FormToEnter');
  const { projectName } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Input fluid label='Project' value={projectName} />
      <Form.TextArea
        label='Body'
        required
        value={rawInput.comment}
        name='comment'
        onChange={handleInputChange}
        placeholder='Write your review here'
      />
      {/* Todo: change review api */}
      <Rating rating={rawInput.rating} fixed={false} setOuterRate={setRate} />
      <Form.Button content='Submit' fluid color='purple' />
    </Form>
  );
};

export { FormToEnter };
