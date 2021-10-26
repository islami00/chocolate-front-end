import { ApiPromise } from '@polkadot/api';
import { AnyNumber } from '@polkadot/types/types';
import { BN } from '@polkadot/util/bn';
import { ProjectAl } from 'chocolate/interfaces';
import { ReviewContent } from 'chocolate/typeSystem/mockTypes';
import { create } from 'ipfs-http-client';
import { errorHandled } from '../utils';

function filter(project: ProjectAl): 0 | 1 | 2 | void {
  try {
    if (project.proposalStatus.status.isRejected) return 0;
    if (project.proposalStatus.status.isProposed) return 1;
    if (project.proposalStatus.status.isAccepted) return 2;
  } catch (error) {
    return console.error("where's the project dude?");
  }
}

async function populateReviews(
  referral: AnyNumber[],
  api: ApiPromise,
  id: string,
  mock = false
): Promise<ReviewContent[]> {
  // resolves to running instance of httpapi : http://localhost:5001/api/v0 default
  const ipfsConfig = {
    protocol: 'http',
    host: '127.0.0.1',
    port: 5001,
    apiPath: 'api/v0',
  };
  const ipfs = create(ipfsConfig);

  if (mock) {
    // fetch data from review cache - good idea! setup this query alongside the project query and get it here.
    const idPlus = new BN(id).addn(1).toNumber();
    const wrapFolder = 'QmPrGjZB9xjiLfurTG2xdHeSQz3BhUCUZc1aQrbrMS8VdF';

    const reviews: ReviewContent[] = [];
    const decoder = new TextDecoder();
    for (let i = 1; i <= 4; i += 1) {
      // make async or use react.lazy. Call from gh. Call from ipsf dir.
      let review = '';
      for await (const iterator of ipfs.cat(
        `${wrapFolder}/test/projects/review${idPlus}/review${i}.json`
      )) {
        review += decoder.decode(iterator, { stream: true });
        console.log(review, 'streaming!');
      }
      review += decoder.decode();
      try {
        const returnable: ReviewContent = JSON.parse(review) as ReviewContent;
        console.log(returnable);

        reviews.push(returnable);
      } catch (error) {
        console.error(error);
      }
    }
    return reviews;
  }
  const cids: string[] = [];
  for (let i = 0; i < referral.length; i += 1) {
    const element = referral[i];
    const optReview = await api.query.chocolateModule.reviews(element);
    const review = optReview.unwrapOr(0);
    if (review === 0) throw new Error('Review does not exist smh');
    //
    if (review.proposalStatus.status.isAccepted) {
      try {
        // @ts-expect-error This is tremporary pseudocode till type is gotten
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        cids.push(review.content.toHuman());
      } catch (error) {
        throw new Error(
          "As expected, you haven't implemented the content type"
        );
      }
    }
  }
  const contents = [];
  for (let i = 0; i < cids.length; i = +1) {
    const element = cids[i];
    // to-do, Ipfs cat
    const [res, error] = await errorHandled<Response>(
      fetch(`content from ipfs ${element}`)
    );
    if (error) throw new Error('You just used an unimplemented feature');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await res.json();
    contents.push(json);
  }

  // use the referral array here.
}
export { filter, populateReviews };
