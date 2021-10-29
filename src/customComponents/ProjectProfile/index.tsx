import { message } from 'chocolate/App';
import { ProjectAl } from 'chocolate/interfaces';
import { JSONProject } from 'chocolate/typeSystem/appTypes';
import { ChainProject } from 'chocolate/typeSystem/jsonTypes';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../state';
import { filter } from './majorUtils';
import useProject from './useProject';
import useProjectMeta from './useProjectMeta';
import useReviews from './useReviews';

const ProjectProfile: React.FC<{ data: ProjectAl; id: string }> = function (
  props
) {
  const { data, id } = props;
  const { state } = useApp();
  const { userData } = state;
  const { accountAddress: addr } = userData;
  const [avRate, setAvRate] = useState('0.0');
  let canReview = true;
  if (data.ownerID.eq(addr)) canReview = false;
  // race!

  const {
    data: reviews,
    isLoading: lrev,
    isFetched: frev,
  } = useReviews(data, id, addr);

  const {
    data: projectMeta,
    isLoading: lprm,
    isFetched: fproj,
  } = useProjectMeta(data, id);
  // get average ranking
  useEffect(() => {
    if (frev && fproj) {
      const nPr: ChainProject = data.toHuman() as unknown as ChainProject;
      const useThis = { ...nPr, metaData: projectMeta };
      const pr = new JSONProject(useThis, reviews);
      setAvRate(pr.rankAverage.toPrecision(2));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frev, fproj]);
  // structure data here. Button component and the like
  return (
    <h1>
      Finally, some data fetching, loading? {lrev ? 'Yes' : 'No'}, and average?{' '}
      {avRate}{' '}
    </h1>
  );
};
const Main: React.FC = function () {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProject(id);
  if (isLoading) return <i className='ui loader' />;
  const four = message('Error, project not found', true);
  if (data === 0) return four;
  const re = filter(data);
  if (re !== 2) {
    if (re === 0)
      return (
        <p>
          This project has been rejected from the chocolate ecosystem due to
          being {data.proposalStatus.reason.toString()}
        </p>
      );
    if (re === 1) return <p>This project is currently proposed</p>;
    return four;
  }
  return <ProjectProfile data={data} id={id} />;
};

export default Main;
