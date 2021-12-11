import _ from 'lodash';
import { NewProjectWithIndex } from '../../typeSystem/jsonTypes';

/** @description - Filters data by the search field and returns a copy for now, it returns the same data */
const calcResults = function (
  data: NewProjectWithIndex[],
  value: string
): [NewProjectWithIndex[], boolean] {
  const filtered = data.filter((each) => {
    const reg = new RegExp(`(${value})`, 'gi');
    const escaped = _.escapeRegExp(each.project.metaData.name);
    return reg.exec(escaped); /* returns null otherwise */
  });
  let found = true;
  if (filtered.length === 0) found = false;
  return [filtered, found];
};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
export { calcResults, handleSubmit };
