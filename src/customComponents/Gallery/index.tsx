// eslint-disable-next-line import/no-unresolved
import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectsView } from '../Projects';
import { useSearchData } from '../ProjectsRe/hooks';

function Main(): JSX.Element {
  const { api } = useSubstrate();
  const [data] = useSearchData(api);
  return <ProjectsView gallery data={data} />;
}

export default Main;
