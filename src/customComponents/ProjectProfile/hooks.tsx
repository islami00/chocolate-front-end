import toast from 'react-hot-toast';
import { useQuery, UseQueryResult } from 'react-query';
import { getCid } from './majorUtils';

type UseCidReturns = UseQueryResult<{ cid: string }, Error>;
const useCid = function (isSubmitted: boolean, reviewText: string, rating: number): UseCidReturns {
  const queryId = ['cid', reviewText, rating];
  // https://stackoverflow.com/questions/62340697
  return useQuery(queryId, () => getCid(reviewText, rating), {
    enabled: isSubmitted,
    onError: () => toast.error(`Something went wrong fetching your review's cid`),
    staleTime: Infinity,
  });
};

export default useCid;
