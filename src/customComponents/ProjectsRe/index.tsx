import { ProjectWithIndex } from 'chocolate/typeSystem/jsonTypes';
import React, { useEffect, useState } from 'react';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import { useProjects } from './hooks';
import './project.css';
/**
 *
 * @param {React.FormEvent<HTMLFormElement>} e
 */
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
/**
 * @description - Filters data by the search field and returns a copy for now, it returns the same data
 * @param {ProjectWithIndex[]} data
 * @param {string} value
 * @returns {[ProjectWithIndex[],boolean]}
 */
const calcResults = function (
  data: ProjectWithIndex[],
  value: string
): [ProjectWithIndex[], boolean] {
  const filtered = data.filter(each => {
    const reg = new RegExp(`(${value})`, 'gi');
    return reg.exec(
      each.project.metaData.projectName
    ); /* returns null otherwise */
  });
  let found = true;
  if (filtered.length === 0) found = false;
  return [filtered, found];
};
// to-do: Make data types generic.
/**
 *  @description A placeholder for project view. Replace as needed
 * @type {React.FC<{data:ProjectWithIndex}}
 */
const DataSummaryDisplay: React.FC<{ data: ProjectWithIndex }> = function (
  props
) {
  const { data } = props;
  const { project } = data;
  const { metaData, proposalStatus } = project;
  const { projectName } = metaData;
  const { status } = proposalStatus;
  // turn project into a class and allow it to average out rating from reviews.
  return (
    <section className={`search-result search-result--${status}`}>
      <img
        src={ChocolateRedBig}
        alt='Project Logo'
        width='16px'
        height='16px'
      />
      <p className='search-result__link'>{projectName}</p>
      <p>status: {status}</p>
    </section>
  );
};

/**
 * @description - A placeholder for projects view. Replace as needed
 * @type {React.FC<{data:ProjectWithIndex[]; found: boolean;}>}
 */
const DisplayResults: React.FC<{ data: ProjectWithIndex[]; found: boolean }> =
  function (props) {
    const { data, found } = props;
    // take project name, image, status.
    let content: JSX.Element | JSX.Element[];
    if (!found) {
      content = (
        <>
          <p className='result_text'>Sorry, no results were found</p>
        </>
      );
    } else {
      content = data.map(each => <DataSummaryDisplay data={each} />);
    }
    return <article className='search-results'>{content}</article>;
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
      <div className='searchbar'>
        <input
          className='searchbar__input'
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

/** @description Redo of the projects page */
const ProjectsRe: React.FC = function () {
  const { data, isFetched } = useProjects();
  return (
    <main>
      <section>
        <img
          className='top_img'
          src={ChocolateRedBig}
          alt='Medium sized chocolate bar'
          width='120px'
          height='120px'
        />
        <p className='tagline'>
          Ending scam &amp; spam in crypto once and for all.
        </p>
        {isFetched && <SearchBar projects={data} />}
      </section>
    </main>
  );
};

export default ProjectsRe;
