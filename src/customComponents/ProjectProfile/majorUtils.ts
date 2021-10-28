/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiPromise } from '@polkadot/api';
import { Vec } from '@polkadot/types';
import { ProjectAl, ReviewID } from 'chocolate/interfaces';
import { ReviewContent } from 'chocolate/typeSystem/mockTypes';
import { NewMetaData } from '../../typeSystem/jsonTypes';
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
const ipfsConfig = {
  protocol: 'http',
  host: '127.0.0.1',
  port: 5001,
  apiPath: 'api/v0',
};
async function populateReviews(
  referral: Vec<ReviewID>,
  api: ApiPromise,
  userId: string
): Promise<ReviewContent[]> {
  // setup time stamps for easier sort
  referral.sort(sortAnyNum);
  console.log('After sort', referral);
  const chainRes = referral.map(async element => {
    const optReview = await api.query.chocolateModule.reviews(element);
    const review = optReview.unwrapOr(0);
    if (review === 0) throw new Error('Review does not exist');
    if (review.proposalStatus.status.isAccepted) return review.content.toJSON();
    if (review.userID.eq(userId)) return review.content.toJSON();
  });
  const result = await Promise.all(chainRes);
  const contents = result.map(async (element, i, arr) => {
    console.log('ITer', i, arr, element);
    const [res, err] = await errorHandled(fetch(toPinataFetch(element)));
    if (err) throw err;
    const rev = (await res.json()) as ReviewContent;
    console.log('returned', rev);
    return rev;
  });
  return Promise.all(contents);
  // use the referral array here.
}
/** works */
async function populateMetadata(cid: string): Promise<NewMetaData> {
  console.log('got metadata cid', cid);
  // fetch meta from cid.
  const [res, err] = await errorHandled(fetch(toPinataFetch(cid)));
  if (err) throw err;
  const metaData = (await res.json()) as NewMetaData;
  metaData.icon = `https://avatars.dicebear.com/api/initials/${metaData.name}.svg`;
  return metaData;
}
export { filter, populateReviews, populateMetadata };
