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
import { useApp } from '../state';

function Menu(props) {
  const { children } = props;
  const { state } = useApp();
  const urlIfy = link => (link === 'Home' ? '/' : `/${kebabCase(link)}`);

  const menuLinks = ['Projects', 'Review', 'Council', 'Wall of Shame'];
  // transform for easy editing of individual links
  const menuEls = menuLinks.map(linkText => (
    <li className={menu.nav_li} key={linkText}>
      <NavLink className='link nav_link' exact to={urlIfy(linkText)}>
        {linkText}
      </NavLink>
    </li>
  ));

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
      {/* AccountSelector/userModal, and sign-up btn */}
      <section style={{ display: 'flex', alignItems: 'center' }}>
        {state.userData.accountType === 'unset' ? (
          <NavLink exact to='/sign-up'>
            <Button type='sign-up' color='blue'>
              Sign up
            </Button>
          </NavLink>
        ) : (
          children
        )}
      </section>
    </header>
  );
}

export { Menu };
