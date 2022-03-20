import { createContext, Reducer, useEffect, useContext, useReducer } from 'react';
import { useAuthState } from '../hooks/useAuth';

const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    publicKey: '',
  },
  login: (user: { publicKey: string }) =>
    console.error('Login context not initialised properly', user),
  logout: () => {},
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
  const stateAuth = useAuthState();

  useEffect(() => {
    if (stateAuth.isAuthenticated) {
      login(stateAuth.user);
    } else if (!stateAuth.isAuthenticated) {
      // else logout from here
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateAuth.isAuthenticated]);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated: state.isAuthenticated, user: state.user, login, logout }}
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
