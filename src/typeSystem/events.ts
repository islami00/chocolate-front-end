// this is an example response, for resolving events on api

const res1 = {
  phase: { ApplyExtrinsic: '1' },
  event: {
    method: 'Deposit',
    section: 'treasury',
    index: '0x0b06',
    data: ['100.0000 µCHOC'],
  },
  topics: [],
};
const res2 = {
  phase: { ApplyExtrinsic: '1' },
  event: {
    method: 'Deposit',
    section: 'treasury',
    index: '0x0b06',
    data: ['25.0000 µCHOC'],
  },
  topics: [],
};
const res3 = {
  phase: { ApplyExtrinsic: '1' },
  event: {
    method: 'ExtrinsicFailed',
    section: 'system',
    index: '0x0001',
    data: [
      { Module: { index: '8', error: '2' } },
      { weight: '350,010,000', class: 'Normal', paysFee: 'Yes' },
    ],
  },
  topics: [],
};

export { res1, res2, res3 };
