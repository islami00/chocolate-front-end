import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Button, Card, Header, Container } from 'semantic-ui-react';
import { loader, message } from '../customComponents/utilities';
import Login from './login-interaction';
import SignUp from './sign-up-interaction';
import { useSubstrate } from '../substrate-lib';

const AuthView: React.FC = function () {
  const state = useSubstrate();
  const { apiState, apiError } = state;

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  // give user option to connect wallet after selecting signup with web3 address
  // then run async load accounts
  // then run the regular auth process.
  // for auth routing, if not signed in, redirect to login
  // if signed in, redirect to home
  // if not signup at login, show error and direct to signup (show signup button - separate this as its own component)
  // run signup dance with server
  // redirect to login and get signedup with deets automatically from url search params (consider that in core signup props)
  // redirect to home from login.
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Container
            textAlign='center'
            style={{ height: '100vh', display: 'flex', alignItems: 'center' }}
            fluid>
            <Card centered>
              <Card.Header content='Welcome Home' />
              <Card.Content>
                <Button as={Link} to='sign-up' color='purple'>
                  Signup
                </Button>
                <Button as={Link} to='login'>
                  Login
                </Button>
              </Card.Content>
            </Card>
          </Container>
        </Route>
        <Route path='/sign-up'>
          <SignUp />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>

        <Route path='*'>{message('Page not found', true)}</Route>
      </Switch>
    </Router>
  );
};
export default AuthView;
