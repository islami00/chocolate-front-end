import { useQuery, UseQueryResult } from 'react-query';
import { Project } from '../../interfaces';
import { useSubstrate } from '../../substrate-lib';
import { NewReview } from '../../typeSystem/mockTypes';
import { populateReviews } from './majorUtils';

export default function useReviews(
  data: Project,
  id: string,
  ownerId: string
): UseQueryResult<NewReview[]> {
  const { api } = useSubstrate();
  // presumably, the data here is a vec<reviews>, api handles.
  const revs = data.reviews.unwrapOrDefault();
  // rate limit
  const max = revs.length > 10 ? 10 : revs.length;
  const revsArr = revs.slice(0, max);

  const queryKey = ['reviews', revsArr];
  return useQuery(queryKey, () => populateReviews(revsArr, api, ownerId), {
    enabled: !!api,
    retry: 2,
    // ipfs never changes. The data is static. Plus, query is dynamic by revsArr/ Problem solved.
    staleTime: Infinity,
    refetchInterval: false,
  });
}
