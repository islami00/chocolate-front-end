import { isJsonObject } from '@polkadot/util';
import { useParams } from 'react-router-dom';
import useChainUser from '../common/hooks/useChainUser';
import Home from './Home';

const UserProfile: React.FC = function () {
  // fetch user data from chain based on w3 <points>
  const { web3Address } = useParams<{ web3Address: string }>();
  const { data, isError, isLoading: isInitiallyLoading, error } = useChainUser(web3Address);
  if (!data) {
    // When no data it's either loading the query or errred. No idling.
    if (isInitiallyLoading) {
      return <p>Loading...</p>;
    }
    if (isError) {
      const errMessage = error.message;
      //   user doesn't exist. JSON err.
      if (isJsonObject(errMessage)) {
        const jsonErr = JSON.parse(errMessage) as { error: string }; // Extract to own type.
        return <p>Error {jsonErr.error}</p>;
      }
      // Other err.
      return <p>Error {errMessage} </p>;
    }
    // Undefined.
    return <p>Something's not right. Undefined state, user profile.</p>;
  }
  return <Home user={data} />;
};
export default UserProfile;
