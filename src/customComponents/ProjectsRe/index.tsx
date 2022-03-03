/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import { NewProjectWithIndex } from '../../typeSystem/jsonTypes';
import { useProjects } from './hooks';
import './project.css';
import _ from 'lodash';

import { SearchBar } from './components/SearchBar';

/** @description Redo of the projects page */
const ProjectsRe: React.FC = function () {
  const { data, isError } = useProjects();
  useEffect(() => {
    if (isError && !data) toast.error('Something went wrong fetching search list');
    return () => {};
  }, [isError, data]);
  return (
    <main className='land'>
      <section className='land__content'>
        <img
          className='top_img'
          src={ChocolateRedBig}
          alt='Medium sized chocolate bar'
          width='120px'
          height='120px'
        />
        <p className='tagline'>Ending scam &amp; spam in crypto once and for all.</p>
        <SearchBar projects={data || []} />
      </section>
      <section className='link_buttons'>
        <div className='ui button purple group'>
          <Link className='ui button purple choc-pink' to='/gallery'>
            Find a project
          </Link>
          <Link className='ui button purple choc-pink' to='/wall-of-shame'>
            Wall of shame
          </Link>
        </div>
        <div className='ui button purple disabled group'>
          <button type='button' className='ui button purple disabled'>
            Create a project
          </button>
          <button type='button' className='ui button purple disabled'>
            Claim a project
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProjectsRe;
