// eslint-disable-next-line import/no-unresolved
import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectsView } from '../Projects';
import { useSearchData } from '../ProjectsRe/hooks';

function WallOfShame(): JSX.Element {
  const { api } = useSubstrate();
  const [data] = useSearchData(api);
  return <ProjectsView shame data={data} />;
}

export default WallOfShame;
