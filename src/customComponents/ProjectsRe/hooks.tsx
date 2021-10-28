import { Option, StorageKey } from '@polkadot/types';
import { ProjectAl, ProjectID } from 'chocolate/interfaces';
import { useSubstrate } from 'chocolate/substrate-lib';
import { Chocolate, NewProjectWithIndex } from 'chocolate/typeSystem/jsonTypes';
import { NewMetaData } from 'chocolate/typeSystem/mockTypes';
import { useQuery, UseQueryResult } from 'react-query';
import { errorHandled, toPinataFetch } from '../utils';

/**
 * OwnerID shoould be changed to projectAddress in input
 * @description gets the projects and filters them by not proposed, and adds exta data e.g subscan links and also dispatches state update
 */
const getProjects = async function (
  projects: Promise<[StorageKey<[ProjectID]>, Option<ProjectAl>][] | undefined>
): Promise<NewProjectWithIndex[]> {
  // projects are properly passed here
  if (!(projects instanceof Promise)) throw new Error('Passed in wrong values');
  const usable = await projects;

  const mutatedProjects = usable?.map(async each => {
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
    const [meta, error] = await errorHandled(
      fetch(toPinataFetch(secondReturnable.metaData))
    );
    if (error) throw error;
    const realMeta: NewMetaData = (await meta.json()) as NewMetaData;
    const newRet = { ...secondReturnable, metaData: realMeta };
    const ret: NewProjectWithIndex = { Id, project: newRet };
    return ret;
  });
  const mut = await Promise.all(mutatedProjects);
  const cleanProjects = mut.filter(each => each !== null && each !== undefined);
  return cleanProjects;
};
const useProjects = function (): UseQueryResult<
  NewProjectWithIndex[],
  unknown
> {
  const { api } = useSubstrate();
  // refactor to useQuery 'chain', 'projects' and useQuery 'ipfs' , 'metadata'
  // then include utility function to consolidate both types. but we good for now
  async function fetchProjects() {
    const ret = await getProjects(api.query.chocolateModule.projects.entries());
    return ret;
  }
  return useQuery('projects', fetchProjects);
};
export { useProjects };
