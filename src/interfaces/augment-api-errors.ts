// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api/types';

declare module '@polkadot/api/types/errors' {
  export interface AugmentedErrors<ApiType> {
    assets: {
      /**
       * Invalid metadata given.
       **/
      BadMetadata: AugmentedError<ApiType>;
      /**
       * Invalid witness data given.
       **/
      BadWitness: AugmentedError<ApiType>;
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      BalanceLow: AugmentedError<ApiType>;
      /**
       * Balance should be non-zero.
       **/
      BalanceZero: AugmentedError<ApiType>;
      /**
       * The origin account is frozen.
       **/
      Frozen: AugmentedError<ApiType>;
      /**
       * The asset ID is already taken.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * Minimum balance should be non-zero.
       **/
      MinBalanceZero: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * No provider reference exists to allow a non-zero balance of a non-self-sufficient asset.
       **/
      NoProvider: AugmentedError<ApiType>;
      /**
       * No approval exists that would allow the transfer.
       **/
      Unapproved: AugmentedError<ApiType>;
      /**
       * The given asset ID is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * The source account would not survive the transfer and it needs to stay alive.
       **/
      WouldDie: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Balance too low to send value
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account
       **/
      KeepAlive: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed MaxReserves
       **/
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value
       **/
      VestingBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    chocolateModule: {
      /**
       * The reviewer has already placed a review on this project with following id
       **/
      DuplicateReview: AugmentedError<ApiType>;
      NoneValue: AugmentedError<ApiType>;
      /**
       * The project does not exist
       **/
      NoProjectWithId: AugmentedError<ApiType>;
      /**
       * Project owners cannot review their projects
       **/
      OwnerReviewedProject: AugmentedError<ApiType>;
      /**
       * The index exceeds max usize.
       **/
      StorageOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    elections: {
      /**
       * Duplicated candidate submission.
       **/
      DuplicatedCandidate: AugmentedError<ApiType>;
      /**
       * Candidate does not have enough funds.
       **/
      InsufficientCandidateFunds: AugmentedError<ApiType>;
      /**
       * The renouncing origin presented a wrong `Renouncing` parameter.
       **/
      InvalidRenouncing: AugmentedError<ApiType>;
      /**
       * Prediction regarding replacement after member removal is wrong.
       **/
      InvalidReplacement: AugmentedError<ApiType>;
      /**
       * The provided count of number of votes is incorrect.
       **/
      InvalidVoteCount: AugmentedError<ApiType>;
      /**
       * The provided count of number of candidates is incorrect.
       **/
      InvalidWitnessData: AugmentedError<ApiType>;
      /**
       * Cannot vote with stake less than minimum balance.
       **/
      LowBalance: AugmentedError<ApiType>;
      /**
       * Cannot vote more than maximum allowed.
       **/
      MaximumVotesExceeded: AugmentedError<ApiType>;
      /**
       * Member cannot re-submit candidacy.
       **/
      MemberSubmit: AugmentedError<ApiType>;
      /**
       * Must be a voter.
       **/
      MustBeVoter: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Must vote for at least one candidate.
       **/
      NoVotes: AugmentedError<ApiType>;
      /**
       * Cannot report self.
       **/
      ReportSelf: AugmentedError<ApiType>;
      /**
       * Runner cannot re-submit candidacy.
       **/
      RunnerUpSubmit: AugmentedError<ApiType>;
      /**
       * Cannot vote more than candidates.
       **/
      TooManyVotes: AugmentedError<ApiType>;
      /**
       * Voter can not pay voting bond.
       **/
      UnableToPayBond: AugmentedError<ApiType>;
      /**
       * Cannot vote when no candidates or members exist.
       **/
      UnableToVote: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    grandpa: {
      /**
       * Attempt to signal GRANDPA change with one already pending.
       **/
      ChangePending: AugmentedError<ApiType>;
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA pause when the authority set isn't live
       * (either paused or already pending pause).
       **/
      PauseFailed: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA resume when the authority set isn't paused
       * (either live or already pending resume).
       **/
      ResumeFailed: AugmentedError<ApiType>;
      /**
       * Cannot signal forced change so soon after last.
       **/
      TooSoon: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    treasury: {
      /**
       * Proposer's balance is too low.
       **/
      InsufficientProposersBalance: AugmentedError<ApiType>;
      /**
       * No proposal or bounty at that index.
       **/
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * Too many approvals in the queue.
       **/
      TooManyApprovals: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    usersModule: {
      /**
       * No Value
       **/
      NoneValue: AugmentedError<ApiType>;
      /**
       * Storage is overflow
       **/
      StorageOverflow: AugmentedError<ApiType>;
      /**
       * User already exists
       **/
      UserAlreadyExists: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  }

  export interface DecoratedErrors<ApiType extends ApiTypes> extends AugmentedErrors<ApiType> {
    [key: string]: ModuleErrors<ApiType>;
  }
}
