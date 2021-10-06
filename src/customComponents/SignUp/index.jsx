import React, { useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button, Container, Dropdown } from 'semantic-ui-react';
import { storageKey } from '../loading';
import { AppState } from '../state';

const Main = () => {
  const [drop, setDrop] = useState('unset');
  //   initial decision
  /** @type {[string,AppState["userData"]["accountType"]][]} */
  const optt = [
    ['Write reviews', 'user'],
    ['Add my project to the chocolate metaverse', 'project'],
  ];

  const setStore = val => {
    window.localStorage.setItem(storageKey, val);
  };
  // convert options to dropdown props
  const opts = optt.map(each => ({
    key: each[0],
    text: each[0],
    value: each[1],
  }));

  /** @type {{id:AppState["userData"]["accountType"];}} */
  const { id } = useParams();
  console.log(id);

  /**
   * @description redirects for possible preserved options taken by users on clicking confirm button.
  *  @description This is done based on the value of the drop prop. which is set on default case.
   * @description As of now, the route being worked on is general -> user route redirect to projects page
   *  */
  let content;
  switch (id) {
    case 'unset':
      content = <Redirect exact to='/sign-up' />;
      break;
    case 'user':
      content = <Redirect exact to='/projects' />;
      break;
    default:
      // base page. id:'unset'
      content = (
        <>
          <h1>Sign Up</h1>
          <label htmlFor='drop'>What would you like to do on chocolate?</label>
          <Dropdown
            fluid
            placeholder='Choose one of the options'
            onChange={(_, data) => setDrop(data.value.toString())}
            selection
            options={opts}
          />
          <Link to={`/sign-up/${drop}`} onClick={setStore}>
            <Button fluid color='blue'>
              Confirm
            </Button>
          </Link>
        </>
      );
      break;
  }
  // default
  return <Container textAlign='left'>{content}</Container>;
};

export default Main;
