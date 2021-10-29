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
  const queryKey = ['reviews', id];
  const { api } = useSubstrate();
  const revs = data.reviews.unwrapOrDefault();
  return useQuery(queryKey, () => populateReviews(revs, api, ownerId));
}
