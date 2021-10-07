// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { Bytes, Vec, bool, u32, u8 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { TAssetBalance } from '@polkadot/types/interfaces/assets';
import type { BalanceStatus } from '@polkadot/types/interfaces/balances';
import type { MemberCount, ProposalIndex } from '@polkadot/types/interfaces/collective';
import type { AuthorityList } from '@polkadot/types/interfaces/grandpa';
import type { AccountId, AssetId, Balance, Hash } from '@polkadot/types/interfaces/runtime';
import type { DispatchError, DispatchInfo, DispatchResult } from '@polkadot/types/interfaces/system';
import type { ApiTypes } from '@polkadot/api/types';

declare module '@polkadot/api/types/events' {
  export interface AugmentedEvents<ApiType> {
    assets: {
      /**
       * An approval for account `delegate` was cancelled by `owner`.
       * \[id, owner, delegate\]
       **/
      ApprovalCancelled: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId]>;
      /**
       * (Additional) funds have been approved for transfer to a destination account.
       * \[asset_id, source, delegate, amount\]
       **/
      ApprovedTransfer: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId, TAssetBalance]>;
      /**
       * Some asset `asset_id` was frozen. \[asset_id\]
       **/
      AssetFrozen: AugmentedEvent<ApiType, [AssetId]>;
      /**
       * An asset has had its attributes changed by the `Force` origin.
       * \[id\]
       **/
      AssetStatusChanged: AugmentedEvent<ApiType, [AssetId]>;
      /**
       * Some asset `asset_id` was thawed. \[asset_id\]
       **/
      AssetThawed: AugmentedEvent<ApiType, [AssetId]>;
      /**
       * Some assets were destroyed. \[asset_id, owner, balance\]
       **/
      Burned: AugmentedEvent<ApiType, [AssetId, AccountId, TAssetBalance]>;
      /**
       * Some asset class was created. \[asset_id, creator, owner\]
       **/
      Created: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId]>;
      /**
       * An asset class was destroyed.
       **/
      Destroyed: AugmentedEvent<ApiType, [AssetId]>;
      /**
       * Some asset class was force-created. \[asset_id, owner\]
       **/
      ForceCreated: AugmentedEvent<ApiType, [AssetId, AccountId]>;
      /**
       * Some account `who` was frozen. \[asset_id, who\]
       **/
      Frozen: AugmentedEvent<ApiType, [AssetId, AccountId]>;
      /**
       * Some assets were issued. \[asset_id, owner, total_supply\]
       **/
      Issued: AugmentedEvent<ApiType, [AssetId, AccountId, TAssetBalance]>;
      /**
       * Metadata has been cleared for an asset. \[asset_id\]
       **/
      MetadataCleared: AugmentedEvent<ApiType, [AssetId]>;
      /**
       * New metadata has been set for an asset. \[asset_id, name, symbol, decimals, is_frozen\]
       **/
      MetadataSet: AugmentedEvent<ApiType, [AssetId, Bytes, Bytes, u8, bool]>;
      /**
       * The owner changed \[asset_id, owner\]
       **/
      OwnerChanged: AugmentedEvent<ApiType, [AssetId, AccountId]>;
      /**
       * The management team changed \[asset_id, issuer, admin, freezer\]
       **/
      TeamChanged: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId, AccountId]>;
      /**
       * Some account `who` was thawed. \[asset_id, who\]
       **/
      Thawed: AugmentedEvent<ApiType, [AssetId, AccountId]>;
      /**
       * Some assets were transferred. \[asset_id, from, to, amount\]
       **/
      Transferred: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId, TAssetBalance]>;
      /**
       * An `amount` was transferred in its entirety from `owner` to `destination` by
       * the approved `delegate`.
       * \[id, owner, delegate, destination\]
       **/
      TransferredApproved: AugmentedEvent<ApiType, [AssetId, AccountId, AccountId, AccountId, TAssetBalance]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    balances: {
      /**
       * A balance was set by root. \[who, free, reserved\]
       **/
      BalanceSet: AugmentedEvent<ApiType, [AccountId, Balance, Balance]>;
      /**
       * Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
       **/
      Deposit: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * An account was removed whose balance was non-zero but below ExistentialDeposit,
       * resulting in an outright loss. \[account, balance\]
       **/
      DustLost: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * An account was created with some free balance. \[account, free_balance\]
       **/
      Endowed: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Some balance was reserved (moved from free to reserved). \[who, value\]
       **/
      Reserved: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Some balance was moved from the reserve of the first account to the second account.
       * Final argument indicates the destination balance type.
       * \[from, to, balance, destination_status\]
       **/
      ReserveRepatriated: AugmentedEvent<ApiType, [AccountId, AccountId, Balance, BalanceStatus]>;
      /**
       * Transfer succeeded. \[from, to, value\]
       **/
      Transfer: AugmentedEvent<ApiType, [AccountId, AccountId, Balance]>;
      /**
       * Some balance was unreserved (moved from reserved to free). \[who, value\]
       **/
      Unreserved: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    chocolateModule: {
      /**
       * parameters. [owner,name]
       **/
      ProjectCreated: AugmentedEvent<ApiType, [Bytes]>;
      /**
       * Event documentation should end with an array that provides descriptive names for event
       * parameters. [something, who]
       **/
      SomethingStored: AugmentedEvent<ApiType, [u32, AccountId]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       * \[proposal_hash\]
       **/
      Approved: AugmentedEvent<ApiType, [Hash]>;
      /**
       * A proposal was closed because its threshold was reached or after its duration was up.
       * \[proposal_hash, yes, no\]
       **/
      Closed: AugmentedEvent<ApiType, [Hash, MemberCount, MemberCount]>;
      /**
       * A motion was not approved by the required threshold.
       * \[proposal_hash\]
       **/
      Disapproved: AugmentedEvent<ApiType, [Hash]>;
      /**
       * A motion was executed; result will be `Ok` if it returned without error.
       * \[proposal_hash, result\]
       **/
      Executed: AugmentedEvent<ApiType, [Hash, DispatchResult]>;
      /**
       * A single member did some action; result will be `Ok` if it returned without error.
       * \[proposal_hash, result\]
       **/
      MemberExecuted: AugmentedEvent<ApiType, [Hash, DispatchResult]>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       * \[account, proposal_index, proposal_hash, threshold\]
       **/
      Proposed: AugmentedEvent<ApiType, [AccountId, ProposalIndex, Hash, MemberCount]>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       * \[account, proposal_hash, voted, yes, no\]
       **/
      Voted: AugmentedEvent<ApiType, [AccountId, Hash, bool, MemberCount, MemberCount]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    elections: {
      /**
       * A \[candidate\] was slashed by \[amount\] due to failing to obtain a seat as member or
       * runner-up.
       * 
       * Note that old members and runners-up are also candidates.
       **/
      CandidateSlashed: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Internal error happened while trying to perform election.
       **/
      ElectionError: AugmentedEvent<ApiType, []>;
      /**
       * No (or not enough) candidates existed for this round. This is different from
       * `NewTerm(\[\])`. See the description of `NewTerm`.
       **/
      EmptyTerm: AugmentedEvent<ApiType, []>;
      /**
       * A \[member\] has been removed. This should always be followed by either `NewTerm` or
       * `EmptyTerm`.
       **/
      MemberKicked: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A new term with \[new_members\]. This indicates that enough candidates existed to run
       * the election, not that enough have has been elected. The inner value must be examined
       * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
       * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
       * begin with.
       **/
      NewTerm: AugmentedEvent<ApiType, [Vec<ITuple<[AccountId, Balance]>>]>;
      /**
       * Someone has renounced their candidacy.
       **/
      Renounced: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A \[seat holder\] was slashed by \[amount\] by being forcefully removed from the set.
       **/
      SeatHolderSlashed: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    grandpa: {
      /**
       * New authority set has been applied. \[authority_set\]
       **/
      NewAuthorities: AugmentedEvent<ApiType, [AuthorityList]>;
      /**
       * Current authority set has been paused.
       **/
      Paused: AugmentedEvent<ApiType, []>;
      /**
       * Current authority set has been resumed.
       **/
      Resumed: AugmentedEvent<ApiType, []>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    sudo: {
      /**
       * The \[sudoer\] just switched identity; the old key is supplied.
       **/
      KeyChanged: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A sudo just took place. \[result\]
       **/
      Sudid: AugmentedEvent<ApiType, [DispatchResult]>;
      /**
       * A sudo just took place. \[result\]
       **/
      SudoAsDone: AugmentedEvent<ApiType, [DispatchResult]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed. \[error, info\]
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [DispatchError, DispatchInfo]>;
      /**
       * An extrinsic completed successfully. \[info\]
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [DispatchInfo]>;
      /**
       * An \[account\] was reaped.
       **/
      KilledAccount: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A new \[account\] was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * On on-chain remark happened. \[origin, remark_hash\]
       **/
      Remarked: AugmentedEvent<ApiType, [AccountId, Hash]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    treasury: {
      /**
       * Some funds have been allocated. \[proposal_index, award, beneficiary\]
       **/
      Awarded: AugmentedEvent<ApiType, [ProposalIndex, Balance, AccountId]>;
      /**
       * Some of our funds have been burnt. \[burn\]
       **/
      Burnt: AugmentedEvent<ApiType, [Balance]>;
      /**
       * Some funds have been deposited. \[deposit\]
       **/
      Deposit: AugmentedEvent<ApiType, [Balance]>;
      /**
       * New proposal. \[proposal_index\]
       **/
      Proposed: AugmentedEvent<ApiType, [ProposalIndex]>;
      /**
       * A proposal was rejected; funds were slashed. \[proposal_index, slashed\]
       **/
      Rejected: AugmentedEvent<ApiType, [ProposalIndex, Balance]>;
      /**
       * Spending has finished; this is the amount that rolls over until next spend.
       * \[budget_remaining\]
       **/
      Rollover: AugmentedEvent<ApiType, [Balance]>;
      /**
       * We have ended a spend period and will now allocate funds. \[budget_remaining\]
       **/
      Spending: AugmentedEvent<ApiType, [Balance]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    usersModule: {
      SomethingStored: AugmentedEvent<ApiType, [u32, AccountId]>;
      UserCreated: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  }

  export interface DecoratedEvents<ApiType extends ApiTypes> extends AugmentedEvents<ApiType> {
    [key: string]: ModuleEvents<ApiType>;
  }
}
