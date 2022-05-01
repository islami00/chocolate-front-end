import { useEffect, useState } from 'react';
import { JSONProject } from '../../../typeSystem/appTypes';
import { HumanNewProjectWithIndex, HumanNewReview } from '../../../typeSystem/jsonTypes';
/**
 * @description This hook calculates the average. Eventually, this will be depracated upon introduction of the "rating", "totalRating", "totalReviews" fields on the review and project respectively.
 * That way, JSONProject can simply use those fields instead for average and the average can be calculated on the fly.
 */
const useAverage = (
  projectMeta: HumanNewProjectWithIndex,
  fetchedProject: boolean,
  reviews: HumanNewReview[]
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [avRate, setAvRate] = useState('0.0');
  useEffect(() => {
    if (fetchedProject) {
      const content = reviews
        .filter((each) => each.proposalStatus.status === 'Accepted')
        .map((each) => each.content);
      const pr = new JSONProject(projectMeta.project, content);
      setAvRate(pr.rankAverage.toPrecision(2));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length, fetchedProject]);
  return [avRate, setAvRate];
};

export default useAverage;
