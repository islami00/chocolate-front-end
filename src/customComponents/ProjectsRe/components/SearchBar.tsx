import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calcResults, handleSubmit } from '../majorUtils';
import { NewProjectWithIndex } from '../../../typeSystem/jsonTypes';

// to-do: Make data types generic.
/** @description A placeholder for project view. Replace as needed */
const DataSummaryDisplay: React.FC<{ data: NewProjectWithIndex }> = function (props) {
  const { data } = props;
  const { Id, project } = data;
  const { metaData, proposalStatus } = project;
  const { name, icon } = metaData;
  const { status } = proposalStatus;
  // turn project into a class and allow it to average out rating from reviews.

  return (
    <li role='group' className={`search-result result search-result--${status.toLowerCase()}`}>
      <img src={icon} alt='Project Logo' width='16px' height='16px' />

      <Link className='search-result__link' to={`/project/${Id.toString()}`}>
        {name}
      </Link>
      <p style={{ fontWeight: 'bold' }}>status: {status}</p>
    </li>
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
        <p className='result'>Sorry, no results were found</p>
      </>
    );
  } else {
    // paginate for memory.
    content = data.map((each) => <DataSummaryDisplay key={JSON.stringify(each)} data={each} />);
  }
  return <ul className='ui results transition visible search-results'>{content}</ul>;
};

const SearchBar: React.FC<{ projects: NewProjectWithIndex[] }> = function (props) {
  // data state is handled externally
  const { projects } = props;
  const [value, setValue] = useState('');
  const [found, setFound] = useState(false);
  const [results, setResults] = useState<NewProjectWithIndex[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // eslint-disable-next-line no-undef
  const blurTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(
    () => () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    },
    []
  );
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(searchTimeoutRef.current);
      const localValue = e.target.value;
      setValue(localValue);
      if (localValue.length > 0) {
        searchTimeoutRef.current = setTimeout(() => {
          if (!isSearching) setIsSearching(true);
          const [searchResults, isFound] = calcResults(projects, localValue);
          setFound(isFound);
          setResults(searchResults);
        }, 300);
      } else {
        setFound(false);
        setIsSearching(false);
        setResults([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, projects]
  );
  function blurHandler() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 500);
  }
  function focusHandler() {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  }
  return (
    <form
      role='search'
      className='ui search'
      onBlur={blurHandler}
      onFocus={focusHandler}
      onSubmit={handleSubmit}
    >
      <div className='searchbar'>
        <input
          className='searchbar__input'
          type='search'
          placeholder='Search for a project'
          aria-label='Search for a project'
          value={value}
          onChange={handleChange}
        />
      </div>
      {isSearching && <DisplayResults data={results} found={found} />}
    </form>
  );
};
export { SearchBar };
