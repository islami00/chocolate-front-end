// will be more full blown, but fn returns true and a user object
// leverages useAuth and returns results from that reducer**
/* eslint-disable import/no-unresolved */
import { errorHandled } from 'chocolate/customComponents/utils';
/* eslint-enable import/no-unresolved */
import { useQuery } from 'react-query';

// a more proper impl should poll useAuth for the user object and authenticated state
// this useAuth hook can be used to get state from server and update the store in signup interaction frequently
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    publicKey: string;
  };
}
type AuthStateFx = () => AuthState;
export const useAuthState: AuthStateFx = () => {
  // Use websockets to listen to auth state changes from the server when porting this, as the server will publish
  const authCheckEndpoint = `${process.env.REACT_APP_AUTH_SERVER}/auth/check`;

  // poll server for auth state
  const fetchServer = async function () {
    const headers = {
      Accept: 'application/json',
    };
    const [response, err1] = await errorHandled(
      fetch(authCheckEndpoint, { method: 'GET', headers })
    );
    if (err1) {
      return {
        isAuthenticated: false,
        user: {
          publicKey: '',
        },
      };
    }
    const [data, err2] = await errorHandled<{
      success: boolean;
      user: { publicKey: string };
    }>(response.json());
    if (err2) throw err2; // sth happened with the json body, but user could be authed
    // no errors, err state and public key are trusted

    return { isAuthenticated: data.success, user: data.user };
  };
  const qry = useQuery<AuthState, Error>('auth', fetchServer, {
    refetchOnWindowFocus: true,
    // Little fix until auth is down.
    refetchInterval: Infinity,
  });
  if (qry.isLoading) return { isAuthenticated: false, user: { publicKey: '' } };
  if (qry.isError) console.log(qry.error);
  return qry.data;
};
