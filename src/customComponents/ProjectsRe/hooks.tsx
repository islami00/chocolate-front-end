import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectWithIndex } from 'chocolate/typeSystem/jsonTypes';
import { useEffect, useState } from 'react';
import { getMockProjects, getProjects } from '../Projects';

const useProjects = function (): { projects: ProjectWithIndex[] } {
  const [projects, setProjects] = useState<ProjectWithIndex[]>([]);
  const { api, keyring, apiState } = useSubstrate();
  /**  use this to switch between deps for project - demo.  I.e use ret or ret2 - fallbacks */
  const isDemo = true;

  useEffect(() => {
    // prevent race conditions by only updating state when component is mounted
    let isMounted = true;
    async function run() {
      const ret = await getProjects(
        api.query.chocolateModule.projects.entries()
      );
      // remove this when done with dev as it implies a req of connecting wallet to load projects
      const ret2 = isDemo && getMockProjects(keyring.getPairs());
      const set = !ret.length ? ret2 : ret;
      if (isMounted) {
        setProjects(set);
      }
    }
    if (isDemo) {
      if (apiState === 'READY' && keyring) run();
    } else if (apiState === 'READY') run();
    return () => {
      isMounted = false;
    };
  }, [api, isDemo, keyring, apiState]);
  return { projects };
};
export { useProjects };
