/* eslint-disable import/no-unresolved */
// type imports
import { KeyringPair } from '@polkadot/keyring/types';
import Identicon from '@polkadot/react-identicon';
import { Option, StorageKey } from '@polkadot/types';
import { ProjectAl, ProjectID } from 'chocolate/interfaces';
// styles
import 'chocolate/styles/projects.scss';
// default imports
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// icons
import { Button, Icon } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
import { Chocolate, ProjectWithIndex } from '../../typeSystem/jsonTypes';
/* eslint-enable import/no-unresolved */
/** @param {string} name */
const cleanName = function (name) {
  const re = /[A-Z]/;
  const foundAt = name.search(re);
  return name.slice(foundAt);
};
/**
 * @description Cleans the utf-8 bytes on the project and founder socials
 * by removing anything before founder, or before any word before Inc/_Stash
 * Note: The object passed is mutated directly
 * @param {Partial<Chocolate["Social"]>} soc */
const MutateSocials = function (soc) {
  const cleanReg = /([\s\S](?=founder))|([^A-Za-z_](?!(gmail|com)))|([\s\S]+?(?=[A-Z][a-z]+)(?!(Inc|Stash)))/g;
  const keys = Object.keys(soc);
  for (let i = 0; i < keys.length; i += 1) {
    const element = keys[i];
    const social = soc[element];
    soc[element] = social.replaceAll(cleanReg, '');
  }
  return soc;
};
/**
 * OwnerID shoould be changed to projectAddress in input
 * @description gets the projects and filters them by not proposed, and adds exta data e.g subscan links and also dispatches state update
 * @param {Promise<[StorageKey<[ProjectID]>, Option<ProjectAl>][]>} projects
 * @returns {Promise<ProjectWithIndex[]>}
 */
const getProjects = async function (projects) {
  // projects are properly passed here
  const usable = await projects;

  const mutatedProjects = usable?.map(each => {
    const [id, project] = each;

    // @ts-expect-error AnyJson is an array type in this case.
    const [[rawId], rawProject] = [id.toHuman(), project.unwrapOrDefault()];

    if (rawProject.isEmpty || !rawProject.proposalStatus.status.isAccepted) {
      console.log('run', [rawProject.toHuman()]);
      return null;
    }
    const Id = rawId;
    /** @type {Chocolate["Project"]} */
    // @ts-expect-error
    const secondReturnable = rawProject.toHuman();
    console.log('returned', secondReturnable);
    // mutate socials and project names
    const {
      metaData: { projectName },
    } = secondReturnable;
    secondReturnable.metaData.founderSocials.forEach(MutateSocials);
    secondReturnable.metaData.projectSocials.forEach(MutateSocials);

    secondReturnable.metaData.projectName = cleanName(projectName).replaceAll('_', ' ');
    const ret = { Id, project: secondReturnable };
    return ret;
  });
  const cleanProjects = mutatedProjects.filter(each => each !== null && each !== undefined);
  return cleanProjects;
};
/**
 * @description  Generates mock projects from keyring, leaving one account for purviewing
 * @param {KeyringPair[]} pairs
 */
const getMockProjects = async function (pairs) {
  // 2 accepted projects, two verified projects, one rejected project.
  const projects = pairs.map((each, index, arr) => {
    if (index === arr.length - 1) return;
    const projectName = `${each.meta.name}_Inc`;
    const founderName = projectName.split('_')[0];
    const theProperlyFormattedName = projectName.split('_').join(' ');
    const theName = projectName.replace('_', '').replace(' ', '_');
    const Id = index;
    /** @type {ProjectWithIndex} */
    const returnable = {
      Id,
      // @ts-expect-error Intentionally ignoreing proposal status for now as it is unneeded
      project: {
        ownerID: each.address,
        metaData: {
          projectName: theProperlyFormattedName,
          projectSocials: [{ Twitter: theName }, { Email: `${theName}@gmail.com` }, { Instagram: theName }],
          founderSocials: [{ Twitter: founderName }, { Email: `${founderName}@gmail.com` }, { Instagram: founderName }],
        },
      },
    };
    return returnable;
  });
  const cleanProjects = projects.filter(each => each !== undefined);
  return cleanProjects;
};

/**
 * @description Houses a single project
 * @type {React.FC<{data: ProjectWithIndex}>} - Give proper types later
 * @returns
 */
const ProjectView = function (props) {
  const { data } = props;
  const { Id, project } = data;
  const { ownerID, metaData } = project;
  const { projectSocials, projectName: name } = metaData;

  const icons = projectSocials.map(social => {
    const serialized = Object.entries(social);
    const each = serialized[0];
    /** @type {Lowercase<keyof social>} */
    // @ts-expect-error
    const kind = each[0].toLowerCase();
    /** @type {'mail' | 'SiRiotgames' | 'dont' |'instagram' |  `${"facebook" | "twitter"} square`} */
    let iconText = 'dont';
    switch (kind) {
      case 'email':
        iconText = 'mail';
        break;
      case 'riot':
        iconText = 'SiRiotgames';
        return;
      case 'instagram':
        iconText = 'instagram';
        break;
      case 'none':
        return;
      default:
        break;
    }
    if (kind === 'facebook' || kind === 'twitter') iconText = `${kind} square`;
    const link = kind !== 'email' ? `https://www.${kind}.com/${each[1]}_delores` : undefined;
    // extend this with mine or switch to react-icons for more support
    if (iconText === 'dont') {
      console.warn(`Icon ${kind} not supported`);
    }
    return (
      <a className='this-icon' key={`${kind}_${link}_${ownerID}`} href={link} target='_blank' rel='noreferrer'>
        <Icon name={iconText} mailto={!link ? each[1] : undefined} size='large' />
      </a>
    );
  });
  return (
    <section className='project'>
      <Identicon key={`substrate_icon_${ownerID}`} value={ownerID.toString()} size={48} theme='substrate' />
      <div className='description'>
        <h2>{name}</h2>
        <Icon.Group>{icons}</Icon.Group>
      </div>

      <Button as={Link} to={`/app/projects/${Id}`} color='brown' icon labelPosition='right' size='medium' role='link'>
        To Project
        <Icon name='arrow right' />
      </Button>
    </section>
  );
};

/**
 * @description Houses the projects
 * @type  {React.FC<{data : ProjectWithIndex[]}>}
 */
const ProjectsView = function (props) {
  const { data } = props;
  // make sure to edit as we expand for overflow
  data.sort((a, b) => Number(a.Id) - Number(b.Id));
  const render = data.map(project => <ProjectView data={project} key={project.Id.toString()} />);
  return <article>{render}</article>;
};
function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectStat, setProjectStat] = useState('');
  const { api, keyring } = useSubstrate();
  // get the projects for search page
  useEffect(() => {
    // prevent race conditions by only updating state when component is mounted
    let isMounted = true;
    async function run() {
      const ret = await getProjects(api.query.chocolateModule.projects.entries());
      const ret2 = await getMockProjects(keyring.getPairs());
      const set = !ret.length ? ret2 : ret;
      if (isMounted) {
        setProjects(set);
        setProjectStat('set');
      }
    }

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  if (projectStat !== 'set') return <h1>Projects page</h1>;
  return <ProjectsView data={projects} />;
}

export default Projects;
