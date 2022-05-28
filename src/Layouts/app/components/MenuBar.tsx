/* eslint-disable import/no-unresolved */
import { Button, Center, createStyles, Group, MediaQuery } from '@mantine/core';
import { ChocolateFancy } from 'chocolate/common/components/icons/ChocolateFancy';
import { ChocolateIcon } from 'chocolate/common/components/icons/ChocolateIcon';
import { SearchBar } from 'chocolate/common/components/inputs/SearchBar';
import { AuthBtns } from 'chocolate/modules/Auth/components/AuthBtns';
import { Wallet } from 'chocolate/modules/Auth/components/Wallet';
import { Link, useMatch } from 'react-router-dom';

interface Params {
  isSearchPage: boolean;
}
const useStyles = createStyles((theme, params: Params = { isSearchPage: false }, getRef) => ({
  'top-nav': {
    /* init, necessary for good size */
    width: '100%',
    height: '100%',
    columnGap: theme.spacing.xl,
    [`@media (min-width: ${theme.breakpoints.xs}px )`]: { columnGap: '0px' },

    /* content buffing */
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    [`& > .${getRef('logo_container')}`]: {
      marginRight: 'auto',
    },
    color: theme.colors.dark[8],
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
    [`@media (min-width: ${theme.breakpoints.sm}px )`]: { width: theme.fontSizes.xl },
  },
  logo_text: {
    display: 'none',
    [`@media (min-width: ${theme.breakpoints.sm}px )`]: {
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
  searchbar: {
    display: params.isSearchPage ? undefined : 'none',
  },
}));
const Menu = function (): JSX.Element {
  const isSearchPage = !!useMatch('/search');
  const { classes, cx } = useStyles({ isSearchPage });
  const logo = cx(classes.logo);
  return (
    <Group noWrap position='right' className={classes['top-nav']}>
      <Center className={classes.logo_container}>
        <Center className={logo}>
          <ChocolateIcon className={classes.logo_icon} />
          <ChocolateFancy className={classes.logo_text} />
        </Center>
        <SearchBar className={classes.searchbar} />
        <MediaQuery largerThan='sm' styles={{ display: 'flex' }}>
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
    </Group>
  );
};
export default Menu;
