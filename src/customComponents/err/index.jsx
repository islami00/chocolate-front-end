import React from 'react';
import { Message } from 'semantic-ui-react';
import '../../styles/err.scss';
/**
 *@type {React.FC<{this_error:any; four:boolean;}>}
 */
const Err = function (props) {
  const { this_error: err , four} = props;
  return (
    <section className='err-wrap'>
      <Message
        negative
        compact
        className='err'
        floating
        header={four ? 'Error 404!' : 'Error Connecting to Substrate'}
        content={`${JSON.stringify(err, null, 4)}`}
      />
    </section>
  );
};

export { Err };
