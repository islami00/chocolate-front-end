// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, Text, bool, u128, u32, u64 } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name Balance */
export interface Balance extends u128 {}

/** @name BalanceOf */
export interface BalanceOf extends Balance {}

/** @name MetaData */
export interface MetaData extends Text {}

/** @name Project */
export interface Project extends Struct {
  readonly ownerID: AccountId;
  readonly badge: Option<bool>;
  readonly metadata: MetaData;
  readonly proposalStatus: ProposalStatus;
  readonly reward: Balance;
  readonly totalUserScores: u32;
}

/** @name ProjectAl */
export interface ProjectAl extends Project {}

/** @name ProjectID */
export interface ProjectID extends u32 {}

/** @name ProposalStatus */
export interface ProposalStatus extends Struct {
  readonly status: Status;
  readonly reason: Reason;
}

/** @name Reason */
export interface Reason extends Enum {
  readonly isOther: boolean;
  readonly asOther: Text;
  readonly isInsufficientMetaData: boolean;
  readonly isMalicious: boolean;
  readonly isPassedRequirements: boolean;
}

/** @name Review */
export interface Review extends Struct {
  readonly proposalStatus: ProposalStatus;
  readonly userID: AccountId;
  readonly content: Text;
  readonly projectID: ProjectID;
  readonly pointSnapshot: u32;
}

/** @name ReviewAl */
export interface ReviewAl extends Review {}

/** @name ReviewID */
export interface ReviewID extends u64 {}

/** @name Status */
export interface Status extends Enum {
  readonly isProposed: boolean;
  readonly isAccepted: boolean;
  readonly isRejected: boolean;
}

export type PHANTOM_CHOCOLATEMODULE = 'chocolateModule';
