/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// takes each type as defined in appTypes and exports 8 instances to mocks folder

import { AnyNumber } from '@polkadot/types/types';
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
export interface ReviewContent{
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
