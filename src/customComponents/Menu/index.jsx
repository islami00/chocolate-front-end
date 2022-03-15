// regular imports
import { kebabCase } from 'lodash';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
// styles
import menu from '../../styles/menu.module.scss';
import '../../styles/menu.scss';
// util imports
import { chocolateLogo } from '../constants';
import { storageKey } from '../loading';
import { useApp } from '../state';

function Menu(props) {
  const { children } = props;
  const { state, dispatch } = useApp();
  const urlIfy = (link, root = '') =>
    link === 'Home' ? `/${root}` : `/${root}${root !== '' && '/'}${kebabCase(link)}`;

  const menuLinks = ['Projects', 'Review', 'Council', 'Wall of Shame'];
  // transform for easy editing of individual links - note: this is the menu for the app component
  const menuEls = menuLinks.map((linkText) => (
    <li className={menu.nav_li} key={linkText}>
      <NavLink className='link nav_link' exact to={urlIfy(linkText, 'app')}>
        {linkText}
      </NavLink>
    </li>
  ));
  const handleSignOut = function () {
    window.localStorage.setItem(storageKey, 'unset');
    dispatch({ type: 'USER_DATA', payload: { accountType: 'unset' } });
  };
  return (
    <header className={menu.header}>
      <Link to='/'>
        <section className={menu.logo}>
          <img src={chocolateLogo} alt='chocolate-logo' />
        </section>
      </Link>

      <nav className={menu.nav}>
        <ul className={menu.nav_ul}>{menuEls}</ul>
      </nav>
      {/* AccountSelector/userModal, or sign-up btn */}
      <section style={{ display: 'flex', alignItems: 'center' }}>
        {state.userData.accountType === 'unset' ? (
          <Button as={Link} to='/app/sign-up' color='blue'>
            Sign up
          </Button>
        ) : (
          <>
            {children}
            <Button as={Link} to='/app/sign-up' color='blue' onClick={() => handleSignOut()}>
              Sign out
            </Button>
          </>
        )}
      </section>
    </header>
  );
}

export { Menu };
