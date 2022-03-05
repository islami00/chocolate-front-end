import { ApiPromise } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { Option, StorageKey } from '@polkadot/types';
import { useEffect, useMemo } from 'react';
import { QueryStatus, useQueries, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { ProjectAl, ProjectID } from '../../interfaces';
import { useSubstrate } from '../../substrate-lib';
import {
  ChainProject,
  Chocolate,
  NewMetaData,
  NewProjectWithIndex
} from '../../typeSystem/jsonTypes';
import { combineLimit, errorHandled, toPinataFetch } from '../utils';

/**
 * OwnerID shoould be changed to projectAddress in input
 * @description gets the projects and filters them by not proposed, and adds exta data e.g subscan links and also dispatches state update
 */
const getProjects = async function (
  projects: Promise<[StorageKey<[ProjectID]>, Option<ProjectAl>][] | undefined>
): Promise<NewProjectWithIndex[]> {
  const debug = false;
  if (debug) console.log(projects);
  // projects are properly passed here
  if (!(projects instanceof Promise)) throw new Error('Passed in wrong values');
  const usable = await projects;
  if (debug) console.clear();
  if (debug) console.log(usable);
  const mutatedProjects = usable?.map(async (each) => {
    const [id, project] = each;

    // @ts-expect-error AnyJson is an array type in this case.
    const [[rawId], rawProject] = [id.toHuman(), project.unwrapOrDefault()];
    if (rawProject.isEmpty) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const Id: Chocolate['ProjectID'] = rawId;
    // @ts-expect-error this is te project type returned
    const secondReturnable: Chocolate['Project'] = rawProject.toHuman();
    const metaArr = await errorHandled(fetch(toPinataFetch(secondReturnable.metadata)));
    if (metaArr[1]) throw metaArr[1];
    const realMeta: NewMetaData = (await metaArr[0].json()) as NewMetaData;
    realMeta.icon = `https://avatars.dicebear.com/api/initials/${realMeta.name}.svg`;
    const newRet = { ...secondReturnable, metadata: realMeta };
    const ret: NewProjectWithIndex = { Id, project: newRet };
    return ret;
  });
  const mut = await Promise.all(mutatedProjects);
  const cleanProjects = mut.filter((each) => each !== null && each !== undefined);
  return cleanProjects;
};
/** @description  Get all projects as usable jsons and sort by id */
const useProjects = function (): UseQueryResult<NewProjectWithIndex[], unknown> {
  const { api } = useSubstrate();
  // To-do: refactor to useQuery 'chain', 'projects' and useQuery 'ipfs' , 'metadata'
  // then include utility function to consolidate both types. but we good for now. Collects both
  async function fetchProjects() {
    const ret = await getProjects(api.query.chocolateModule.projects.entries());
    ret.sort((pr1, pr2) => {
      let x = 1;
      if (pr1.Id < pr2.Id) x = -1;
      else if (pr1.Id === pr2.Id) x = 0;
      return x;
    });
    return ret;
  }
  return useQuery('projects', fetchProjects);
};
/**
 * @description Get the keys of all projects from the chain.
 * Fallback here would be same as next hook. Throw if you haven't memoised and the api isn't available
 * Else return memo. Let react query handle retries.
 *
 */
const useProjectKeys = function (api: ApiPromise) {
  const serKeys = async () => {
    const keys = await api.query.chocolateModule.projects.keys();
    return keys.map((id) => id.args[0]);
  };
  return useQuery('project keys', serKeys);
};

// Get the project using useQueries, then update with WS.
/**
 * QueryKey is ["Project",ProjectID]
 * Fallback here would be to reject if api is unavailable and we haven't memoised.
 * Else we simply return memoised value.
 *  */
const useParallelProjects = function (api: ApiPromise, keys: ProjectID[], shouldFire: boolean) {
  // We require a ready api. This should be handled at the top level of any component that needs substrate
  // See if removing this avoids issues.
  const getOne = async function (key: ProjectID) {
    const proj = await api.query.chocolateModule.projects(key);
    // Handle err in a better way.
    // Returning key allows us to track project later
    return [proj.unwrapOrDefault(), key] as [ProjectAl, ProjectID];
  };

  const projects = useQueries(
    keys.map((each) => ({
      queryKey: ['Project', each.toJSON()],
      queryFn: () => getOne(each),
      enabled: shouldFire,
      // We'll refetch
      staleTime: Infinity,
    }))
  );
  return projects;
};
/**  Then deal with websockets
 * Fallback here would be shouldFire && !fallback
 */
const useProjectsSubscription = function (api: ApiPromise, keys: ProjectID[], shouldFire: boolean) {
  const queryClient = useQueryClient();
  let unsub: VoidFn;
  //  Subscribe once, more efficient with connections.
  useEffect(() => {
    if (shouldFire)
      api.query.chocolateModule.projects
        .multi<Option<ProjectAl>>(keys, (prs) => {
          // We assume the returned values match the keys
          keys.forEach((key, index) => {
            const ithProject = prs[index].unwrapOrDefault();

            queryClient.setQueryData<[ProjectAl, ProjectID]>(
              ['Project', key.toJSON()],
              (checkAgainst) => {
                if (!checkAgainst) {
                  console.error('Set query data before initial query', key.toJSON(), ithProject);
                  return [ithProject, key.toJSON()];
                }
                const [project, id] = checkAgainst;
                // Concrete check
                if (key.eq(id)) {
                  return [ithProject, id];
                }
                return [project, id];
              }
            );
          });
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        .then((v) => (unsub = v))
        .catch(console.error);
    return () => unsub && unsub();

    // More suited to gallery page where real time data is needed.
    // Reasonable deps , length tracks new adds, shouldfire waits for first fetch. Realtime reqs of searchbar aren't much.
  }, [keys.length, shouldFire]);
};
// Then get json metadata
// Doesn't require api. SHould be fine so long as dependent memoises
// This guy's should fire depends on useParallelProjects
const useProjectsWithMetadata = function (projects: [ProjectAl, ProjectID][], shouldFire: boolean) {
  // Rate limit me -- I don't cause rerenders.
  const retrieveMeta = async function ([pr, id]: [ProjectAl, ProjectID]) {
    // Get metadata
    const res = await errorHandled(fetch(toPinataFetch(pr.metadata.toJSON())));
    if (res[1]) throw res[1];
    const json = await errorHandled<NewMetaData>(res[0].json());
    if (json[1]) throw json[1];

    //  Merge metadata in.
    // First, json stringify (This should be handled by a wrapper class)
    const prString = pr.toHuman() as unknown as ChainProject;
    const nPr = {
      Id: id.toHuman(),
      project: { ...prString, metadata: json[0] },
    } as NewProjectWithIndex;
    return nPr;
  };
  const slowlyRetrieveMeta = combineLimit(retrieveMeta, 1000, 3);
  // Project call.
  // The queries would change if the CIDs change. So, make the stale time infinity also.
  return useQueries(
    projects.map(([v, k]) => ({
      queryKey: ['Project', 'Metadata', k.toJSON(), v.metadata.toJSON()],
      queryFn: () => slowlyRetrieveMeta([v, k]),
      enabled: shouldFire,
      staleTime: Infinity,
    }))
  );
};

// This guy returns an array of booleans indicating success and other states of the query results. Sort of serialising them.
// Doesn't need to memoise if passer does.
/**  [valids, erred, loadingInitially, statuses] */
const shouldComputeValid = function <T>(metas: UseQueryResult<T, unknown>[]) {
  // This is a good control for the visual useMemo. We can silently fail, that is allowed for search.
  // We could also sort out which ones have an error and do a little toast if an error occurd.
  const erred = metas.some((each) => each.isError);
  if (erred) console.error('Failed to fetch the metadata of some project');
  // We could also check if any is loading to show a loader. This would be at the bottom.
  // We can actually return this loading so the searchbar can just listen in and know to place a spinner with text that says: Fetching more projects for loading.
  const loadingInitially = metas.some((each) => each.isLoading);
  if (loadingInitially) console.log('Some project is loading for the first time');
  // Return state of all and leave check to others
  const states = metas.map((each) => each.status);
  const valids = metas.map((each) => [each.data, each.dataUpdatedAt] as [T, number]);
  return [valids, erred, loadingInitially, states] as [
    typeof valids,
    boolean,
    boolean,
    typeof states
  ];
};
// Should be like: const [valids]  =  useMemo(() => shouldComputeValid(metas), [metas])
// Then const prjs =  useMemo(()=> projects(valids), [valids]);
const resArr = function <T>(valids: [T, number][]) {
  // Check if data is defined
  const defined = valids.filter((each) => !!each[0]);
  // Collect only the project, last updated at simply limits this.
  const readies = defined.map((each) => each[0]);
  return readies;
};
// Same here for state
// Now we start applying.
const allCheck = function (states: QueryStatus[], status: QueryStatus) {
  return states.reduce((prev, current) => prev === true && current === status, true);
};
/**
 * Returns: [projects, isAnyError, isAnyInitiallyLoading, areAllIdle ]
 *
 * Note: I used useMemo in place of useEffect here, it probably won't trigger a rerender so replace with useEffect and useStates
 *  Also, it is the responsibility of the calling component to ensure the api is available. The calling component should also handle the situation where the api is unavailable.
 * At this hook's end, it'll memoise its return value and return it instead if the api were to become unavailable
 * I'll do that later. But, essentially everyone needs to be able to handle a situation where the api is not available by memoising
 * Rn the wrapper on the app does that, so we're mostly safe.
 */
// Refactor tip: Refs to the rescue! https://usehooks.com/usePrevious/
// Use this at the top level so that when the api goes out, we use the previous value.
// All hooks requiring the substrate api should memoise value and accept a fallback parameter that says whether or not to use that last value.
// We then return the value of usePrevious instead of failing to use the apiPromise.
// Also, memoise vigorously in regular functions.
// Lastly, use[\w] to grep for hooks.
// Complete impl limits to 24 renders, further renders are caused by looking for project keys. Could be solved by subscribing to the keys and updating as needed.
// But this mostly fixes things.
const useSearchData = function (
  api: ApiPromise
): [NewProjectWithIndex[], boolean, boolean, boolean] {
  // Start project loop
  const { data: keys, status } = useProjectKeys(api);
  const parallelProjects = useParallelProjects(api, keys ?? [], status === 'success');
  // This'll be a problem anyways.
  const parallels = useMemo(() => shouldComputeValid(parallelProjects), [parallelProjects]);
  // Replacement for memo. Lazy state and a single effect -Causes infinite render, I just want to memoise lmao.
  // Replace this too
  const validParallels = parallels[0];
  const readyParallels = useMemo(() => resArr(validParallels), [validParallels]);
  // Ideally this subscription should come after every project has completed too and we have keys
  useProjectsSubscription(
    api,
    keys ?? [],
    status === 'success' && allCheck(parallels[3], 'success')
  );
  // Metas should give enough time for parallel projects to complete fetching
  const metas = useProjectsWithMetadata(readyParallels, allCheck(parallels[3], 'success'));
  // Same for these two, replace useMemo -- No, infinite render.
  const vMetaArr = useMemo(() => shouldComputeValid(metas), [metas]);

  const [validMetas, anyMetaErr, anyMetaInitiallyLoading, metaStates] = vMetaArr;
  const readyMetas = useMemo(() => resArr(validMetas), [validMetas]);

  // Expect everyone else to memoise.
  // Make more efficient: Ensure it only causes rerenders of parent when arr length >0
  // Currently renders about 24 times, but as expected, it keeps outer ui in the loop of what is going on in the hook for interactive updates.
  // Otherwise, only renders 2 times after to refresh page data on refocus
  return [
    readyMetas,
    anyMetaErr,
    anyMetaInitiallyLoading,
    // Included while waiting for metas to resolve
    allCheck(metaStates, 'idle'),
  ] as [NewProjectWithIndex[], boolean, boolean, boolean];
};
export { useProjects, useSearchData };
