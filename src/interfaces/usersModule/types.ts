// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Option, Struct, u32 } from '@polkadot/types';

/** @name User */
export interface User extends Struct {
  readonly rankPoints: u32;
  readonly projectId: Option<u32>;
}

export type PHANTOM_USERSMODULE = 'usersModule';
