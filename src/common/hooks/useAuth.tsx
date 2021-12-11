// will be more full blown, but fn returns true and a user object
// leverages useAuth and returns results from that reducer**
// a more proper impl should poll useAuth for the user object and authenticated state
type AuthState = () => {
  isAuthenticated: boolean;
  user: {
    publicKey: string;
  };
};
export const useAuthState: AuthState = () => ({
  isAuthenticated: true,
  user: {
    publicKey: 'John Doe',
  },
});
