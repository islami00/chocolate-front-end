import { Container } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import useChainUser from '../../common/hooks/useChainUser';
import Home from './Home';
import Sidebar from './Sidebar';

const UserProfile: React.FC = function () {
  // fetch user data from chain based on w3 <points>
  const { web3Address } = useParams<{ web3Address: string }>();
  const userQuery = useChainUser(web3Address);
  return <Home user={userQuery} />;
};
export default UserProfile;
