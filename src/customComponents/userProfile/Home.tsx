import { useSubstrate } from 'chocolate/substrate-lib';
import { NewReview, User } from 'chocolate/typeSystem/jsonTypes';
import { useState, useEffect, useReducer } from 'react';
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, Container, Dropdown, Input, Button, Checkbox, Table, Grid } from 'semantic-ui-react';
import { useChainProjects } from '../../common/hooks/useUserReviews';
import Sidebar from './Sidebar';
import TableOfReviews from './TableOfReviews';

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
const ProfileTable: React.FC<ProfileTableProps> = (props) => {
  const { web3Address } = useParams<{ web3Address: string }>();

  // get all reviews associated with user.

  const search = useChainProjects(web3Address);
  // setup the ui structure.
  // two grids. One floated left, the other right. The left grid will house user deets, right grid with table.
  // size accordingly
  const { user } = props;
  return (
    <Grid padded='vertically'>
      <Grid.Column  floated='left' width={3} doubling>
        <Sidebar user={user} />
      </Grid.Column>
      <Grid.Column floated='right' stretched width={10}>
        <TableOfReviews data={search} />
      </Grid.Column>
    </Grid>
  );
  // setup the table.
  // setup a loading state for the table. sth simple.

  // setup the left sidebar.
  // loading state for it too.

  // setup table filter controls.
  // our data will be put into a reducer so that we can freely edit that with our filters.
  // filters will send actions to the reducer that then thins out data output.
  // same state will render the ui.
};
export default ProfileTable;
