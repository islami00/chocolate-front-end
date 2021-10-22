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
import { ProposalStatus } from './jsonTypes';
// store on ipfs
export interface NewMetaData {
  projectName: string;
  website: string;
  whitepaper: string;
  projectLogo: string;
}
// this links to a mapping from id to review
type ReviewId = AnyNumber;

// The immediate members are stored on-chain
export interface NewProject {
  ownerID: string;
  reviews: ReviewId[];
  badge: boolean;
  metaData: NewMetaData;
  proposalStatus: ProposalStatus;
}

// store on ipfs fully
export interface ReviewContent {
  reviewText: string;
  rating: AnyNumber;
}
// store on-chain for extrinsics
export interface NewReview {
  proposalStatus: ProposalStatus;
  userID: string;
  content: ReviewContent;
  projectID: AnyNumber;
}

const metaTemp: NewMetaData = {
  projectName: '',
  website: '',
  whitepaper: '',
  projectLogo: '',
};

const revTemp: ReviewContent = {
  rating: 0,
  reviewText: '',
};

const nnumberOfP = 8;

const mockRevs: [number, string][] = [
  [5, 'This is a legitimate project, I participated in their crowdloan and received rewards and my token back.'],
  [5, 'Needless to say we are extremely satisfied with the results. It fits our needs perfectly.'],
  [4, "It's really wonderful. Definitely worth the investment."],
  [3, 'The project is still growing, developers are friendly and take advice as given.'],
];
// takes the reviews and outputs their hashes. Do - LAter
function OutputReviewJSONForUse(where: number) {
  mkdir(path.resolve(__dirname, 'test', 'projects', `review${where}`), { recursive: true }).then(() => {
    [...Array(4)].forEach((_, i) => {
      const choose = randomInt(mockRevs.length);
      const [rat, t] = mockRevs[choose];
      revTemp.rating = rat;
      revTemp.reviewText = t;
      const rev = JSON.stringify(revTemp);
      writeFile(path.resolve(__dirname, 'test', 'projects', `review${where}`, `review${i + 1}.json`), rev, {
        encoding: 'utf-8',
        flag: 'w',
      })
        .then(() => console.log('done review', i))
        .catch(err => console.log(err));
    });
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
        metaTemp.projectName = `Project-${num}`;
        metaTemp.website = '#';
        metaTemp.whitepaper = '#';

        metaTemp.projectLogo = `https://avatars.dicebear.com/api/initials/p${num}.svg`;
        const pr = JSON.stringify(metaTemp);
        writeFile(path.resolve(__dirname, 'test', 'projects', `project${num}.json`), pr, {
          encoding: 'utf-8',
          flag: 'w',
        })
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
