import { createContext, Reducer, useContext, useEffect, useReducer } from 'react';
import { useAuthState } from '../hooks/useAuth';

const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    publicKey: '',
  },
  login: (user: { publicKey: string }) => {},
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
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: {
          publicKey: '',
        },
      };
    default:
      return state;
  }
};

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
    dispatch({ type: 'LOGOUT' });
  };
  const stateAuth = useAuthState();

  useEffect(() => {
    if (stateAuth.isAuthenticated && !state.isAuthenticated) {
      login(stateAuth.user);
    } else if (state.isAuthenticated && !stateAuth.isAuthenticated) {
      // else logout from here
      logout();
    }
  }, [stateAuth]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: state.isAuthenticated, user: state.user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthService = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthService must be used within a AuthProvider');
  }
  return context;
};
export default AuthProvider;
