import { Loader } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useCid } from '../hooks';
import type { CacheAction, Stage1Cache } from './SubmitReviewForm';

export interface CheckCidProps extends Stage1Cache {
  isAuthenticated: boolean;
  dispatchCache: React.Dispatch<CacheAction>;
}

const CheckAuthAndGetCid: React.FC<CheckCidProps> = function (props) {
  // first, check if auth
  const { isAuthenticated, comment, rating, dispatchCache } = props;
  // if auth, get cid
  const { isLoading, isError, data } = useCid(isAuthenticated, comment, rating);
  // id for later
  const { id } = useParams<{ id: string }>();
  // next
  const [next, setNext] = useState<boolean>(false);
  useEffect(() => {
    // dispatch next action if cid is available
    const isCidAvailable = (!isLoading && !isError) || data;
    if (isCidAvailable) {
      const { cid } = data;
      dispatchCache({ type: 'stage2', stage2: cid, id });
      // then go to next
      setNext(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, data, id]);

  // if authenticated and cid is available, go to next
  if (!isAuthenticated) {
    // merge the signup and sign in pages for better ux
    return <Redirect to='/login' />;
  }
  if (next) return <Redirect to={`/project/${id}/stage/3`} />;

  return <Loader content='Redirecting to next stage...' />;
};
export { CheckAuthAndGetCid };
