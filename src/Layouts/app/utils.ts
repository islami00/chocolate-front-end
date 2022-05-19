import toast from 'react-hot-toast';
import { QueryCache, QueryClient } from 'react-query';

const queryCache = new QueryCache({
  onError: (error: Error, query) => {
    // only show errors for refetches. So intial error should be handled locally.
    if (query.state.data !== undefined) {
      toast.error(`Something went wrong ${error.message}`);
    }
  },
});
export const rqClient = new QueryClient({ queryCache });
