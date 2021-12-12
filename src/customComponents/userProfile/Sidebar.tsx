import { User } from 'chocolate/typeSystem/jsonTypes';
import { UseQueryResult } from 'react-query';
import { Card, Container, Image, Button, Icon, Label, Grid } from 'semantic-ui-react';

interface SidebarProps {
  user: UseQueryResult<User, Error>;
}

const SideBarStat: React.FC<{
  content: string;
  stat: string;
}> = ({ content, stat }) => (
  <div
    style={{
      padding: '5px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <span>{content}</span>
    <span>{stat}</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { user } = props;
  return (
    <Container fluid>
      <Card fluid>
        <Card.Content textAlign='center'>
          <Image centered src='https://picsum.photos/200 ' size='small' circular />
        </Card.Content>
        <Card.Content>
          <Card.Header textAlign='center'>Alice</Card.Header>
          {/* get from server */}
          <Card.Meta textAlign='center'>joined august</Card.Meta>

          <Card>
            <Card.Content>
              <Label color='purple' ribbon='right'>
                Accepted
              </Label>
              <SideBarStat content='No. of Reviews' stat='5' />
              <SideBarStat content='Staking' stat='$5' />
              <SideBarStat content='Points' stat={user.data?.rankPoints?.toString() ?? '0'} />
            </Card.Content>
          </Card>
        </Card.Content>
        <Card.Content textAlign='center'>
          <Icon name='twitter square' size='big' />
          <Icon name='discord' size='big' />
        </Card.Content>
      </Card>
    </Container>
  );
};
export default Sidebar;
