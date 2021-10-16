import React, { useEffect, useState } from 'react';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
/**
 *
 * @param {React.FormEvent<HTMLFormElement>} e
 */
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
/**
 *  @description A placeholder for project view. Replace as needed
 * @type {React.FC<{data:object}}
 */
const DataSummaryDisplay: React.FC<{ data: object }> = function (props) {
  return (
    <article>
      <p>This is a display instance of data</p>
    </article>
  );
};

/**
 * @description - A placeholder for projects view. Replace as needed
 * @type {React.FC<{data:object[]| []}>}
 */
const DisplayResults: React.FC<{ data: object[] | [] }> = function (props) {
  const { data } = props;
  let content;
  if (data.length === 0) {
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
 * @param {object[]} data
 * @param {string} value
 * @returns {object[]}
 */
const calcResults = function (data: object[], value: string) {
  const filtered = data.filter(data => {
    const reg = new RegExp(`(${value})`, 'g');
    // return data?.field.match(reg);
  });

  return filtered;
};
/**
 * @type {React.FC<{projects:object[]}>}
 */
const SearchBar: React.FC<{ projects: object[] }> = function (props) {
  // data state is handled externally
  const { projects } = props;
  const [value, setValue] = useState('');
  const [results, setResults] = useState<object[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const newResults = calcResults(projects, value);
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
            setIsSearching(true);
          }}
          onBlur={() => {
            setIsSearching(false);
          }}
        />
        {isSearching && <DisplayResults data={results} />}
      </div>
    </form>
  );
};

/**
 *
 * @description Redo of the projects page
 */
const ProjectsRe = function () {
  const [projects, setProjects] = useState<object[]>([]);
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
          <button className='btn btn_large btn--rev'>Submit a review</button>
        </section>
        <section>
          <h2>For Projects</h2>
          <div>
            <button className='btn btn_large btn--light'>Claim a project</button>
            <button className='btn btn_large btn_large'>Create a project</button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default ProjectsRe;
