import { AnyNumber } from '@polkadot/types/types';
import { message } from 'chocolate/App';
import { ProjectAl } from 'chocolate/interfaces';
import { useParams } from 'react-router-dom';
import { filter } from './majorUtils';
import useProject from './useProject';

async function populateMetadata(cid: string, mock = false) {
  if(mock){
    // fetch metadata from mocks
  }
}

function populateReviews(referral: AnyNumber[], mock = false) {
  if(mock){
    // fetch data from review cache - good idea! setup this query alongside the project query and get it here.
  }
}
const ProjectProfile: React.FC<{ data: ProjectAl; id: string }> = function (
  props
) {
  const { data } = props;
  // race!

  return <h1>Finally, some data fetching</h1>;
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
          This project has been rejected from the chocolate ecosystem due to{' '}
          {data.proposalStatus.reason.toHuman()}
        </p>
      );
    if (re === 1) return <p>This project is currently proposed</p>;
    return four;
  }
  return <ProjectProfile data={data} id={id} />;
};

export default Main;
