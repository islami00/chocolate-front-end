// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, Text, Vec, u32, u64 } from '@polkadot/types';
import type { AccountId, Hash } from '@polkadot/types/interfaces/runtime';

/** @name ListOfNames */
export interface ListOfNames extends Vec<Text> {}

/** @name MetaData */
export interface MetaData extends Struct {
  readonly projectName: Text;
  readonly projectSocials: ProjectSocials;
  readonly founderSocials: Vec<Social>;
}

/** @name Project */
export interface Project extends Struct {
  readonly ownerID: AccountId;
  readonly reviews: Option<Vec<ReviewID>>;
  readonly badge: Option<Hash>;
  readonly metaData: MetaData;
  readonly proposalStatus: ProposalStatus;
}

/** @name ProjectAl */
export interface ProjectAl extends Project {}

/** @name ProjectID */
export interface ProjectID extends u32 {}

/** @name ProjectSocials */
export interface ProjectSocials extends Vec<Social> {}

/** @name ProposalStatus */
export interface ProposalStatus extends Struct {
  readonly status: Status;
  readonly reason: Reason;
}

/** @name Reason */
export interface Reason extends Enum {
  readonly isInsufficientMetaData: boolean;
  readonly isMalicious: boolean;
  readonly isPassedRequirements: boolean;
}

/** @name Review */
export interface Review extends Struct {
  readonly proposalStatus: ProposalStatus;
  readonly userID: AccountId;
  readonly reviewText: Text;
  readonly projectID: ProjectID;
}

/** @name ReviewAl */
export interface ReviewAl extends Review {}

/** @name ReviewID */
export interface ReviewID extends u64 {}

/** @name Social */
export interface Social extends Enum {
  readonly isTwitter: boolean;
  readonly asTwitter: Text;
  readonly isFacebook: boolean;
  readonly asFacebook: Text;
  readonly isInstagram: boolean;
  readonly asInstagram: Text;
  readonly isRiot: boolean;
  readonly asRiot: Text;
  readonly isEmail: boolean;
  readonly asEmail: Text;
  readonly isNone: boolean;
}

/** @name Status */
export interface Status extends Enum {
  readonly isProposed: boolean;
  readonly isAccepted: boolean;
  readonly isRejected: boolean;
}

/** @name TextAl */
export interface TextAl extends Text {}

export type PHANTOM_CHOCOLATEMODULE = 'chocolateModule';
