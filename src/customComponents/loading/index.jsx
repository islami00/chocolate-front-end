import React from 'react';
import './loader.css';

const storageKey = 'ChocAccountType';

/** @type {React.FC<{message:string; img?:string; greet?:boolean;}>} */
const Loading = function (props) {
  const { message, img } = props;

  return (
    <article className='load-wrap'>
      <img className='logo' src={img || '#'} alt={`${img && 'chocolate logo'} `} />
      <p className='loader'>{message}</p>
    </article>
  );
};

export { Loading, storageKey };
