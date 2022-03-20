import { createContext, Reducer, useContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useAuthState } from '../hooks/useAuth';

const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    publicKey: '',
  },
  login: (user: { publicKey: string }) =>
    console.error('Login context not initialised properly', user),
  logout: () => {},
  // Use this to run the user skeleton. State handled by auth query's initial run.
  isInitiallyLoading: true,
});
interface AuthReducerState {
  isAuthenticated: boolean;
  user: {
    publicKey: string;
  };
}
interface AuthReducerActions {
  type: string;
  payload?: {
    user: {
      publicKey: string;
    };
  };
}
// login, logout independent of any furthers, only store user info
const AuthReducer: Reducer<AuthReducerState, AuthReducerActions> = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: {
          publicKey: '',
        },
      };
    default:
      return state;
  }
};
/** This provider manages login state of a user on the app, independent of the server. It only stores the user object and no mutations. */
const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    isAuthenticated: false,
    user: {
      publicKey: '',
    },
  });

  const login = (user: { publicKey: string }) => {
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = () => {
    // Log user out on server too.
    // Not implemented yet for manual logout. WIP.
    dispatch({ type: 'LOGOUT' });
  };
  // Provide a loading state so UI can react more.
  const stateQ = useAuthState();

  useEffect(() => {
    if (!stateQ.data) {
      if (stateQ.status === 'error') {
        // Infinite loading if on initial run stateQ errs, show users something.
        toast.error('Something went wrong logging you in, please refresh your browser');
      }
      return;
    }
    if (stateQ.data.isAuthenticated) {
      login(stateQ.data.user);
    } else if (!stateQ.data.isAuthenticated) {
      logout();
    }
  }, [stateQ.data, stateQ.status]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        login,
        logout,
        isInitiallyLoading: stateQ.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAuthService = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Handle more gracefully.
    throw new Error('useAuthService must be used within a AuthProvider');
  }
  return context;
};
export default AuthProvider;
