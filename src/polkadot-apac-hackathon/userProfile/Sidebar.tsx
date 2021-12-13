import { useChainProjects } from 'chocolate/polkadot-apac-hackathon/common/hooks/useUserReviews';
import { useSubstrate } from 'chocolate/substrate-lib';
import { User } from 'chocolate/typeSystem/jsonTypes';
import { useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';
import { Card, Container, Image, Button, Icon, Label, Grid } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

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
  const [userAggr, setUserAggr] = useState({ name: 'Anonymous' });
  // try to grab user from keyring
  const { web3Address } = useParams<{ web3Address: string }>();
  const search = useChainProjects(web3Address);

  const { keyring } = useSubstrate();
  useEffect(() => {
    if (keyring) {
      const userAccount = keyring.getPair(web3Address);
      if (userAccount.meta && userAccount.meta.name)
        setUserAggr({ name: userAccount.meta.name as string });
    }
  }, [keyring]);

  return (
    <Container fluid>
      <Card fluid>
        <Card.Content textAlign='center'>
          <Image centered src='https://picsum.photos/200 ' size='small' circular />
        </Card.Content>
        <Card.Content>
          <Card.Header textAlign='center'>{userAggr.name}</Card.Header>
          {/* get from server  - when joined */}

          <Card>
            <Card.Content>
              <Label color='purple' ribbon='right'>
                {/* assuming we store this meta on chain */}
                {userAggr.name !== 'Anonymous' ? 'Joined' : 'Not Joined'}
              </Label>
              <SideBarStat
                content='No. of Reviews'
                stat={search.data ? search.data.length.toString() : 'loading..'}
              />
              <SideBarStat content='Points' stat={user.data?.rankPoints?.toString() ?? '0'} />
            </Card.Content>
          </Card>
        </Card.Content>
        <Card.Content textAlign='center'>
          <Button
            size='big'
            compact
            href={`https://twitter.com/${userAggr.name}`}
            link
            icon='twitter square'
          />
          <Button
            compact
            size='big'
            href={`https://discord.com/${userAggr.name}`}
            link
            icon='discord'
          />
        </Card.Content>
      </Card>
    </Container>
  );
};
export default Sidebar;
