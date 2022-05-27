/* eslint-disable import/no-unresolved */
import { Button, Center, createStyles, MediaQuery } from '@mantine/core';
import { ChocolateFancy } from 'chocolate/common/components/icons/ChocolateFancy';
import { ChocolateIcon } from 'chocolate/common/components/icons/ChocolateIcon';
import { SearchBar } from 'chocolate/common/components/inputs/SearchBar';
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
    columnGap: theme.spacing.xl,

    /* content buffing */
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
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
    columnGap: theme.spacing.xs / 2,
  },
  logo_icon: {
    width: theme.headings.sizes.h1.fontSize,
    [`@media (min-width: ${theme.breakpoints.xs}px )`]: { width: theme.fontSizes.xl },
  },
  logo_text: {
    display: 'none',
    [`@media (min-width: ${theme.breakpoints.xs}px )`]: {
      display: 'block',
      height: '23px',
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
          <ChocolateIcon className={classes.logo_icon} />
          <ChocolateFancy className={classes.logo_text} />
        </Center>
        <SearchBar />
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
