/* eslint-disable */
// Utility - by call order in app
// prettier-ignore
import { isJsonObject } from '@polkadot/util';
import config from 'chocolate/config';
import { ReviewID } from 'chocolate/interfaces';
import { combineLimit } from './rateLimit';
// construct promise wrapper around localstorage
const asyncCacheLocal = (key: string, value: string) =>
  Promise.resolve().then(()=>localStorage.setItem(key, value));
const asyncGetLocal = (key: string) => {
  const prom = new Promise<string>((resolve, reject) => {
    const value = localStorage.getItem(key);
    if (value) {
      resolve(value);
    } else {
      reject(new Error('not found'));
    }
  });
  return prom;
};

const sortReviewIDs =  function(a:ReviewID,b:ReviewID){
      const sb  = a.sub(b);
      if (sb.isNeg()) return -1
      if(sb.isZero()) return 0
      return 1
}
const toPinataFetch = function(link:string){
  return `${config.IPFS_CAT_URL}/${link}`
}
/** Wrapper over fetch to provide one entry to fetching ipfs data from pinata to ease rate-limiting */
const pinataFetch = function(link: string){
  return fetch(toPinataFetch(link));
}
/** Rate-limited version of pinata fetch complying with pinata's rate-limit */
const limitedPinataFetch = combineLimit(pinataFetch,1000,3);


// Share this interface
/** 
 * The server can choose to send a json payload along with errors as they happen, the payload must follow this format to ensure the client can catch it 
 * Update to defined once all server routes are updated to send this format over.
 * ToDo: Create a custom error class that exposes these params via config.
 * */
export interface ApiErr{
  error?: string;
  code?: number;
}
/** 
 * Unwraps promise in mutex tuple
 * Error format(at least, for fetch() promises):  {error: "Server said : Status: ${status} StatusText: ${statusText} ErrorMessage: ${serverErrorMsg}"}. 
 * Expanded in ApiErr.
 **/
async function errorHandled<type = Response>(
  prom: Promise<type>
  ): Promise<[type, null] | [null, Error]> {
  try {
    const response = await prom;
    
    if (response instanceof Response && !response.ok) {
      let bod = await response.text();
      const defaultMsg: ApiErr =  {error: `StatusText: ${response.statusText} message: ${bod}`, code:response.status};
      // See if any json. Append code if so, along with json.
      if(isJsonObject(bod)) {
        const json  = JSON.parse(bod) as ApiErr;
        json.code =  response.status;
        bod = JSON.stringify(json);
        throw new Error(bod); 
      }
      else throw new Error(JSON.stringify(defaultMsg));
      
    }
    return [response, null];
  } catch (error) {
    const unknownErr: ApiErr = {error:`An Unknown error occurred ${JSON.stringify(error)}` }
    if(!(error instanceof Error)) return [null, new Error(JSON.stringify(unknownErr))];
    let err =  error;
    if(!isJsonObject(error.message)) err =  new Error(JSON.stringify({error: JSON.stringify(err.message)}));
    return [null, err];
  }
}


type errType = { status: boolean; content: string[] };
export { errorHandled, toPinataFetch, sortReviewIDs as sortAnyNum, asyncCacheLocal, asyncGetLocal, limitedPinataFetch };
export type { errType };

