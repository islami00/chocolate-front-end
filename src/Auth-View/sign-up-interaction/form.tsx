import React, { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styled from "styled-components";

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

export default function Form() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const captchaRef = useRef(null);

  const onSubmit = () => {
    // this reaches out to the hcaptcha library and runs the
    // execute function on it. you can use other functions as well
    // documented in the api:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };

  const onExpire = () => {
    console.log("hCaptcha Token Expired");
  };

  const onError = (err) => {
    console.log(`hCaptcha Error: ${err}`);
  };

  useEffect(() => {
    if (token) {
      // Token is set, can submit here
      console.log(`User Email: ${email}`);
      console.log(`hCaptcha Token: ${token}`);
    }
  }, [token, email]);

  return (
    <form>
      <input
        type="email"
        value={email}
        placeholder="Email adddress"
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <SubmitBtn onClick={onSubmit}>Submit</SubmitBtn>
      <HCaptcha
        // This is testing sitekey, will autopass
        // Make sure to replace
        sitekey="dad203ef-ed62-47f3-965f-baa67b9dbbac"
        onVerify={setToken}
        onError={onError}
        onExpire={onExpire}
        ref={captchaRef}
      />
      {token && <div>Success! Token: {token}</div>}
    </form>
  );
}
