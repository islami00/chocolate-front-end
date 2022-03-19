import HCaptcha from '@hcaptcha/react-hcaptcha';
/* eslint-disable import/no-unresolved */
import { errorHandled } from 'chocolate/customComponents/utils';
import { useAuthService } from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
/* eslint-enable import/no-unresolved */
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Location as RRLocation, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Form, FormProps, InputOnChangeData } from 'semantic-ui-react';

interface LoginLocation extends RRLocation {
  state: {
    from?: string;
  };
}
interface SignInMut {
  uname: string;
  ps: string;
  captcha: string;
}
const LOGIN_MUTATION = async function (form: SignInMut) {
  const headersList = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  //
  const res = await errorHandled(
    fetch(`${process.env.REACT_APP_AUTH_SERVER}/login`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: headersList,
    })
  );
  if (res[1]) throw res[1];
  const scc = await errorHandled(res[0].json());
  if (scc[1]) throw scc[1];
  const result = scc[0] as {
    success: boolean;
    publicKey: string | undefined;
  };
  return result;
};
const Login: React.FC = function () {
  const captchaRef = useRef<HCaptcha>(null);
  const location = useLocation() as LoginLocation;
  const redirectUrl = location.state?.from ?? '/';
  const { isAuthenticated } = useAuthService();
  const [form, setForm] = useState<SignInMut>({
    uname: '',
    ps: '',
    captcha: '',
  });
  const auth = useAuthService();

  const loginMutation = useMutation(LOGIN_MUTATION);
  if (loginMutation.status === 'error') {
    // Strip out message
    const err = loginMutation.error as Error;
    const maybeMessage = err.message.split('ErrorMessage: ')?.[1];
    if (maybeMessage) toast.error('Error: '.concat(maybeMessage));
    else toast.error("We can't sign you in right now, please try again later");
  }
  useEffect(() => {
    if (loginMutation.status === 'success') {
      auth.login({ publicKey: loginMutation.data.publicKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginMutation.status, loginMutation.data]);

  // const onSubmit = () => {
  //   // this reaches out to the hcaptcha library and runs the
  //   // execute function on it. you can use other functions as well
  //   // documented in the api:
  //   // https://docs.hcaptcha.com/configuration#jsapi
  //   captchaRef.current.execute();
  // };

  const onExpire = () => {
    setForm((F) => ({ ...F, captcha: '' }));
    console.log('hCaptcha Token Expired');
  };

  const onError = (err: string) => {
    setForm((F) => ({ ...F, captcha: '' }));
    console.log(`hCaptcha Error: ${err}`);
  };
  const handleSubmit: (e: FormEvent<HTMLFormElement>, data: FormProps) => void = (e) => {
    e.preventDefault();
    if (!form.captcha) {
      captchaRef.current.execute();
      return;
    }
    loginMutation.mutate(form);
  };
  const handleChange: (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void = (
    _e,
    data
  ) => {
    setForm((F) => ({ ...F, [data.name]: data.value }));
  };
  const handleVerify: (token: string) => void = (token) => {
    setForm((F) => ({ ...F, captcha: token }));
  };
  // Redirect to last location if signed in
  if (isAuthenticated) {
    return <Navigate to={redirectUrl} />;
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          fluid
          label='Username'
          name='uname'
          value={form.uname}
          onChange={handleChange}
        />
        <Form.Input
          fluid
          label='Password'
          name='ps'
          type='password'
          value={form.ps}
          onChange={handleChange}
        />
        <Form.Button type='submit' content='Submit' fluid color='purple' onChange={handleChange} />
      </Form>
      <HCaptcha
        // This is testing sitekey, will autopass
        // Make sure to replace
        sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY ?? ''}
        onVerify={handleVerify}
        onError={onError}
        onExpire={onExpire}
        ref={captchaRef}
      />
    </div>
  );
};
export default Login;
