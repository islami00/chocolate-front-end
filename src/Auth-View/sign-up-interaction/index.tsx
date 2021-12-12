import { useEffect, useRef, useState } from 'react';
import { Button, FormInput } from 'semantic-ui-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAccounts } from '../../substrate-lib/SubstrateContext';
import { errorHandled } from '../../customComponents/utils';
import { useSubstrate } from '../../substrate-lib';

import Form from './form';

const SignUp: React.FC = () => (
  <div className='login'>
    <Form />
    <Toaster />
  </div>
);

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
