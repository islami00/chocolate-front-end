import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import styled from 'styled-components';
/* eslint-disable import/no-unresolved */
import { errorHandled } from 'chocolate/customComponents/utils';
/* eslint-enable import/no-unresolved */

import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

const SubmitBtn = styled.div`
  width: 100px;
  height: 30px;
  border-radius: 2px;
  background-color: #f3f3f3;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 10px;

  &:hover {
    background-color: #d0d0d0;
  }
`;
interface SignUpMut {
  uname: string;
  ps: string;
  web3Address: string;
  captcha: string;
}
const doSignUp = async (mut: SignUpMut) => {
  // validation first
  const loginEndpoint = 'http://localhost:3000/register';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const [res, err] = await errorHandled(
    fetch(loginEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(mut),
    })
  );
  if (err) return { success: false };
  const json = (await res.json()) as { success: boolean };
  return json;
};

const useSignupMutation = (form: SignUpMut, start: boolean) => {
  const mutation = useMutation(doSignUp);
  if (start) {
    mutation.mutate(form, {
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });
  }
  return mutation;
};

export default function Form(): JSX.Element {
  const [token, setToken] = useState<string>(null);
  const [form, setForm] = useState({
    uname: '',
    ps: '',
    web3Address: '',
    captcha: '',
  });
  const [startMutation, setStartMutation] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = () => {
    // this reaches out to the hcaptcha library and runs the
    // execute function on it. you can use other functions as well
    // documented in the api:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };

  const onExpire = () => {
    console.log('hCaptcha Token Expired');
  };

  const onError = (err: string) => {
    console.log(`hCaptcha Error: ${err}`);
  };
  const res = useSignupMutation(form, startMutation);
  useEffect(() => {
    if (token && form.ps && form.uname && form.web3Address) {
      setForm((f) => ({ ...f, captcha: token }));
      setStartMutation(true);
    }
    // Keep: react-hooks/exhaustive-deps
    // Possible infinite loop
  }, [token, form.ps, form.uname, form.web3Address]);
  useEffect(() => {
    if (res.data) {
      if (res.data.success) {
        toast.success('Successfully registered');
      } else {
        toast.error('Registration failed');
        res.reset();
      }
    } else if (startMutation) setStartMutation(false);
    // Possible infinite loop
  }, [startMutation, res]);

  return (
    <form>
      <input
        required
        type='username'
        value={form.uname}
        name='uname'
        placeholder='Username'
        onChange={changeHandler}
      />
      <input
        required
        type='password'
        value={form.ps}
        name='ps'
        placeholder='Password'
        onChange={changeHandler}
      />
      <input
        required
        type='text'
        value={form.web3Address}
        name='web3Address'
        placeholder='web3Address'
        onChange={changeHandler}
      />

      <SubmitBtn onClick={onSubmit}>Submit</SubmitBtn>
      <HCaptcha
        // This is testing sitekey, will autopass
        // Make sure to replace
        sitekey='dad203ef-ed62-47f3-965f-baa67b9dbbac'
        onVerify={setToken}
        onError={onError}
        onExpire={onExpire}
        ref={captchaRef}
      />
      {token && <div>Success! Token: {token}</div>}
    </form>
  );
}
