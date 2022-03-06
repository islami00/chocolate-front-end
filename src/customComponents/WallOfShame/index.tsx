import { useSubstrate } from 'chocolate/substrate-lib';
import { ProjectsView } from '../Projects';
import { useSearchData } from '../ProjectsRe/hooks';

function WallOfShame(): JSX.Element {
  // Replace here too.
  const { api } = useSubstrate();
  const [data] = useSearchData(api);
  // Data is never undefined. Stable API.
  return <ProjectsView shame data={data} />;
}

export default WallOfShame;
