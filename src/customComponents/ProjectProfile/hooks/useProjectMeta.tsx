import { useQuery, UseQueryResult } from 'react-query';
import { ProjectAl } from '../../../interfaces';
import { NewMetaData } from '../../../typeSystem/jsonTypes';
import { populateMetadata } from '../majorUtils';

export default function useProjectMeta(
  project: ProjectAl,
  id: string
): UseQueryResult<NewMetaData, unknown> {
  const queryId = ['project', 'meta', id];
  // reuse useProject
  const { metaData } = project;

  return useQuery(queryId, () => populateMetadata(metaData.toJSON()), {
    retry: 2,
    staleTime: Infinity,
  });
}
