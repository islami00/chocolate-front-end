import { Option, StorageKey } from '@polkadot/types';
import { ProjectAl, ProjectID } from 'chocolate/interfaces';
import { useSubstrate } from 'chocolate/substrate-lib';
import { Chocolate, ProjectWithIndex } from 'chocolate/typeSystem/jsonTypes';
import { useQuery } from 'react-query';

const cleanName = function (name: string) {
  const re = /[A-Z]/;
  const foundAt = name.search(re);
  return name.slice(foundAt);
};

/**
 * @description Cleans the utf-8 bytes on the project and founder socials
 * by removing anything before founder, or before any word before Inc/_Stash
 * Note: The object passed is mutated directly
 * @param {Partial<Chocolate["Social"]>} soc */
const MutateSocials = function (soc: Partial<Chocolate['Social']>) {
  const cleanReg =
    /([\s\S](?=founder))|([^A-Za-z_](?!(gmail|com)))|([\s\S]+?(?=[A-Z][a-z]+)(?!(Inc|Stash)))/g;
  const keys = Object.keys(soc);
  for (let i = 0; i < keys.length; i += 1) {
    const element = keys[i];
    const social = soc[element];
    soc[element] = social.replaceAll(cleanReg, '');
  }
  return soc;
};

/**
 * OwnerID shoould be changed to projectAddress in input
 * @description gets the projects and filters them by not proposed, and adds exta data e.g subscan links and also dispatches state update
 * @param {Promise<[StorageKey<[ProjectID]>, Option<ProjectAl>][]>} projects
 * @returns {Promise<ProjectWithIndex[]>}
 */
const getProjects = async function (
  projects: Promise<[StorageKey<[ProjectID]>, Option<ProjectAl>][] | undefined>
): Promise<ProjectWithIndex[]> {
  // projects are properly passed here
  if (!(projects instanceof Promise)) throw new Error('Passed in wrong values');
  const usable = await projects;

  const mutatedProjects = usable?.map(each => {
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
    // mutate socials and project names
    const {
      metaData: { projectName },
    } = secondReturnable;
    secondReturnable.metaData.founderSocials.forEach(MutateSocials);
    secondReturnable.metaData.projectSocials.forEach(MutateSocials);

    secondReturnable.metaData.projectName = cleanName(projectName).replaceAll(
      '_',
      ' '
    );
    const ret = { Id, project: secondReturnable };
    return ret;
  });
  const cleanProjects = mutatedProjects.filter(
    each => each !== null && each !== undefined
  );
  return cleanProjects;
};
const useProjects = function () {
  const { api } = useSubstrate();
  async function fetchProjects() {
    const ret = await getProjects(api.query.chocolateModule.projects.entries());
    return ret;
  }
  return useQuery('projects', fetchProjects);
};
export { useProjects };
