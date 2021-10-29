import { AnyJson } from '@polkadot/types/types';
import { Err } from '../err';

export const message = (err: AnyJson, fof = false): JSX.Element => (
  <Err four={fof} thisError={err} />
);
