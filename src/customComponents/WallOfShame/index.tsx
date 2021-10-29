import { ProjectsView } from '../Projects';
import { useProjects } from '../ProjectsRe/hooks';

function WallOfShame(): JSX.Element {
  const { data, isFetched } = useProjects();
  return isFetched && <ProjectsView shame data={data} />;
}

export default WallOfShame;
