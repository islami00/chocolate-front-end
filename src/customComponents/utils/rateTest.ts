import _ from 'lodash';
import { combineLimit } from './rateLimit';

// Uncomment to test.
// console.time('TimeTaken');
const timedAsnycTask = async (i: number) => {
  console.log(`Fired`, i);
  console.timeEnd('TimeTaken');
  console.time('TimeTaken');
  return fetch('http://example.com');
};

// 3 requests per second means time between any consecutive three requests should be 3.
// We count number of requests and log it.
// I.e every third request should come at least one second after the last request was made.
const slowTimed = combineLimit(timedAsnycTask, 1000, 3);
const triggers = _.range(9);

// Works as expected, 3 promises every N seconds
const TestThis = (): Promise<void[]> =>
  Promise.allSettled(triggers.map((each) => slowTimed(each))).then((jsons) =>
    jsons.map((e) => console.log(e))
  );
export { TestThis };
