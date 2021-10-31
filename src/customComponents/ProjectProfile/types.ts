import React from 'react';
import { ProjectAl } from '../../interfaces';
import { NewMetaData, NewReview } from '../../typeSystem/jsonTypes';

export type PrProf = React.FC<{
  data: ProjectAl;
  id: string;
}>;
export type ProfileSum = React.FC<{
  data: NewMetaData;
  isFetched: boolean;
  isLoading: boolean;
  ave: string;
}>;
export type SumRev = React.FC<{
  isLoading: boolean;
  disabled: boolean;
}>;
export type RevReel = React.FC<{
  data: NewReview[];
  isFetched: boolean;
  isLoading: boolean;
}>;
export type SubRev = React.FC;
