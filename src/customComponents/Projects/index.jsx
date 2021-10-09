import { AnyJson } from '@polkadot/types/types';
import React from 'react';
import { TableProps } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
/**
 * @description gets the projects and filters them by not proposed, and adds exta data e.g subquery links and also dispatches state update
 * @return {[Record<string, AnyJson>]}
 */
const useProjects = function () {
  const { api } = useSubstrate();
  const projects = api.query.chocolateModule.projects
    .entries()
    .then(result => result?.map(eachKVPair => console.log({ eachKVPair })));
  console.log({ projects });
  // add types for users module
};
/**
 * @description converts the resulting projects to what the table needs
 * @param {[Record<string, AnyJson>]} projects
 * @return {TableProps}
 */
const toTableProps = function (projects) {};
function Projects() {
  // searchable table
  const projects = useProjects();
  const tableProps = toTableProps(projects);
  return (
    <div>
      <h1>Projects page</h1>
    </div>
  );
}

export default Projects;
