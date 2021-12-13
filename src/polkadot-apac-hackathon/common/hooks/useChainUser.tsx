import { ApiPromise } from '@polkadot/api';
import { useQuery } from 'react-query';
import type { UseQueryResult } from 'react-query';
import { useSubstrate } from '../../../substrate-lib';
import { User } from '../../../typeSystem/jsonTypes';

const findUser = async (api: ApiPromise, web3Address: string) => {
  const user = await api.query.usersModule.users(web3Address);
  const chainUser = user.unwrapOrDefault();
  const jsonUser = chainUser.toJSON() as unknown as User;
  return jsonUser;
};
const useChainUser = (web3Address: string): UseQueryResult<User, Error> => {
  const { api } = useSubstrate();
  const queryKey = ['user', web3Address];
  return useQuery<User, Error>(queryKey, () => findUser(api, web3Address));
};
export default useChainUser;
