/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// Thanks to this chain of articles that I'll still reference:
// Concurrency: https://thoughtspile.github.io/2018/06/20/serialize-promises/
// Rate limit: https://thoughtspile.github.io/2018/07/07/rate-limit-promises/

import _ from 'lodash';
import { sleep as resolveAfter } from './utils';
// From my limited understanding,
// First we define concurrency limit which serialises processes into batches of 1.
// First serialise
function serializePromises<T extends (...args: any[]) => any>(immediate: T) {
  // This works as our promise queue
  let last = Promise.resolve() as Promise<Awaited<ReturnType<T>>>;
  return function (...a: Parameters<T>) {
    // Catch is necessary here — otherwise a rejection in a promise will
    // break the serializer forever
    last = last.catch(() => {}).then<Awaited<ReturnType<T>>>(() => immediate(...a));
    return last;
  };
}
// Then we generalise it to batches of N
function limitConcurrency<T extends (...args: any[]) => any>(immediate: T, maxConcurrent: number) {
  // Each element holds its index, or a promise resolving with the index
  const workers = _.range(maxConcurrent) as number[] | Promise<number>[];
  // Without this serialization, Promise.race would resolve with the same
  // worker whenever a concurrency-limited function was synchronously called
  // multiple times.
  const findWorker = serializePromises(() => Promise.race(workers));
  return function (...a: Parameters<T>) {
    // race resolves with the first free worker
    return findWorker().then((i) => {
      // and here we start the action and update the worker correspondingly:
      const promise = immediate(...a) as Promise<Awaited<ReturnType<T>>>;
      workers[i] = promise.then(
        () => i,
        () => i
      );
      return promise;
    });
  };
}

// Then we define a general rate limiter which limits m promises to only run every m seconds
// It builds on a limiter of 1 promise every m seconds.
/** A rate limiter of 1 promise every m seconds */
function rateLimit1<T extends (...args: any[]) => any>(fn: T, msPerOp: number) {
  let wait = Promise.resolve() as Promise<unknown>;
  return (...a: Parameters<T>) => {
    // We use the queue tail in wait to start both the
    // next operation and the next delay
    const res = wait.then<Awaited<ReturnType<T>>>(() => fn(...a));
    wait = wait.then(() => resolveAfter(msPerOp));
    return res;
  };
}
// General, this gives us a circular queue of 1-rate-limiters that can take 1 promise, each limiter only firing once per n seconds
// Hence, to reach 3 requests per second, we'll need 3 such queues.
// Hence, we must limit the number of requests coming in and say, if we've gone more than maxQUeue, reject further instances.
// But why?
// If we have a battery of 3 1-rate limiters, and we push one, then two, then a third, the fourth would come to the beginning and try override because it's circular.
// To fix that, I guess it would do to have a value that tracks the queue to see if anyone is free.
function rateLimit<T extends (...args: any[]) => any>(fn: T, windowMs: number, reqInWindow = 1) {
  // A battery of 1-rate-limiters
  const queue = _.range(reqInWindow).map(() => rateLimit1(fn, windowMs));
  // Circular queue cursor
  let i = 0;
  return (...a: Parameters<T>) => {
    // to enqueue, we move the cursor...
    i = (i + 1) % reqInWindow;
    // and return the rate-limited operation.
    return queue[i](...a);
  };
}
// Then we combine both to limit n processes with m delay between them.
/**
 * This function takes all promises given to it, and fires only N every M seconds,
 * the next N will fire exactly M seconds after the last N fired.
 * All N are fired concurrently without delay, so it's following whatever time limit end to end.
 */
const combineLimit = function <T extends (...args: any[]) => any>(
  fn: T,
  windowMs: number,
  maxIn: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return limitConcurrency(rateLimit(fn, windowMs, maxIn), maxIn);
};

export { combineLimit };
