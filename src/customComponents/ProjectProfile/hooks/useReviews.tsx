import { useQuery, UseQueryResult } from 'react-query';
import { Project } from '../../../interfaces';
import { useSubstrate } from '../../../substrate-lib';
import { NewReview } from '../../../typeSystem/jsonTypes';
import { populateReviews } from '../majorUtils';

/**  Get all revs assoc with same proj. */
export default function useReviews(
  data: Project,
  id: string,
  ownerId: string
): UseQueryResult<NewReview[]> {
  const { api } = useSubstrate();
  // Try to break down this query such that one failure doesn't doom the rest. Too early though.
  const queryKey = ['reviews', id];
  return useQuery(queryKey, () => populateReviews(id, api, ownerId), {
    enabled: !!api,
    retry: 2,
    // ipfs never changes. The data is static. Plus, query is dynamic by revsArr/ Problem solved.
    staleTime: Infinity,
    refetchInterval: false,
  });
}
