/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// takes each type as defined in appTypes and exports 8 insttances to mocks folder

import { AnyNumber } from '@polkadot/types/types';
import { randomInt } from 'crypto';
// 8 projects
// 3 accepted
// 3 rejected
// 2 proposed
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { NewMetaData, ReviewContent } from './jsonTypes';
// store on ipfs
export type {
  NewMetaData,
  NewProject,
  NewReview,
  ReviewContent,
} from './jsonTypes';
// this links to a mapping from id to review
type ReviewId = AnyNumber;

const metaTemp: NewMetaData = {
  name: '',
  Link: '',
  description: '',
  icon: '',
  date: new Date().getTime(),
};

const revTemp: ReviewContent = {
  rating: 0,
  reviewText: '',
};

const nnumberOfP = 5;

const mockRevs: [number, string][] = [
  [
    5,
    'This is a legitimate project, I participated in their crowdloan via their website. Received my tokens and crowdloan supporter NFT promptly after the parachain auctions. Thank you!!!',
  ],
  [
    5,
    "I contributed to this network's 'Treasury Funding' launch event and filled my bags with their token. The chocolate trust badge made it super easy to verify the token smart contract on CoinGecko with and I received my early bird bonus - no issues whatsoever.",
  ],
  [
    4,
    "I've bought, minted and sold a few NFTs on this marketplace and my experience has been largely positive. Fees are cheaper than on the bigger exchanges and their integration with chocolate verification makes me feel safe using it.",
  ],
  [
    3,
    "The project is still growing and their technology is really promising :-) I've been staking their native token for a few months via their native app and the yields. are. epic.",
  ],
];
// takes the reviews and outputs their hashes. Do - LAter
function OutputReviewJSONForUse(where: number) {
  mkdir(path.resolve(__dirname, 'test', 'projects', `review${where}`), {
    recursive: true,
  }).then(() => {
    for (let i = 0; i < mockRevs.length; i += 1) {
      const choose = randomInt(mockRevs.length);
      const [rat, t] = mockRevs[choose];
      revTemp.rating = rat;
      revTemp.reviewText = t;
      const rev = JSON.stringify(revTemp);
      writeFile(
        path.resolve(
          __dirname,
          'test',
          'projects',
          `review${where}`,
          `review${i + 1}.json`
        ),
        rev,
        {
          encoding: 'utf-8',
          flag: 'w',
        }
      )
        .then(() => console.log('done review', i))
        .catch(err => console.log(err));
    }
  });
}
function MakeAcceptedProjects() {
  // make three accepted projects  //
}
function MakeRejectedProjects() {}
function MakeProposedProjects() {}

// store projects on ipfs so we can use its hashes when we have setup backend - DO-later
export function OutputProjectJSONForUse() {
  mkdir(path.resolve(__dirname, 'test', 'projects'), { recursive: true })
    .then(() => {
      for (let i = 0; i < nnumberOfP; i += 1) {
        const num = i + 1;
        metaTemp.name = `Project-${num}`;
        metaTemp.Link = '#';
        metaTemp.icon = `https://avatars.dicebear.com/api/initials/p${num}.svg`;
        const pr = JSON.stringify(metaTemp);
        writeFile(
          path.resolve(__dirname, 'test', 'projects', `project${num}.json`),
          pr,
          {
            encoding: 'utf-8',
            flag: 'w',
          }
        )
          .then(() => console.log('done', i))
          .catch(err => {
            throw new Error(err);
          });
        OutputReviewJSONForUse(num);
      }
    })
    .catch(er => {
      throw new Error(er);
    });
}
function StoreProjectsOnIPFS() {}
// 5 reviews each. Varying amount of chocolate Math.random this.
function MakeFiveAcceptedReviews() {}
function MockReviewMap() {}

function StoreReviewsOnIPFS() {}
// Get 8 random logos.
function GetProjectLogo() {}
// store the logos beforehand on ipfs.
// output as one single json
// Review type will have content. That will be pulled from ipfs.
OutputProjectJSONForUse();
export default {};
