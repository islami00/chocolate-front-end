import { useQuery, UseQueryResult } from 'react-query';
import { getCid } from './majorUtils';

type UseCidReturns = UseQueryResult<{ cid: string }, unknown>;
const useCid = function (
  isSubmitted: boolean,
  reviewText: string,
  rating: number
): UseCidReturns {
  const queryId = ['cid', reviewText, rating];
  // https://stackoverflow.com/questions/62340697
  return useQuery(queryId, () => getCid(reviewText, rating), {
    enabled: isSubmitted,
  });
};

export default useCid;
