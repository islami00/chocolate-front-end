/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiPromise } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { Option } from '@polkadot/types';
import { useEffect, useMemo } from 'react';
import { QueryStatus, useQueries, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { ProjectAl, ProjectID } from '../../interfaces';
import { ChainProject, NewMetaData, NewProjectWithIndex } from '../../typeSystem/jsonTypes';
import { combineLimit, errorHandled, toPinataFetch } from '../utils';
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
  const getOne = async function (key: ProjectID) {
    const proj = await api.query.chocolateModule.projects(key);
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
  //  Subscribe once, more efficient with connections.
  useEffect(() => {
    let unsub: VoidFn;
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
                // Debug
                const isDev = process.env.NODE_ENV === 'development';
                if (isDev) console.count('Subbed');
                // Debug End.
                // Concrete check. project needs to change too.
                if (key.eq(id) && !project.eq(ithProject)) {
                  // Debug
                  if (isDev) console.log('Ne', project, ithProject);
                  // Debug end
                  return [ithProject, id];
                }
                return [project, id];
              }
            );
          });
        })
        .then((v) => (unsub = v))
        .catch(console.error);
    return () => unsub && unsub();

    // More suited to gallery page where real time data is needed.
    // Reasonable deps , length tracks new adds, shouldfire waits for first fetch. Realtime reqs of searchbar aren't much.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.length, shouldFire]);
};
// Then get json metadata
// Doesn't require api. SHould be fine so long as dependent memoises
// This one's should fire depends on useParallelProjects
const useProjectsWithMetadata = function (projects: [ProjectAl, ProjectID][], shouldFire: boolean) {
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
  return useQueries(
    projects.map(([v, k]) => ({
      queryKey: ['Project', 'Metadata', k.toJSON(), v.metadata.toJSON()],
      queryFn: () => slowlyRetrieveMeta([v, k]),
      enabled: shouldFire,
      staleTime: Infinity,
    }))
  );
};

// This returns , alongside the query data, an array of booleans and statuses indicating success and other states of the query results.
// Sort of serialising them.
// Doesn't need to memoise if passer does.
// Also acts as a trigger for next function that checks data by including dataUpdatedAt
/**  [valids, erred, loadingInitially, statuses] */
const shouldComputeValid = function <T>(metas: UseQueryResult<T, unknown>[]) {
  const erred = metas.some((each) => each.isError);
  if (erred) console.error('Some query in the list failed');
  // Show if any q is loading intially to update UI
  const loadingInitially = metas.some((each) => each.isLoading);
  if (loadingInitially && process.env.DEBUG)
    console.log('Some project (or query) is loading for the first time');
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

const resArr = function <T>(valids: [T, number][]) {
  // Check if data is defined
  const defined = valids.filter((each) => !!each[0]);
  // Collect only the project and swap, last updated at simply limits this.
  const readies = defined.map((each) => each[0]);
  return readies;
};

// Same here for state
const allCheck = function (states: QueryStatus[], status: QueryStatus) {
  return states.reduce((prev, current) => prev === true && current === status, true);
};

// Also, some metadata switcheroo to complete:
const mockImages = function (pr: NewProjectWithIndex) {
  pr.project.metadata.icon = `https://avatars.dicebear.com/api/initials/${pr.project.metadata.name}.svg`;
  return pr;
};

/**
 * Returns: [projects, isAnyError, isAnyInitiallyLoading, areAllIdle ]
 *
 * Note: Everyone should ensure they can with stand API being unavailable by memoising.
 * At this hook's end, it'll memoise its return value and return it instead if the api were to become unavailable
 */
// Refactor tip: Refs to the rescue! https://usehooks.com/usePrevious/
// Use this at critical sections so that when the api goes out, we use the previous value.
// All hooks requiring the substrate api should memoise value and accept a fallback boolean that says whether or not to use that last value.
// We then return the value of usePrevious instead of failing to use the apiPromise.
// Also, memoise vigorously in regular functions.
const useSearchData = function (
  api: ApiPromise
): [NewProjectWithIndex[], boolean, boolean, boolean] {
  // Start project loop
  const { data: keys, status } = useProjectKeys(api);
  const parallelProjects = useParallelProjects(api, keys ?? [], status === 'success');
  const parallels = useMemo(() => shouldComputeValid(parallelProjects), [parallelProjects]);
  // Check defined
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
  // Same routine for qs
  const vMetaArr = useMemo(() => shouldComputeValid(metas), [metas]);
  const [validMetas, anyMetaErr, anyMetaInitiallyLoading, metaStates] = vMetaArr;
  const readyMetas = useMemo(() => resArr(validMetas).map(mockImages), [validMetas]);

  // Expect everyone else to memoise.
  // Make more efficient: Ensure it only causes rerenders of parent when arr length >0
  // Currently renders about 24 times, but as expected, it keeps outer ui in the loop of what is going on in the hook for interactive updates.
  // Otherwise, only renders 2 times after to refresh page data on refocus
  return [
    readyMetas,
    anyMetaErr,
    anyMetaInitiallyLoading,
    // UI reacts when metadata available
    allCheck(metaStates, 'idle'),
  ] as [NewProjectWithIndex[], boolean, boolean, boolean];
};
export { useSearchData, shouldComputeValid, resArr, allCheck };
