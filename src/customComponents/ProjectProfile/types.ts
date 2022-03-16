import React from 'react';
import { UseQueryResult } from 'react-query';
import { ProjectAl, ProjectID } from '../../interfaces';
import { NewProjectWithIndex, NewReview } from '../../typeSystem/jsonTypes';

export type PrProf = React.FC<{
  data: ProjectAl;
  proj: [ProjectAl, ProjectID];
  id: string;
}>;
export type ProfileSum = React.FC<{
  profileQ: UseQueryResult<NewProjectWithIndex, unknown>;
  reviews: NewReview[];
}>;
export type SumRev = React.FC<{
  disabled: boolean;
  proj: [ProjectAl, ProjectID];
}>;
export type RevReel = React.FC<{
  /**  [reviews,anyErred, anyInitiallyLoading, allIdle] --toDo: Change to object */
  reelData: [NewReview[], boolean, boolean, boolean];
}>;
export type SubRev = React.FC<{
  proj: [ProjectAl, ProjectID];
}>;
