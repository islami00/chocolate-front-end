import React from 'react';
import '../../styles/loader.scss';

const Loading = function (props) {
  const { message, children } = props;
  return (
    <article className='load-wrap'>
      <img className='logo' src='https://avatars.githubusercontent.com/u/89528034?s=300&v=4' alt='chocolate logo' />
      <p className='loader'>{message}</p>
      {/* Manage following from account section of app */}
      {/* If done loading and no account, show account selector to set accnt from polka. */}
      {/* else, show reg */}
    </article>
  );
};

export { Loading };
