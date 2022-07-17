import React from 'react';
import { UseQueryResult } from 'react-query';
import { ProjectAl, ProjectID } from '../../interfaces';
import { HumanNewProjectWithIndex, HumanNewReview } from '../../typeSystem/jsonTypes';

export type PrProf = React.FC<{
  data: ProjectAl;
  proj: [ProjectAl, ProjectID];
  id: string;
}>;
export type ProfileSum = React.FC<{
  profileQ: UseQueryResult<HumanNewProjectWithIndex, unknown>;
}>;
export type SumRev = React.FC<{
  disabled: boolean;
  proj: [ProjectAl, ProjectID];
}>;
export type RevReel = React.FC<{
  /**  [reviews,anyErred, anyInitiallyLoading, allIdle] --toDo: Change to object */
  reelData: [HumanNewReview[], boolean, boolean, boolean];
}>;
export type SubRev = React.FC<{
  proj: [ProjectAl, ProjectID];
}>;
