import { useSubstrate } from 'chocolate/substrate-lib';
import { NewReview, User } from 'chocolate/typeSystem/jsonTypes';
import { useState, useEffect, useReducer } from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, Container, Dropdown, Input, Button, Checkbox, Table } from 'semantic-ui-react';
import useUserReviews, { useChainProjects, useReviewMeta } from '../../common/hooks/useUserReviews';

interface ReviewTableAction {
  type: 'add' | 'FILTER_PROJECT' | 'FILTER_RATING' | 'FILTER_TIME';
  projectID?: number;
  rating?: number;
  time?: number;
  review?: NewReview[];
}
const reviewTableReducer = (state: NewReview[], action: ReviewTableAction) => {
  switch (action.type) {
    case 'add':
      return [...state, ...(action.review ?? [])];
    case 'FILTER_PROJECT':
      return state.filter((review) => review.projectID === action.projectID);
    case 'FILTER_RATING':
      return state.filter((review) => Number(review.content.rating) === action.rating);
    default:
      return state;
  }
};
interface ProfileTableProps {
  user: UseQueryResult<User, Error>;
}
const ProfileTable: React.FC<ProfileTableProps> = () => {
  const { web3Address } = useParams<{ web3Address: string }>();

  // get all reviews associated with user.

  const { data, isLoading, isError } = useChainProjects(web3Address);
  // see how the query performs.
  console.log(data);
  // setup the ui structure.

  // setup the table.
  // setup a loading state for the table. sth simple.

  // setup the left sidebar.
  // loading state for it too.

  // setup table filter controls.
  // our data will be put into a reducer so that we can freely edit that with our filters.
  // filters will send actions to the reducer that then thins out data output.
  // same state will render the ui.
  return <div className='kade' />;
};
export default ProfileTable;
