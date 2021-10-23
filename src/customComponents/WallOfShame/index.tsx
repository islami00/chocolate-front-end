import React from 'react';
import { ProjectsView } from '../Projects';
import { useProjects } from '../ProjectsRe/hooks';

function WallOfShame() {
  const { data, isFetched } = useProjects();
  return isFetched && <ProjectsView shame data={data} />;
}

export default WallOfShame;
