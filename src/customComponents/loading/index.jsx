import React, { useEffect } from 'react';
import '../../styles/loader.scss';
import { useApp } from '../state';

const storageKey = 'ChocAccountType';
/** @param {"unset"} def */
const fetchStore = function (def) {
  const needed = window.localStorage.getItem(storageKey);
  if (needed && (needed === 'user' || needed === 'project')) return needed;
  window.localStorage.setItem(storageKey, def);
  return def;
};
/** @type {React.FC<{message:string; img?:string; greet?:boolean;}>} */
const Loading = function (props) {
  const { message, img, greet } = props;
  const { dispatch } = useApp();
  useEffect(() => {
    if (greet) {
      const authDeets = fetchStore('unset');
      dispatch({ type: 'USER_DATA', payload: { accountType: authDeets } });
    }
  }, [greet]);

  return (
    <article className='load-wrap'>
      <img className='logo' src={img || '#'} alt={`${img && 'chocolate logo'} `} />
      <p className='loader'>{message}</p>
      {/* Manage following from account section of app */}
      {/* If done loading and no account, show account selector to set accnt from polka. */}
      {/* else, show reg */}
    </article>
  );
};

export { Loading, storageKey };
