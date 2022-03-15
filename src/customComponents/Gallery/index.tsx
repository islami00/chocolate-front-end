// eslint-disable-next-line import/no-unresolved
import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectsView } from '../Projects';
import { useSearchData } from '../ProjectsRe/hooks';

function Main(): JSX.Element {
  // Replace here too.
  const { api } = useSubstrate();
  const [data] = useSearchData(api);
  // Data is never undefined. Stable API.
  return <ProjectsView gallery data={data} />;
}
// show the initial search result idea.
// under name only have the chocolates instead of socials. Give hard coded rating for now. Worry about data later.
// then the usual to project

export default Main;
