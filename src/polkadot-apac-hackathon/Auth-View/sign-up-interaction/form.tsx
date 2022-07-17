import HCaptcha from '@hcaptcha/react-hcaptcha';
/* eslint-disable import/no-unresolved */
import config from 'chocolate/config';
import { ApiErr, errorHandled } from 'chocolate/customComponents/utils';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
/* eslint-enable import/no-unresolved */
import { Link, Location as RRLocation, useLocation } from 'react-router-dom';
import { Form, FormProps, InputOnChangeData } from 'semantic-ui-react';

interface SignupLocation extends RRLocation {
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
const SIGNUP_MUTATION = async function (form: SignUpMut) {
  const headersList = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  //
  const res = await errorHandled(
    fetch(`${config.REACT_APP_AUTH_SERVER}/register`, {
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
const isDebug = config.REACT_APP_DEBUG;
const SignUp: React.FC = function () {
  const captchaRef = useRef<HCaptcha>(null);
  // const navigate = useNavigate();
  const location = useLocation() as SignupLocation;
  const redirecturl = location.state?.from ?? '/'; // Handle with query params later.
  // const [count,dispatch] =  useMachine(); // trigger in a useEffect based on signUpMutation status
  const [form, setForm] = useState<SignUpMut>({
    uname: '',
    ps: '',
    web3Address: '',
    captcha: '',
  });
  // const auth = useAuthService();

  const signUpMutation = useMutation(SIGNUP_MUTATION);
  if (signUpMutation.status === 'error') {
    const err = signUpMutation.error as Error;
    const stdMsg = JSON.parse(err.message) as ApiErr; // Always. Assured by errorHandled.
    const maybeMessage = stdMsg.error;
    if (maybeMessage) toast.error('Error: '.concat(maybeMessage));
    else toast.error("We can't sign you up right now, please try again later");
    signUpMutation.reset();
  }
  if (signUpMutation.status === 'success') {
    // if (count === 5) {
    //   const redirecturl = location.state.from ?? '/';
    //   navigate('/login', { state: { from: redirecturl } });
    // }
    // Return redirect component, counter should have been started.
    return (
      <p>
        You've successfully signed in, you will be redirected automatically to the login page to
        credentials you signed up with in 5 seconds.
        <br /> If you're not automatically redirected, use this{' '}
        <Link to='/login' state={{ from: redirecturl }}>
          link
        </Link>
      </p>
    );
  }

  // const onSubmit = () => {
  //   // this reaches out to the hcaptcha library and runs the
  //   // execute function on it. you can use other functions as well
  //   // documented in the api:
  //   // https://docs.hcaptcha.com/configuration#jsapi
  //   captchaRef.current.execute();
  // };

  const onExpire = () => {
    setForm((F) => ({ ...F, captcha: '' }));
  };

  const onError = (err: string) => {
    setForm((F) => ({ ...F, captcha: '' }));
    if (isDebug) console.error(`hCaptcha Error: ${err}`);
  };
  const handleSubmit: (e: FormEvent<HTMLFormElement>, data: FormProps) => void = (e) => {
    e.preventDefault();
    if (!form.captcha) {
      captchaRef.current.execute();
      return;
    }
    signUpMutation.mutate(form);
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
  // Shouldn't happen
  // // Redirect to last location if signed in before coming here.
  // if (isAuthenticated) {
  //   const redirectUrl = location.state?.from ?? '/';
  //   navigate(redirectUrl);
  // }
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
        <Form.Input
          required
          type='text'
          value={form.web3Address}
          name='web3Address'
          placeholder='web3Address'
          onChange={handleChange}
        />
        <Form.Button type='submit' content='Submit' fluid color='purple' onChange={handleChange} />
      </Form>
      <HCaptcha
        sitekey={config.REACT_APP_CAPTCHA_SITE_KEY}
        onVerify={handleVerify}
        onError={onError}
        onExpire={onExpire}
        ref={captchaRef}
      />
    </div>
  );
};

export default SignUp;
