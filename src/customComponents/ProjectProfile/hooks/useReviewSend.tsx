import { AddressOrPair } from '@polkadot/api/types';
import { useState } from 'react';
import { useSubstrate } from '../../../substrate-lib';

type RevSend = (txData: { id: string; cid: string }, account: AddressOrPair) => { data: string };
/** Send the actual review to chain along with cid */
const useReviewSend: RevSend = function (txData, account) {
  const { id, cid } = txData;
  const { api } = useSubstrate();
  const [fee, setFee] = useState('..loading fee..');
  const getPaymentInfo = async function () {
    const paymentInfo = await api.tx.chocolateModule.createReview(cid, id).paymentInfo(account);
    const retFee = paymentInfo.partialFee.toHuman();
    setFee(retFee);
  };
  if (account) getPaymentInfo().catch(console.error);
  return { data: fee };
};
export { useReviewSend };
