// defined the various classes
//

import { AnyNumber } from '@polkadot/types/types';
import { NewProject } from './mockTypes';

/**
 * @description this class decorates a plain object with our ideal project type with useful getter functions
 * It retains a base project that can be destructured, and also has useful getters for rankPoints and the like that utilise the base struct.
 */
class JSONProject {
  project: NewProject;

  constructor(fresh: NewProject) {
    this.project = fresh;
  }

  get rankAverage() {
    const { reviews } = this.project;
    const x: AnyNumber = 0;
    return x;
  }
}

export default {};
