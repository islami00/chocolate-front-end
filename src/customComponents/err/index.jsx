import React from 'react';
import { Message } from 'semantic-ui-react';

import '../../styles/err.scss';
function Err(props) {
  const { this_error: err } = props;
  return (
    <section className='err-wrap'>
      <Message
        negative
        compact
        className='err'
        floating
        header='Error Connecting to Substrate'
        content={`${JSON.stringify(err, null, 4)}`}
      />
    </section>
  );
}

export { Err };
