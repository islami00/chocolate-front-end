import React, { useEffect } from 'react';

function Login(props) {
  const { user, setIsSignedUp } = props;
  //api.query.usersModule.users(keyring.getPairs()[0].address).then((resp)=>console.log(resp.value.isEmpty))
  // {isSignedUp} =  useSignedUp(address)
const  useSignedUp = (address) => {
  
};
  useEffect(() => {
    return () => {
      cleanup;
    };
  }, [user]);
  //define use signed up as a hook that runs after the keyring init and checks if the current user is signed up.
  // if the current user is not signed up , render sign up button and then send transaction for sign up. Else render login button and send that transaction

  if (!isSignedUp) return <h1>Sign up</h1>;

  return (
    <>
      <h1>Load user data</h1>
    </>
  );
}

export { Login };
