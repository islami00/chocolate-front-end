/* eslint-disable @typescript-eslint/no-unused-vars */
import { PinServerRes } from '../../typeSystem/appTypes';
import { ReviewContent } from '../../typeSystem/jsonTypes';
import { errorHandled } from '../utils';

// for use with ipfs cat
// eslint-disable-next-line no-unused-vars
const ipfsConfig = {
  protocol: 'http',
  host: '127.0.0.1',
  port: 5001,
  apiPath: 'api/v0',
};

type GetCidReturns = { cid: string };
const getCid = async function (reviewText: string, rating: number): Promise<GetCidReturns> {
  const cacheable: ReviewContent = { reviewText, rating };
  const endpoint = `${process.env.REACT_APP_PIN_SERVER}/pin`;
  const headers = {
    method: 'POST',
    body: JSON.stringify(cacheable),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const [cid, err] = await errorHandled(fetch(endpoint, headers));
  if (err) throw err;
  const ccid = (await cid.json()) as PinServerRes;
  const returnable = ccid?.success;
  return { cid: returnable };
};
export { getCid };
