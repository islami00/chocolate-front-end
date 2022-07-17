import _ from 'lodash';
import { HumanNewProjectWithIndex } from '../../typeSystem/jsonTypes';

/** @description - Filters data by the search field and returns a copy for now, it returns the same data */
const calcResults = function (
  data: HumanNewProjectWithIndex[],
  value: string
): [HumanNewProjectWithIndex[], boolean] {
  const filtered = data.filter((each) => {
    // FIXME: Whitelist only username values. Err: "\" breaks regex.
    const escapedInput = _.escapeRegExp(`${value}`);
    const reg = new RegExp(`(${escapedInput})`, 'gi');
    const escaped = _.escapeRegExp(each.project.metadata.name);
    return reg.exec(escaped); /* returns null otherwise */
  });
  let found = true;
  if (filtered.length === 0) found = false;
  return [filtered, found];
};
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
};
export { calcResults, handleSubmit };
