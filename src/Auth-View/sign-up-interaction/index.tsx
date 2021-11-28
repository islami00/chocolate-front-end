import { useEffect, useRef, useState } from 'react';
import { Button, FormInput } from 'semantic-ui-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAccounts } from '../../substrate-lib/SubstrateContext';
import { errorHandled } from '../../customComponents/utils';
import { useSubstrate } from '../../substrate-lib';

const SignUp: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [accountAddress, setAccountAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useIsMounted();
  const state = useSubstrate();
  const { api, apiState, keyring } = state;
  const [isPolkadotJs, setIsPolkadotJs] = useState<boolean>(apiState === 'READY');
  const { dispatch, loadAccounts } = useAccounts();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // get the account for signing
      loadAccounts(state, dispatch);
      const [nonce, e1] = await errorHandled(getNonce(userName, accountAddress));
      if (e1) return toast.error(e1.message);

      // prompt first to select signer
      const [message, err2] = await errorHandled(signNonce(nonce, accountAddress, api));
      if (err2) return toast.error(err2.message);

      //  send message with shared key and then finally store secret key for further interactions in n period (jwt) - prehandled. Returns user data
      const [claimData, err3] = await errorHandled(sendMessage(message, userName, accountAddress));
      if (err3) return toast.error(err3.message);
      setLoading(false);
    } catch (submitError: unknown) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else setError(submitError.toString());
      setLoading(false);
    }
  };
  useEffect(() => {
    // toast error if error and not mounted
    if (isMounted && error && !loading) {
      toast.error(error);
    }

    return () => {
      // clean up
    };
  }, []);
  return (
    <div className='login'>
      <Toaster />
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          type='userName'
          name='userName'
          value={userName}
          handleChange={(e) => setUserName(e.target.value)}
          label='UserName'
        />{' '}
        {/* be abstract, feature check for polkadot js - done by api state */}
        {/* set things up for signup interaction. load accounts, render account selector - move to different page pls. */}
        <Button type='submit' disabled={isPolkadotJs || loading}>
          {loading ? 'Loading...' : 'Login with Polkadot-js extension'}
        </Button>
      </form>
      <div className='error'>{error}</div>
    </div>
  );
};

export default SignUp;

// check if component is mounted - inspired by polkadotjs lib
function useIsMounted() {
  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );
  return isMounted.current;
}

async function getNonce(userName: string, accountAddress: string) {
  throw new Error('Function not implemented.');
}

async function signNonce(nonce: any, accountAddress: string, api: any) {
  throw new Error('Function not implemented.');
}

async function sendMessage(message: any, userName: string, accountAddress: string) {
  throw new Error('Function not implemented.');
}
