/* eslint-disable import/no-unresolved */
import { Center, createStyles, MediaQuery, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import chocLogo from 'chocolate/assets/chocolate-red-small-responsive.svg';
import { AuthBtns } from 'chocolate/modules/Auth/components/AuthBtns';
import { Wallet } from 'chocolate/modules/Auth/components/Wallet';
import { Link } from 'react-router-dom';
import './wallet.css';

const useStyles = createStyles((theme, _params: { liHeight: number }, getRef) => ({
  'top-nav': {
    /* init */
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    /* content buffing */
    padding: `${theme.spacing.xs / 2}px ${theme.spacing.xl}px`,
    boxSizing: 'border-box',
    [`& > .${getRef('logo')}`]: {
      marginRight: 'auto',
    },
    color: theme.colors.dark[8],
    textAlign: 'center',
  },
  logo: {
    ref: getRef('logo'),
    fontFamily: "'Pacifico', cursive",
    fontSize: theme.fontSizes.xl,
    img: {
      marginRight: theme.spacing.xs / 2,
      width: theme.spacing.xl,
    },
  },
  'nav-link': {},
  nav_ul: {
    padding: 0,
    margin: 0,
    display: 'none',
    alignItems: 'center',

    '& > li': {
      listStyleType: 'none',
      transition: 'all 0.2s linear',
      // !necessary for measurement to work
      height: '100%',
      '& > a': {
        display: 'inline-block',
        padding: `0 ${theme.spacing.md}px`,
        // Centers the text in the anchor by filling parent.
        lineHeight: `${_params.liHeight}px`,
      },
      '&:hover': {
        '> a': {
          //  theme.colors.violet[5] is choc col
          backgroundColor: theme.colors.violet[1],
          borderRadius: theme.radius.lg,
        },
      },
    },
  },
}));
const Menu = function (): JSX.Element {
  const { ref: liRef, height: liHeight } = useElementSize();
  const { classes, cx } = useStyles({ liHeight });
  const logo = cx(classes.logo);
  return (
    <div className={classes['top-nav']}>
      <Center inline className={logo}>
        <img src={chocLogo} alt='Chocolate logo' />
        <Text inherit component={Link} to='/'>
          Chocolate
        </Text>
      </Center>
      <MediaQuery largerThan='xs' styles={{ display: 'flex' }}>
        <ul className={classes.nav_ul}>
          <li ref={liRef}>
            <Text component={Link} className={classes['nav-link']} to='/gallery'>
              Projects
            </Text>
          </li>
          <AuthBtns classes={classes} />
        </ul>
      </MediaQuery>
      <Wallet />
    </div>
  );
};
export default Menu;
