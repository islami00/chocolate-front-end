/* eslint-disable import/no-unresolved */
import { User } from 'chocolate/typeSystem/jsonTypes';
/* eslint-enable import/no-unresolved */
import { UseQueryResult } from 'react-query';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { useUserReviews } from '../common/hooks/useUserReviews';
import Sidebar from './Sidebar';
import TableOfReviews from './TableOfReviews';

interface ProfileTableProps {
  user: UseQueryResult<User, Error>;
}
const ProfileTable: React.FC<ProfileTableProps> = (props) => {
  const { web3Address } = useParams<{ web3Address: string }>();
  // get all reviews associated with user.
  const search = useUserReviews(web3Address);

  const { user } = props;
  return (
    <Grid padded='vertically' style={{ paddingTop: '20px' }}>
      <Grid.Column floated='left' width={4} doubling>
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
