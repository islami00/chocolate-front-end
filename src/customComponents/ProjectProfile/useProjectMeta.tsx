import { ProjectAl } from 'chocolate/interfaces';
import { NewMetaData } from 'chocolate/typeSystem/jsonTypes';
import { useQuery, UseQueryResult } from 'react-query';
import { populateMetadata } from './majorUtils';

export default function useProjectMeta(
  project: ProjectAl,
  id: string
): UseQueryResult<NewMetaData, unknown> {
  const queryId = ['project', 'meta', id];
  // reuse useProject
  const { metaData } = project;

  return useQuery(queryId, () => populateMetadata(metaData.toJSON()));
}
