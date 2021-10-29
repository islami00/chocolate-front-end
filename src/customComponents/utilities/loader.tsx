import { chocolateLogo } from '../constants';
import { Loading } from '../loading';

export const loader = (text: string, greet = false): JSX.Element => (
  <Loading message={text} img={chocolateLogo} {...{ greet }} />
);
