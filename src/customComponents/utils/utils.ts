/* eslint-disable */
// Utility - by call order in app
// prettier-ignore
import { AbstractArray } from '@polkadot/types/codec/AbstractArray';
import { ReviewID } from 'chocolate/interfaces';
// construct promise wrapper around localstorage
const asyncCacheLocal = (key: string, value: string) =>
  Promise.resolve(localStorage.setItem(key, value));
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
  return `https://gateway.pinata.cloud/ipfs/${link}`
}



function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//  Thanks to: https://stackoverflow.com/a/39914235/16071410

// prettier-ignore
function get_browser() {
  if (typeof window === "undefined") {
    return "To-Do: Browser detection on server";
  }
  let ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
      tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
      }   
    if(M[1]==='Chrome'){
      tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
      }   
      M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
  }
//  Thanks to: https://stackoverflow.com/a/16938481/16071410

async function fetchData<Type>(
  url: string,
  setload?: Function,
  seterr?: Function
  ): Promise<Type | null> {
  const [response, error] = await errorHandled<Response>(fetch(url));

  if (response) {
    const data = (await response.json()) as Type;
    return data;
  }
  if (error) {
    setload && setload(false);
    seterr &&
      seterr({
        status: true,
        content: [error.message, error.stack, get_browser()],
      });
      return null;
  }
  return null;
}

async function errorHandled<type = Response>(
  prom: Promise<type>
  ): Promise<[type, null] | [null, Error]> {
  try {
    const response = await prom;
    
    if (response instanceof Response && !response.ok) {
      throw new Error(`Server said : ${response.status}! ${response.statusText}`);
    }

    return [response, null];
  } catch (error) {
    if(!(error instanceof Error)){return [null, new Error(`Unknown error ${JSON.stringify(error)}`)]}
    return [null, error];
  }
}

function sendTrace(trace: string, browser: string, ...extras: string[]) {
  console.error(trace);
  console.log(browser);
}
type errType = { status: boolean; content: string[] };
export { fetchData, sendTrace, sleep, errorHandled, toPinataFetch, sortReviewIDs as sortAnyNum , asyncCacheLocal,asyncGetLocal};
export type { errType };

