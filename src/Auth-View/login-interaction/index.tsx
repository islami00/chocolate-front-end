import { useState } from 'react';
import { Redirect } from 'react-router';

const redirect = (route) => <Redirect to={route} />;
const Login: React.FC = function () {
  // try to read secret key - jwt

  // try to establish session with secret key - jwt
  // if session is established, redirect to /home
  // if session is not established, redirect to /signup
  // else render signup
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <div>
      {isLoggedIn ? redirect('/') : null}
      {!isSignUp ? redirect('/sign-up') : null}
    </div>
  );
};
export default Login;
