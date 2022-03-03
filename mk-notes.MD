# Adding hCaptcha to site

Go to hcaptcha.com and signup with github account. You will get a sitekey. 

If you follow the https://docs.hcaptcha.com/ Then follow the ReactJS docs it has another example which seems cleaner > https://codesandbox.io/s/react-hcaptchaform-example-forked-ngxge?file=/src/Form.jsx:439-445

Essentially I copied the form as new file form.tsx changed the site key, then imported and added form element into the sgn-up page.

## sign-up page location
- auth-playground/src/Auth-View/sign-up-interaction/index.tsx


## Prior Attempts to make work for bad reference, last two sorta worked

```yarn add react-script-tag```

```At Head
// import ScriptTag from 'react-script-tag';
// const Captcha = props => (
// <ScriptTag type="text/javascript" src="https://js.hcaptcha.com/1/api.js" async defer/>
// )

// componentDidMount() {
//   const script = document.createElement("script");
//   script.src = "https://js.hcaptcha.com/1/api.js";
//   script.async = true;
//   document.body.appendChild(script);  
// } ;

// import HCaptcha from '@hcaptcha/react-hcaptcha';
```

```Inside: const SignUp: React.FC = () => {
const SignUp: React.FC = () => {
  // const [token, setToken] = useState(null);
  // const captchaRef = useRef(null);

  // const onLoad = () => {
  //   // this reaches out to the hCaptcha JS API and runs the
  //   // execute function on it. you can use other functions as
  //   // documented here:
  //   // https://docs.hcaptcha.com/configuration#jsapi
  //   captchaRef.current.execute();
  // };
```  

```Inside: const SignUp: React.FC = () => {
  // useEffect(() => {
  //   const scriptTag = document.createElement('script');

  //   scriptTag.src = "https://js.hcaptcha.com/1/api.js";
  //   scriptTag.async = false;

  //   document.head.appendChild(scriptTag);
  // }, []);  

  // useEffect(() => {

  //   if (token)
  //     console.log(`hCaptcha Token: ${token}`);

  // }, [token]);
```

```Inside: Div Form Form
      {/* <script src="https://js.hcaptcha.com/1/api.js" async defer></script> */}
      {/* <div className="h-captcha" data-sitekey="dad203ef-ed62-47f3-965f-baa67b9dbbac"></div> */}
      {/* <form>
        <HCaptcha
          sitekey="dad203ef-ed62-47f3-965f-baa67b9dbbac"
          onVerify={setToken}
          ref={captchaRef}
        />
      </form> */}
```      