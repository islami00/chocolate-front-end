import { Toaster } from 'react-hot-toast';

import Form from './form';

const SignUp: React.FC = () => (
  <div className='login'>
    <Form />
    <Toaster />
  </div>
);

export default SignUp;
