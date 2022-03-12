/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';
import { ReviewAl } from '../../interfaces';
import { PinServerRes } from '../../typeSystem/appTypes';
import { ChainReview, NewMetaData, NewReview, ReviewContent } from '../../typeSystem/jsonTypes';
import { errorHandled, toPinataFetch } from '../utils';

// for use with ipfs cat
// eslint-disable-next-line no-unused-vars
const ipfsConfig = {
  protocol: 'http',
  host: '127.0.0.1',
  port: 5001,
  apiPath: 'api/v0',
};
/** Gets pinata metadata associated with a review. */
export const getPinataData = async (
  element: ReviewAl,
  _: number,
  __: ReviewAl[],
  debug = false
): Promise<NewReview> => {
  if (debug) console.clear();
  if (debug) console.log('content', element.content);
  // this async error doesn't bubble to react query
  const [res, err] = await errorHandled(fetch(toPinataFetch(element.content.toJSON())));
  if (err) throw err;
  const rev = (await res.json()) as ReviewContent;
  const personified = element.toHuman() as unknown as ChainReview; // COuld use overarching class instead.
  const properRev = { ...personified, content: rev };
  return properRev;
};
/**
 * Retrieves the reviews associated with a project, and populates their metadata in the process
 */
async function populateReviews(
  // referral: ReviewID[], Referral is project id.
  id: AnyNumber,
  api: ApiPromise,
  userId: string,
  debug = false
): Promise<NewReview[]> {
  function limit<T>(revs: T[]): T[] {
    const max = revs.length > 10 ? 10 : revs.length;
    const revsArr = revs.slice(0, max);
    return revsArr;
  }
  //  Setup what we'll limit.
  // We'll filter by the projectId. Getting keys first makes next step easy.
  let referral = (await api.query.chocolateModule.reviews.keys())
    .map((each) => each.args)
    .filter((value) => value[1].eq(id)); // args decodes.
  referral = limit(referral);

  if (debug) debugger;
  // error handled
  const chainRes = referral.map(async (element) => {
    const optReview = await api.query.chocolateModule.reviews(...element);
    const review = optReview.unwrapOr(0);
    try {
      if (review === 0) throw new Error('Review does not exist');
      if (review.proposalStatus.status.isAccepted) return review;
      if (review.userID.eq(userId)) return review; // Only show accepted && those you can see: proposed.
    } catch (error) {
      // send metric to track and return undefined
      if (debug) console.error(error);
      return undefined;
    }
  });

  const result = await Promise.all(chainRes);
  const resulting = result.filter((each) => each !== undefined);
  if (debug) console.log('This was result', result);
  if (debug) console.log('This is resulting', resulting);

  const contents = resulting.map(getPinataData);
  const contentResult = Promise.all(contents);
  return contentResult;
}
/** works */
async function populateMetadata(cid: string, debug = false): Promise<NewMetaData> {
  if (debug) console.log('got metadata cid', cid);
  // fetch meta from cid.
  const [res, err] = await errorHandled(fetch(toPinataFetch(cid)));
  if (err) throw err;
  const metadata = (await res.json()) as NewMetaData;
  metadata.icon = `https://avatars.dicebear.com/api/initials/${metadata.name}.svg`;
  return metadata;
}
type GetCidReturns = { cid: string };
const getCid = async function (reviewText: string, rating: number): Promise<GetCidReturns> {
  const cacheable: ReviewContent = { reviewText, rating };
  const endpoint = `${process.env.REACT_APP_PIN_SERVER}/pin`;
  const headers = {
    method: 'POST',
    body: JSON.stringify(cacheable),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const [cid, err] = await errorHandled(fetch(endpoint, headers));
  if (err) throw err;
  const ccid = (await cid.json()) as PinServerRes;
  const returnable = ccid?.success;
  return { cid: returnable };
};
export { populateReviews, populateMetadata, getCid };
