import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectWithIndex } from 'chocolate/typeSystem/jsonTypes';
import React, { useEffect, useState } from 'react';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import { getMockProjects, getProjects } from '../Projects';
/**
 *
 * @param {React.FormEvent<HTMLFormElement>} e
 */
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
// to-do: Make data types generic.
/**
 *  @description A placeholder for project view. Replace as needed
 * @type {React.FC<{data:ProjectWithIndex}}
 */
const DataSummaryDisplay: React.FC<{ data: ProjectWithIndex }> = function (props) {
  const { data } = props;
  const { project } = data;
  const { metaData, proposalStatus } = project;
  const { projectName } = metaData;
  const { status } = proposalStatus;
  // turn project into a class and allow it to average out rating from reviews.
  return (
    <article className={`project-view project-view--${status}`}>
      <img src={ChocolateRedBig} alt='Project Logo' width='16px' height='16px' />
      <p>{projectName}</p>
      <p>status: {status}</p>
    </article>
  );
};

/**
 * @description - A placeholder for projects view. Replace as needed
 * @type {React.FC<{data:ProjectWithIndex[]; found: boolean;}>}
 */
const DisplayResults: React.FC<{ data: ProjectWithIndex[]; found: boolean }> = function (props) {
  const { data, found } = props;
  // take project name, image, status.
  let content;
  if (!found) {
    content = (
      <>
        <p className='result_text'>Sorry, no results were found</p>
      </>
    );
  } else {
    content = data.map(each => <DataSummaryDisplay data={each} />);
  }
  return <div>{content}</div>;
};
/**
 * @description - Filters data by the search field and returns a copy for now, it returns the same data
 * @param {ProjectWithIndex[]} data
 * @param {string} value
 * @returns {[ProjectWithIndex[],boolean]}
 */
const calcResults = function (data: ProjectWithIndex[], value: string): [ProjectWithIndex[], boolean] {
  const filtered = data.filter(each => {
    const reg = new RegExp(`(${value})`, 'gi');
    return reg.exec(each.project.metaData.projectName); /* returns null otherwise */
  });
  let found = true;
  if (filtered.length === 0) found = false;
  return [filtered, found];
};
/**
 * @type {React.FC<{projects:ProjectWithIndex[]}>}
 */
const SearchBar: React.FC<{ projects: ProjectWithIndex[] }> = function (props) {
  // data state is handled externally
  const { projects } = props;
  const [value, setValue] = useState('');
  const [found, setFound] = useState(false);
  const [results, setResults] = useState<ProjectWithIndex[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const [newResults, isFound] = calcResults(projects, value);
    setFound(isFound);
    setResults(newResults);
  }, [projects, value]);

  return (
    <form role='search' onSubmit={handleSubmit}>
      <div className='search-wrap'>
        <input
          className='search-bar'
          type='search'
          placeholder='Search for a project'
          aria-label='Search for a project'
          value={value}
          onChange={e => {
            setValue(e.target.value);
            if (!isSearching) setIsSearching(true);
          }}
          onBlur={() => {
            setIsSearching(false);
          }}
        />
        {isSearching && <DisplayResults data={results} found={found} />}
      </div>
    </form>
  );
};

/**
 *
 * @description Redo of the projects page
 */
const ProjectsRe: React.FC = function () {
  const [projects, setProjects] = useState<ProjectWithIndex[]>([]);
  const { api, keyring, apiState } = useSubstrate();
  /**  use this to switch between deps for project - demo.  I.e use ret or ret2 - fallbacks */
  const isDemo = true;

  useEffect(() => {
    // prevent race conditions by only updating state when component is mounted
    let isMounted = true;
    async function run() {
      const ret = await getProjects(api.query.chocolateModule.projects.entries());
      // remove this when done with dev as it implies a req of connecting wallet to load projects
      const ret2 = isDemo && (await getMockProjects(keyring.getPairs()));
      const set = !ret.length ? ret2 : ret;
      if (isMounted) {
        setProjects(set);
      }
    }
    if (isDemo) {
      if (apiState === 'READY' && keyring) run();
    } else if (apiState === 'READY') run();
    return () => {
      isMounted = false;
    };
  }, [api, isDemo, keyring, apiState]);
  return (
    <main>
      <section>
        <img src={ChocolateRedBig} alt='Medium sized chocolate bar' width='120px' height='120px' />
        <p className='tagline'>Ending scam &amp; spam in crypto once and for all.</p>
        <SearchBar projects={projects} />
      </section>
      <section>
        <section>
          <h2>For Users</h2>
          <button type='button' className='btn btn_large btn--rev'>
            Submit a review
          </button>
        </section>
        <section>
          <h2>For Projects</h2>
          <div>
            <button type='button' className='btn btn_large btn--light btn--disabled-tbd'>
              Claim a project
            </button>
            <button type='button' className='btn btn_large btn--disabled-tbd'>
              Create a project
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ProjectsRe;
