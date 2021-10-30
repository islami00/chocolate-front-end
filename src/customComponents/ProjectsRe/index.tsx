/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChocolateRedBig from '../../assets/chocolate-red-big.svg';
import { NewProjectWithIndex } from '../../typeSystem/jsonTypes';
import { useProjects } from './hooks';
import './project.css';

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
/** @description - Filters data by the search field and returns a copy for now, it returns the same data */
const calcResults = function (
  data: NewProjectWithIndex[],
  value: string
): [NewProjectWithIndex[], boolean] {
  const filtered = data.filter((each) => {
    const reg = new RegExp(`(${value})`, 'gi');
    return reg.exec(each.project.metaData.name); /* returns null otherwise */
  });
  let found = true;
  if (filtered.length === 0) found = false;
  return [filtered, found];
};
// to-do: Make data types generic.
/** @description A placeholder for project view. Replace as needed */
const DataSummaryDisplay: React.FC<{ data: NewProjectWithIndex }> = function (
  props
) {
  const { data } = props;
  const { Id, project } = data;
  const { metaData, proposalStatus } = project;
  const { name, icon } = metaData;
  const { status } = proposalStatus;
  // turn project into a class and allow it to average out rating from reviews.

  return (
    <section
      role="group"
      className={`search-result result search-result--${status}`}
    >
      <img src={icon} alt="Project Logo" width="16px" height="16px" />

      <Link className="search-result__link" to={`/project/${Id.toString()}`}>
        {name}
      </Link>
      <p>status: {status}</p>
    </section>
  );
};

/** @description - A placeholder for projects view. Replace as needed */
const DisplayResults: React.FC<{
  data: NewProjectWithIndex[];
  found: boolean;
}> = function (props) {
  const { data, found } = props;
  // take project name, image, status.
  let content: JSX.Element | JSX.Element[];
  if (!found) {
    content = (
      <>
        <p className="result">Sorry, no results were found</p>
      </>
    );
  } else {
    // paginate for memory.
    content = data.map((each) => (
      <DataSummaryDisplay key={JSON.stringify(each)} data={each} />
    ));
  }
  return (
    <article className="ui results transition visible search-results">
      {content}
    </article>
  );
};

const SearchBar: React.FC<{ projects: NewProjectWithIndex[] }> = function (
  props
) {
  // data state is handled externally
  const { projects } = props;
  const [value, setValue] = useState('');
  const [found, setFound] = useState(false);
  const [results, setResults] = useState<NewProjectWithIndex[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // eslint-disable-next-line no-undef
  const timeOutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const [newResults, isFound] = calcResults(projects, value);
    setFound(isFound);
    setResults(newResults);
  }, [projects, value]);
  function blurHandler() {
    const timeOutId = setTimeout(() => {
      setIsSearching(false);
    });
    timeOutRef.current = timeOutId;
  }
  function focusHandler() {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
  }
  return (
    <form
      role="search"
      className="ui search"
      onBlur={blurHandler}
      onFocus={focusHandler}
      onSubmit={handleSubmit}
    >
      <div className="searchbar">
        <input
          className="searchbar__input"
          type="search"
          placeholder="Search for a project"
          aria-label="Search for a project"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!isSearching) setIsSearching(true);
          }}
        />
      </div>
      {isSearching && <DisplayResults data={results} found={found} />}
    </form>
  );
};

/** @description Redo of the projects page */
const ProjectsRe: React.FC = function () {
  const { data, isFetched } = useProjects();
  return (
    <main className="land">
      <section className="land__content">
        <img
          className="top_img"
          src={ChocolateRedBig}
          alt="Medium sized chocolate bar"
          width="120px"
          height="120px"
        />
        <p className="tagline">
          Ending scam &amp; spam in crypto once and for all.
        </p>
        {isFetched && <SearchBar projects={data} />}
      </section>
      <section className="link_buttons">
        <div className="ui button purple group">
          <Link className="ui button purple choc-pink" to="/gallery">
            Find a project
          </Link>
          <Link className="ui button purple choc-pink" to="/wall-of-shame">
            Wall of shame
          </Link>
        </div>
        <div className="ui button purple disabled group">
          <button type="button" className="ui button purple disabled">
            Create a project
          </button>
          <button type="button" className="ui button purple disabled">
            Claim a project
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProjectsRe;
