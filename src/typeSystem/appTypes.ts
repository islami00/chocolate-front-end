// defined the various classes
//

import { NewProject, ReviewContent } from './mockTypes';

/**
 * @description this class decorates a plain object with our ideal project type with useful getter functions
 * It retains a base project that can be destructured, and also has useful getters for rankPoints and the like that utilise the base struct.
 */
class JSONProject {
  project: NewProject;

  projectReviews: ReviewContent[];

  constructor(fresh: NewProject, revs: ReviewContent[]) {
    this.project = fresh;
    this.projectReviews = revs;
  }

  get rankAverage(): number {
    const reviews = this.projectReviews;
    // simple average
    const totalRating = reviews.reduce((previous, current) => {
      const sum = Number(current.rating) + previous;
      return sum;
    }, 0);
    const av = totalRating / reviews.length;
    return av;
  }
}

export { JSONProject };
