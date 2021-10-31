/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiPromise } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { ProjectAl, ReviewID } from '../../interfaces';
import { PinServerRes } from '../../typeSystem/appTypes';
import {
  ChainReview,
  NewMetaData,
  NewReview
} from '../../typeSystem/jsonTypes';
import { ReviewContent } from '../../typeSystem/mockTypes';
import { errorHandled, sortAnyNum, toPinataFetch } from '../utils';

function filter(project: ProjectAl): 0 | 1 | 2 | void {
  try {
    if (project.proposalStatus.status.isRejected) return 0;
    if (project.proposalStatus.status.isProposed) return 1;
    if (project.proposalStatus.status.isAccepted) return 2;
  } catch (error) {
    return console.error("where's the project dude?");
  }
}
// for use with ipfs cat
// eslint-disable-next-line no-unused-vars
const ipfsConfig = {
  protocol: 'http',
  host: '127.0.0.1',
  port: 5001,
  apiPath: 'api/v0',
};
async function populateReviews(
  referral: Vec<ReviewID>,
  api: ApiPromise,
  userId: string,
  debug = false
): Promise<NewReview[]> {
  // setup time stamps for easier sort
  referral.sort(sortAnyNum);
  if (debug) console.log('After sort', referral);
  const chainRes = referral.map(async (element) => {
    const optReview = await api.query.chocolateModule.reviews(element);
    const review = optReview.unwrapOr(0);
    if (review === 0) throw new Error('Review does not exist');
    if (review.proposalStatus.status.isAccepted) return review;
    if (review.userID.eq(userId)) return review;
    // fall through case comes here, this can be undefined in the case wherein the userId is proposed
  });
  const result = await Promise.all(chainRes);
  // patch
  const resulting = result.filter((each) => !!each);
  const contents = resulting.map(async (element, i, arr) => {
    if (debug) console.log('ITer', i, arr, element);
    const [res, err] = await errorHandled(
      fetch(toPinataFetch(element.content.toJSON()))
    );
    if (err) throw err;
    const rev = (await res.json()) as ReviewContent;
    if (debug) console.log('returned', rev);
    const personified = element.toHuman() as unknown as ChainReview;
    const properRev = { ...personified, content: rev };
    return properRev;
  });

  return Promise.all(contents);
  // use the referral array here.
}
/** works */
async function populateMetadata(
  cid: string,
  debug = false
): Promise<NewMetaData> {
  if (debug) console.log('got metadata cid', cid);
  // fetch meta from cid.
  const [res, err] = await errorHandled(fetch(toPinataFetch(cid)));
  if (err) throw err;
  const metaData = (await res.json()) as NewMetaData;
  metaData.icon = `https://avatars.dicebear.com/api/initials/${metaData.name}.svg`;
  return metaData;
}
type GetCidReturns = { cid: string };
const getCid = async function (
  reviewText: string,
  rating: number
): Promise<GetCidReturns> {
  const cacheable: ReviewContent = { rating, reviewText };
  const endpoint = 'http://127.0.0.1:5001/chocolate-demo/us-central1/api/pin';
  const headers = {
    method: 'POST',
    body: JSON.stringify(cacheable),
  };
  const [cid, err] = await errorHandled(fetch(endpoint, headers));
  if (err) throw err;
  const ccid = (await cid.json()) as PinServerRes;
  const returnable = ccid?.success;
  return { cid: returnable };
};
export { filter, populateReviews, populateMetadata, getCid };
