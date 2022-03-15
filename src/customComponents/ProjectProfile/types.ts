import React from 'react';
import { UseQueryResult } from 'react-query';
import { ProjectAl, ProjectID } from '../../interfaces';
import { NewMetaData, NewReview } from '../../typeSystem/jsonTypes';

export type PrProf = React.FC<{
  data: ProjectAl;
  rev: [ProjectAl, ProjectID];
  id: string;
}>;
export type ProfileSum = React.FC<{
  pQuery: UseQueryResult<NewMetaData, unknown>;
  rQuery: UseQueryResult<NewReview[], unknown>;
  project: ProjectAl;
}>;
export type SumRev = React.FC<{
  isLoading: boolean;
  disabled: boolean;
}>;
export type RevReel = React.FC<{ reelQuery: UseQueryResult<NewReview[], unknown> }>;
export type SubRev = React.FC;
