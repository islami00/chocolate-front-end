import { Button, Center, createStyles } from '@mantine/core';
import { useState } from 'react';
import WalletPurple from '../../../assets/wallet-purple.svg';
import { HandleWallet } from './HandleWallet';

const useStyles = createStyles((theme) => ({
  wallet: {
    position: 'relative',
  },
  wallet_icon: {
    height: theme.spacing.xl,
  },
}));
/**
 *
 * @description A wallet that does wallet stuff.
 * CLick to show account details in a modal or tell you to sign-up
 */
export function Wallet(): JSX.Element {
  const { classes } = useStyles();
  // setup modal state
  const [open, setOpen] = useState(false);
  // manage modal state
  const handleModal = () => {
    setOpen((prev) => !prev);
  };
  // clean returns
  return (
    <Center className={classes.wallet}>
      <Button onClick={handleModal} variant='default' size='sm'>
        {/* TOdo: Move wallet to a left icon */}
        <img src={WalletPurple} alt='Wallet' className={classes.wallet_icon} />
        {/* Then content as current addr or name */}
        {/* Then we have a right icon signifying dropdown arrow */}
      </Button>
      {open && <HandleWallet />}
    </Center>
  );
}
