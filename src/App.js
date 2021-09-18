import React, { useState, createRef } from 'react';
import { Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import AccountSelector from './AccountSelector';
import './styles/index.scss';
import { Loading } from './customComponents/loading';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress);

  const loader = (text) => (
    <main className='main-wrap'>
      <Loading message={text} />
    </main>
  );

  const message = (err) => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>
  );

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader("Loading accounts (please review any extension's authorization)");
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      {/* show this on the login page instead, customise to if multiple */}
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <DeveloperConsole />
    </div>
  );
}

// default app
export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
