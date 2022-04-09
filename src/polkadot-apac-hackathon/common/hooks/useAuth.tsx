// will be more full blown, but fn returns true and a user object
// leverages useAuth and returns results from that reducer**
/* eslint-disable import/no-unresolved */
import { ApiErr, errorHandled } from 'chocolate/customComponents/utils';
/* eslint-enable import/no-unresolved */
import { useQuery, UseQueryResult } from 'react-query';

const isDebug = process.env.REACT_APP_DEBUG === 'true';
interface AuthRes {
  success: boolean;
  user: {
    publicKey: string;
  };
}
// a more proper impl should poll useAuth for the user object and authenticated state
// this useAuth hook can be used to get state from server and update the store in signup interaction frequently
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    publicKey: string;
  };
}
type AuthStateFx = () => UseQueryResult<AuthState, Error>;
/**
 * This hook buttresses the authProvider by providing some state and initialisation logic external to the login page.
 * Basically, It pings the server to see if the user is logged in.
 * */
export const useAuthState: AuthStateFx = () => {
  const authCheckEndpoint = `${process.env.REACT_APP_AUTH_SERVER}/auth/check`;
  const fetchServer = async function () {
    const unauthorized = { isAuthenticated: false, user: { publicKey: '' } };
    const headers = {
      Accept: 'application/json',
    };
    const res = await errorHandled(
      fetch(authCheckEndpoint, { method: 'GET', headers, credentials: 'include' })
    );
    if (res[1]) {
      const msg = res[1].message;
      const errorObj = JSON.parse(msg) as ApiErr; // Should be an object of that shape. Reevaluate errorHandled if otherwise.
      if (isDebug)
        console.assert(
          !errorObj.code,
          `Error obj is as expected with code passed ${JSON.stringify(errorObj)}`
        );
      // Case 1: logged out.
      if (errorObj.code === 401) {
        return unauthorized;
      }
      // Else, undefined state. Throw.
      throw res[1];
    }
    const succ = await errorHandled<AuthRes>(res[0].json());
    if (succ[1]) throw succ[1]; // Undefined state.
    // Case 2:  Logged in.
    return { isAuthenticated: succ[0].success, user: succ[0].user };
  };
  const qry = useQuery<AuthState, Error>('auth', fetchServer, {
    // Refresh instead.
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 30, // session time to refresh.
    retry: 3,
    refetchInterval: false,
    // Override default err
    onError: () => {},
  });

  return qry;
};
