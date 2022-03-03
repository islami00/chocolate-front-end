import { ApiPromise } from '@polkadot/api';
import { useQuery, UseQueryResult } from 'react-query';
import { StorageKey, Option } from '@polkadot/types';
import { ChainProject, NewProject, NewReview, TableSetReview } from '../../../typeSystem/jsonTypes';
import { Project, ProjectID, Review } from '../../../interfaces';
import { useSubstrate } from '../../../substrate-lib';
import { getPinataData, populateMetadata } from '../../../customComponents/ProjectProfile/majorUtils';

const getRelatedProjects = async (api: ApiPromise, reviews: Review[]) => {
  const ids = reviews.map((review) => Number(review.projectID));
  const projects = await api.query.chocolateModule.projects.entries<Option<Project>>();
  const unwrapped = projects.map(([id, project]): [StorageKey<[ProjectID]>, Project] => [
    id,
    project.unwrapOrDefault(),
  ]);
  // all good till here
  const filtered = unwrapped.filter(([id]) => ids.includes(Number(id.toHuman()[0])));

  return filtered;
};
const getRelatedProjectsMeta = async (
  api: ApiPromise,
  projects: [StorageKey<[ProjectID]>, Project][]
) => {
  const promises = projects.map(
    async ([storageKeyHold, project]): Promise<[number, NewProject]> => {
      const id = Number(storageKeyHold.toHuman()[0]);
      const chainPrj = project.toHuman() as unknown as ChainProject;
      const newMeta = await populateMetadata(chainPrj.metadata);
      const newPrj = { ...chainPrj, metadata: newMeta };
      const returnValue: [number, NewProject] = [id, newPrj];
      return returnValue;
    }
  );
  const related = await Promise.all(promises);
  return new Map(related);
};
const getReviews = async function (api: ApiPromise, web3Address: string) {
  const reviews = await api.query.chocolateModule.reviews.entries<Option<Review>>();
  const filtered = reviews
    .filter(([, review]) => review.unwrapOrDefault().userID.toJSON() === web3Address)
    .map(([, review]) => review.unwrapOrDefault());
  const returnable = await Promise.all(filtered);
  return returnable;
};
const ipfsEm = (reviews: Review[]) => {
  const ipfsed = reviews.map(getPinataData);
  return Promise.all(ipfsed);
};
/** In case this bugs you later: The genesis config places all reviewers on project not just subset */
export const useChainProjects = function (
  web3Address: string
): UseQueryResult<TableSetReview[], Error> {
  const { api } = useSubstrate();
  const queryKey = ['projects', web3Address];
  const projectsEm = async () => {
    const reviews = await getReviews(api, web3Address);
    const projects = await getRelatedProjects(api, reviews);
    const projectsMeta = await getRelatedProjectsMeta(api, projects);

    const ipfsed = await ipfsEm(reviews);
    const newReviews: (TableSetReview | undefined)[] = ipfsed.map((pinataData) => {
      const meta = projectsMeta.get(Number(pinataData.projectID));
      if (!meta) return;
      return { ...pinataData, project: meta };
    });
    const cleanReviews = newReviews.filter((each) => !!each);
    return cleanReviews;
  };
  return useQuery<TableSetReview[], Error>(queryKey, projectsEm, {
    retry: 2,
    staleTime: Infinity,
  });
};
