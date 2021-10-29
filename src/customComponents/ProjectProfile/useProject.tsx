import { VoidFn } from '@polkadot/api/types';
import { Option } from '@polkadot/types';
import { ProjectAl } from 'chocolate/interfaces';
import { useSubstrate } from 'chocolate/substrate-lib';
import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
/**
 * @description enable only when websocket is needed
 * Note: To be called only inside useProject(). Can be generalised for all api subs
 * */
const useWs = (id: string, debug = false) => {
  const { api } = useSubstrate();
  const queryId = ['project', id];
  const queryClient = useQueryClient();
  // ws connection.
  const onProjectChange = (newProject: Option<ProjectAl>) => {
    const unwrapped = newProject.unwrapOr<0>(0);
    queryClient.setQueryData<ProjectAl | 0>(queryId, unwrapped);
    if (debug) console.count('Passed live ws data');
  };
  const subscribeToWs = useCallback(
    () => api.query.chocolateModule.projects(id, onProjectChange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    let unsub: undefined | VoidFn;
    const un = subscribeToWs();
    un.then((unsubscribe) => {
      unsub = unsubscribe;
      if (debug) console.count('Passed unsub, meaning subscribed!');
    });
    return () => unsub && unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, subscribeToWs]);
};
/**
 * @description This implementation assumes the staticProject is not live.
 * It also assumes it is being called under a substrate provider and a queryClientProvider
 */
export default function useProject(
  id: string,
  debug = false
): UseQueryResult<0 | ProjectAl> {
  const { api } = useSubstrate();
  const queryId = ['project', id];
  // let rq handle it
  const getStaticProject = async () => {
    const staticProject = await api.query.chocolateModule
      .projects(id)
      .then((opt) => opt.unwrapOr<0>(0));
    if (debug) console.count('Got static project');
    return staticProject;
  };

  return useQuery(queryId, getStaticProject);
}
