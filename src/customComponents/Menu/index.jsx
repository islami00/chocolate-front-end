// regular imports
import React from 'react';
import { NavLink } from 'react-router-dom';
import { kebabCase } from 'lodash';
// util imports
import { chocolateLogo } from '../constants';
// styles
import menu from '../../styles/menu.module.scss';
import '../../styles/menu.scss';

function Menu(props) {
  const { children } = props;
  const urlIfy = (link) => (link === 'Home' ? '/' : `/${kebabCase(link)}`);

  const menuLinks = ['Home', 'Projects', 'Review', 'Council', 'Wall of Shame'];
  // transform for easy editing of individual links
  const menuEls = menuLinks.map((linkText) => (
    <li className={menu.nav_li} key={linkText}>
      <NavLink className='link nav_link' exact to={urlIfy(linkText)}>
        {linkText}
      </NavLink>
    </li>
  ));

  return (
    <header className={menu.header}>
      <section className={menu.logo}>
        <img src={chocolateLogo} alt='chocolate-logo' />
      </section>

      <nav className={menu.nav}>
        <ul className={menu.nav_ul}>{menuEls}</ul>
      </nav>
      {/* AccountSelector/userModal */}
      {children}
    </header>
  );
}

export { Menu };
