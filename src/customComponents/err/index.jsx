import React from 'react';
import { Message } from 'semantic-ui-react';
import './err.css';
/**
 *@type {React.FC<{this_error:any; four:boolean;}>}
 * @returns {JSX.Element}
 */
const Err = function (props) {
  const { this_error, four } = props;
  return (
    <section className='err-wrap'>
      <Message
        negative
        compact
        className='err'
        floating
        header={four ? 'Error 404!' : 'Error Connecting to Substrate'}
        content={`${JSON.stringify(this_error, null, 4)}`}
      />
    </section>
  );
};

export { Err };
