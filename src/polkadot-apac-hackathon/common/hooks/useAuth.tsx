// will be more full blown, but fn returns true and a user object
// leverages useAuth and returns results from that reducer**
/* eslint-disable import/no-unresolved */
import { ApiErr, errorHandled } from 'chocolate/customComponents/utils';
/* eslint-enable import/no-unresolved */
import { useQuery } from 'react-query';

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
type AuthStateFx = () => AuthState;
/**
 * This hook buttresses the authProvider by providing some state and initialisation logic external to the login page.
 * Basically, It pings the server to see if the user is logged in.
 * */
export const useAuthState: AuthStateFx = () => {
  const authCheckEndpoint = `${process.env.REACT_APP_AUTH_SERVER}/auth/check`;
  const fetchServer = async function () {
    const headers = {
      Accept: 'application/json',
    };
    const res = await errorHandled(
      fetch(authCheckEndpoint, { method: 'GET', headers, credentials: 'include' })
    );
    // User logged out, throw.
    if (res[1]) throw res[1];
    const succ = await errorHandled<AuthRes>(res[0].json());
    if (succ[1]) throw succ[1];
    return succ[0];
  };
  const qry = useQuery<AuthRes, Error>('auth', fetchServer, {
    // Refresh instead.
    refetchOnWindowFocus: false,
    // Only run once.
    retry: 3,
    refetchInterval: false,
    // Override default err
    onError: () => {},
  });
  // Include loading state and have data checked manually.
  const unauthorizedRes = { isAuthenticated: false, user: { publicKey: '' } };
  // Means user is not logged in initially
  if (!qry.data) return unauthorizedRes;
  // Means checked failed at some point.
  if (qry.isError) {
    const err = JSON.parse(qry.error.message) as ApiErr;
    if (err.error === 'Unauthorized') {
      // User is properly logged out.
      return unauthorizedRes;
    }
  }
  const { data } = qry;
  return { user: data.user, isAuthenticated: data.success };
};
