import { Link } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

export default function LandingPage() {
  return (
    <Container textAlign='left'>
      <h1>Landing page</h1>
      <Button as={Link} to='/app' primary>
        App
      </Button>
    </Container>
  );
}
