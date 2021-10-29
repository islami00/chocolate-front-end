import { ProjectsView } from '../Projects';
import { useProjects } from '../ProjectsRe/hooks';

function Main(): JSX.Element {
  const { data, isFetched } = useProjects();
  return isFetched && <ProjectsView gallery data={data} />;
}
// show the initial search result idea.
// under name only have the chocolates instead of socials. Give hard coded rating for now. Worry about data later.
// then the usual to project

export default Main;
