# COuncil queries

1. Proposal Call

   1. Pass in the call without sign and send as arg

2. Proposal length bound. It also has useful methods for the docs

```JS
const x  = await api.query.council.proposalOf("0x5384d4099b9c6cbdddec5900df7b28ef85e9ba75fd6aa0cc47f5bb8246c2de96").then(v=>console.log(v.value.encodedLength))
```

3. Proposal weight: obtain from the following call:
4. Gotten from the following Initial query conversion:

```JS
api.query.council.proposalOf("0x5384d4099b9c6cbdddec5900df7b28ef85e9ba75fd6aa0cc47f5bb8246c2de96").then(v=>console.log(v.toHuman()))
```

use args, section and method like:

```JS
api.tx.[section].[method](...args).paymentInfo().then(v => v.toHuman())
```

This gives payment weight and partial fees.
A working example for my current proposal:

```JS

api.query.council.proposalOf("0x5384d4099b9c6cbdddec5900df7b28ef85e9ba75fd6aa0cc47f5bb8246c2de96").then(v=>{
let x = v.toHuman();
console.log(x); l = api.tx[x.section][x.method](...x.args).paymentInfo("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY").then(v2 => console.log(v2.toHuman()));
})
```

SO, with that...we know of the index, hash and lengthbound and weightBound of any proposal as we go. Those important details make up the proposal struct on my end.
