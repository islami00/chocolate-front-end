/* eslint-disable import/no-unresolved */
import { useAuthService } from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
import _ from 'lodash';
import { useEffect, useReducer } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { asyncCacheLocal } from '../../utils';
import { useProfileData } from '../hooks/useProject';
/* eslint-enable import/no-unresolved */
import { SubRev } from '../types';
import { CheckAuthAndGetCid, CheckCidProps } from './CheckAuthAndGetCid';
import type { LocalFormProps } from './FormToEnter';
import { FormToEnter } from './FormToEnter';
import { SubmitReviewTx as SubmitToChain } from './SubmitReviewTx';
// cache reducer types
export interface Stage1Cache {
  [x: string]: unknown;
  comment: string;
  rating: number;
}
export type Stage2Cache = string;
export interface StageCache {
  stage1: Stage1Cache;
  stage2: Stage2Cache;
}
export interface CacheAction {
  type: string;
  stage1?: { comment: string; rating: number };
  stage2?: string;
  id: string;
  cache?: StageCache;
}

// cache init
const InitialCache: StageCache = {
  stage1: {
    comment: '',
    rating: 0,
  },
  stage2: '',
};
const GetInitialCache = (id: string, initialCache: StageCache): StageCache => {
  // populate each field - stage1.

  const keys = Object.keys(initialCache.stage1);
  const stageCacheClone = _.cloneDeep(initialCache);
  keys.forEach((key: keyof Stage1Cache) => {
    let Value1: number | string = localStorage.getItem(`stage1-project${id}-${key}`);
    if (key === 'rating') Value1 = Number.parseInt(Value1);
    if (Value1 === '' || Value1 === undefined || Value1 === null) return;
    stageCacheClone.stage1[key] = Value1;
  });
  // populate stage2
  const value = localStorage.getItem(`stage2-project${id}-cid`);
  stageCacheClone.stage2 = value || '';
  return { ...stageCacheClone };
};

// stage cache reducer
const stageCacheReducer = (state: StageCache, action: CacheAction) => {
  switch (action.type) {
    case 'stage1':
      // cache in local storage. Note the tag of project id to ensure proper load
      Object.keys(action.stage1).forEach((key) => {
        asyncCacheLocal(`stage1-project${action.id}-${key}`, action.stage1[key]).finally(() => {});
      });

      return { ...state, stage1: action.stage1 };
    case 'stage2':
      asyncCacheLocal(`stage2-project${action.id}-cid`, action.stage2).finally(() => {});
      return { ...state, stage2: action.stage2 };
    case 'reset':
      return InitialCache;
    case 'initialise':
      return GetInitialCache(action.id, state);
    default:
      return state;
  }
};
const SubmitReviewForm: SubRev = function (props) {
  const debug = !!process.env.REACT_APP_DEBUG;
  const { proj } = props;
  // get stage from reducer
  const { stage } = useParams<{ stage: string }>();
  // get cid from cache
  const [cache, dispatchCache] = useReducer(stageCacheReducer, InitialCache);
  const { isAuthenticated } = useAuthService();
  // stage1 deets
  const id = proj[1].toHuman();
  useEffect(() => {
    dispatchCache({ type: 'initialise', id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const profileQ = useProfileData(proj);
  const formProps: LocalFormProps = {
    id,
    projectName: profileQ.data?.project.metadata.name,
    dispatchCache,
    cachedForm: cache.stage1,
  };
  // stage2 deets
  const initCheckCidProps: CheckCidProps = {
    ...cache.stage1,
    isAuthenticated,
    dispatchCache,
  };
  // stage3 deets
  const initChainProps = {
    id,
    cid: cache.stage2,
  };
  if (debug) console.count('SubmitReviewForm');
  const location = useLocation();

  if (stage >= '2' && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  // render based on stage
  switch (stage) {
    case '1':
      return <FormToEnter {...formProps} />;
    case '2':
      return <CheckAuthAndGetCid {...initCheckCidProps} />;
    case '3':
      return <SubmitToChain {...initChainProps} />;
    default:
      // render step one by default.
      return <FormToEnter {...formProps} />;
  }
};
export { SubmitReviewForm };
