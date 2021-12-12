import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useAuthService } from 'chocolate/common/providers/authProvider';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Redirect } from 'react-router-dom';
import { Form } from 'semantic-ui-react';

interface SignUpMut {
  uname: string;
  ps: string;
  web3Address: string;
  captcha: string;
}
const LOGIN_MUTATION = async (form: SignUpMut) => {
 let headersList = {
 "Accept": "application/json",
 "Content-Type": "application/json",
}

const scc = await fetch("http://localhost:3000/login", { 
  method: "POST",
  body: JSON.stringify(form),
  headers: headersList
}).then(function(response) {
  return response.text();
}).then(function(data) {
  console.log(data);
})
  return scc;
};
const redirect = (route: string) => <Redirect to={route} />;
const Login: React.FC = function () {
  // try to read secret key - jwt
  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);
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
      setForm({ ...form, captcha: token });
    }
  }, [token]);
  const loginMutation = useMutation(LOGIN_MUTATION);
  if(loginMutation.status === 'success'){
    return redirect('/');
  }
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

  const onError = (err: any) => {
    console.log(`hCaptcha Error: ${err}`);
  };

  // try to establish session with secret key - jwt
  // if session is established, redirect to /home
  // if session is not established, redirect to /signup
  // else render signup

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
if(token)          loginMutation.mutate(form);

  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div>
      {!isAuthenticated ? (
        <Form onSubmit={handleSubmit}>
          <Form.Input
            fluid
            label='Username'
            name='uname'
            value={form.uname}
            onChange={handleChange}
          />
          <Form.Input fluid label='Password' name='ps' value={form.ps} onChange={handleChange} />
          <Form.Button
            type='submit'
            content='Submit'
            fluid
          
            color='purple'
            onChange={handleChange}
          />
        </Form>
      ) : (
        redirect('/')
      )}
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
