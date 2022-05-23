/* eslint-disable import/no-unresolved */
import { Button, Center, createStyles, MediaQuery, Text } from '@mantine/core';
import chocLogo from 'chocolate/assets/chocolate-red-small-responsive.svg';
import { AuthBtns } from 'chocolate/modules/Auth/components/AuthBtns';
import { Wallet } from 'chocolate/modules/Auth/components/Wallet';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme, _params, getRef) => ({
  'top-nav': {
    /* init */
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    /* content buffing */
    padding: `${theme.spacing.xs / 2}px ${theme.spacing.xl}px`,
    boxSizing: 'border-box',
    [`& > .${getRef('logo_container')}`]: {
      marginRight: 'auto',
    },
    color: theme.colors.dark[8],
    textAlign: 'center',
  },
  logo_container: {
    ref: getRef('logo_container'),
    columnGap: theme.spacing.xl,
  },
  logo: {
    ref: getRef('logo'),
    fontFamily: "'Pacifico', cursive",
    fontSize: theme.fontSizes.xl,
    columnGap: theme.spacing.xs / 2,
    '& > img': {
      width: theme.spacing.xl,
    },
  },
  nav_ul: {
    padding: 0,
    margin: 0,
    display: 'none',
    alignItems: 'center',
    height: '100%',
    columnGap: theme.spacing.xs / 2,

    '& > li': {
      listStyleType: 'none',
      transition: 'all 0.2s linear',
      // !necessary for measurement to work
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      '& > a': {
        border: 0,
      },
    },
  },
}));
const Menu = function (): JSX.Element {
  const { classes, cx } = useStyles();
  const logo = cx(classes.logo);
  return (
    <div className={classes['top-nav']}>
      <Center className={classes.logo_container}>
        <Center className={logo}>
          <img src={chocLogo} alt='Chocolate logo' />
          <Text inherit component={Link} to='/'>
            Chocolate
          </Text>
        </Center>
        <MediaQuery largerThan='xs' styles={{ display: 'flex' }}>
          <ul className={classes.nav_ul}>
            <li>
              <Button variant='default' component={Link} to='/gallery'>
                Projects
              </Button>
            </li>
            <AuthBtns />
          </ul>
        </MediaQuery>
      </Center>
      <Wallet />
    </div>
  );
};
export default Menu;
