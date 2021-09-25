/* eslint-disable multiline-ternary */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Menu, Button, Dropdown, Container, Icon, Image, Label } from 'semantic-ui-react';
import { useApp } from './customComponents/state';

import { useSubstrate } from './substrate-lib';

function Main(props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');
  const { state, dispatch } = useApp();

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user',
  }));

  const [initialAddress, initialName] =
    keyringOptions.length > 0 ? [keyringOptions[0].value, keyringOptions[0].text] : ['', ''];
  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
    dispatch({ type: 'USER_DATA', payload: { accountAddress: initialAddress, name: initialName } });
  }, [setAccountAddress, initialAddress, initialName]);

  const onChange = (address) => {
    // Update state with new account address
    let userName;
    setAccountAddress(address);
    setAccountSelected(address);
    // find the userName from existing list
    keyringOptions.find((thisOpt) => {
      if (thisOpt.value === address) userName = thisOpt.text;
    });
    dispatch({ type: 'USER_DATA', payload: { accountAddress: address, name: userName } });
  };

  return (
    <Menu.Menu position='right' style={{ alignItems: 'center' }}>
      {!accountSelected ? (
        <span>
          Add your account with the{' '}
          <a target='_blank' rel='noopener noreferrer' href='https://github.com/polkadot-js/extension'>
            Polkadot JS Extension
          </a>
        </span>
      ) : null}
      <CopyToClipboard text={accountSelected}>
        <Button basic circular size='large' icon='user' color={accountSelected ? 'green' : 'red'} />
      </CopyToClipboard>
      <Dropdown
        search
        selection
        clearable
        placeholder='Select an account'
        options={keyringOptions}
        onChange={(_, dropdown) => {
          onChange(dropdown.value);
        }}
        value={accountSelected}
      />
      <BalanceAnnotation accountSelected={accountSelected} />
    </Menu.Menu>
  );
}

function BalanceAnnotation(props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);
  const { state, dispatch } = useApp();

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe, unsubscribe2;

    function desub(...subs) {
      subs.forEach((unsubable) => {
        unsubable && unsubable();
      });
    }
    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system
        .account(accountSelected, (balance) => {
          setAccountBalance(balance.data.free.toHuman());
        })
        .then((unsub) => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    // get user rank point data; Include reviews when obtained
    accountSelected &&
      api.query.usersModule
        .users(accountSelected, (userOpt) => {
          const rank = userOpt.value.toHuman()?.rank_points || 0;

          dispatch({ type: 'USER_DATA', payload: { rankPoints: rank } });
        })
        .then((unsub) => {
          unsubscribe2 = unsub;
        });
    // unsubscribe from previous
    return () => desub(unsubscribe, unsubscribe2);
  }, [api, accountSelected]);

  // display review along with balance. Label doesn't really fit
  return accountSelected ? (
    <>
      <Label pointing='left'>
        <Icon name='money' color='green' />
        {accountBalance}
      </Label>
      <Label pointing='left'>
        <Icon name='points' color='brown' />
        {state.userData.rankPoints}
      </Label>
    </>
  ) : null;
}

export default function AccountSelector(props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
