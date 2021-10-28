import { Project } from 'chocolate/interfaces';
import { useSubstrate } from 'chocolate/substrate-lib';
import { ReviewContent } from 'chocolate/typeSystem/mockTypes';
import { useQuery, UseQueryResult } from 'react-query';
import { populateReviews } from './majorUtils';

export default function useReviews(
  data: Project,
  id: string,
  ownerId: string
): UseQueryResult<ReviewContent[]> {
  const queryKey = ['reviews', id];
  const { api } = useSubstrate();
  const revs = data.reviews.unwrapOrDefault();
  return useQuery(queryKey, () => populateReviews(revs, api, ownerId));
}
