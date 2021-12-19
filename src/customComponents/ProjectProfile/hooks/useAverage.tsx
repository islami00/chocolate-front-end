import { useEffect, useState } from 'react';
import { ProjectAl } from '../../../interfaces';
import { JSONProject } from '../../../typeSystem/appTypes';
import { ChainProject, NewMetaData, NewReview } from '../../../typeSystem/jsonTypes';

const useAverage = (
  data: ProjectAl,
  projectMeta: NewMetaData,
  fetchedReview: boolean,
  fetchedProject: boolean,
  reviews: NewReview[]
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [avRate, setAvRate] = useState('0.0');
  useEffect(() => {
    if (fetchedReview && fetchedProject) {
      const content = reviews
        .filter((each) => each.proposalStatus.status === 'Accepted')
        .map((each) => each.content);
      const nPr: ChainProject = data.toHuman() as unknown as ChainProject;
      const useThis = { ...nPr, metaData: projectMeta };
      const pr = new JSONProject(useThis, content);
      setAvRate(pr.rankAverage.toPrecision(2));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedReview, fetchedProject]);
  return [avRate, setAvRate];
};

export default useAverage;
