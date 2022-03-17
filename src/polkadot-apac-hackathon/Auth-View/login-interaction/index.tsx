import HCaptcha from '@hcaptcha/react-hcaptcha';
// eslint-disable-next-line import/no-unresolved
import { useAuthService } from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useLocation, Location as RRLocation } from 'react-router-dom';
import { Form, FormProps, InputOnChangeData } from 'semantic-ui-react';

interface LoginLocation extends RRLocation {
  state: {
    from?: string;
  };
}
interface SignUpMut {
  uname: string;
  ps: string;
  web3Address: string;
  captcha: string;
}
const LOGIN_MUTATION = async (form: SignUpMut) => {
  const headersList = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const scc = (await fetch(`${process.env.REACT_APP_AUTH_SERVER}/login`, {
    method: 'POST',
    body: JSON.stringify(form),
    headers: headersList,
  }).then((response) => response.json())) as {
    success: boolean;
    publicKey: string | undefined;
  };

  return scc;
};
const Login: React.FC = function () {
  const captchaRef = useRef<HCaptcha>(null);
  const navigate = useNavigate();
  const location = useLocation() as LoginLocation;
  const [token, setToken] = useState<string>(null);
  const { isAuthenticated } = useAuthService();
  const [form, setForm] = useState({
    uname: '',
    ps: '',
    web3Address: '',
    captcha: '',
  });
  useEffect(() => {
    if (token && form.ps && form.uname && form.web3Address) {
      // Token is set, can submit here
      setForm((f) => ({ ...f, captcha: token }));
    }
  }, [token, form.ps, form.uname, form.web3Address]);
  const auth = useAuthService();

  const loginMutation = useMutation(LOGIN_MUTATION);
  if (loginMutation.status === 'success') {
    auth.login({ publicKey: loginMutation.data.publicKey });
    const redirectUrl = location?.state?.from ?? '/';
    navigate(redirectUrl);
  }

  // const onSubmit = () => {
  //   // this reaches out to the hcaptcha library and runs the
  //   // execute function on it. you can use other functions as well
  //   // documented in the api:
  //   // https://docs.hcaptcha.com/configuration#jsapi
  //   captchaRef.current.execute();
  // };

  const onExpire = () => {
    console.log('hCaptcha Token Expired');
  };

  const onError = (err: string) => {
    console.log(`hCaptcha Error: ${err}`);
  };
  // Redirect to last location if signed in, else render sign in component.

  const handleSubmit: (e: FormEvent<HTMLFormElement>, data: FormProps) => void = (e) => {
    e.preventDefault();
    if (token) loginMutation.mutate(form);
  };
  const handleChange: (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  if (isAuthenticated) {
    const redirectUrl = location?.state?.from ?? '/';
    navigate(redirectUrl);
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
        sitekey='dad203ef-ed62-47f3-965f-baa67b9dbbac'
        onVerify={setToken}
        onError={onError}
        onExpire={onExpire}
        ref={captchaRef}
      />
    </div>
  );
};
export default Login;
