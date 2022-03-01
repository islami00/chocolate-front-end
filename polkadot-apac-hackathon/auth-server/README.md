# Overview

This is an adhoc server for authenticating users on chocolate

It is an api backed by express and passportjs.
The transport layer is rest as opposed to graphql with types.

Although it is written in typescript, for ease of use, the code can be built to js with the build command and `checkJs` turned off in [`tsconfig.json`](./tsconfig.json). Then further writing can commence.

# Implementor's guide.

Taking a page from Invarch's no-email policy, this first phase will only enable two means of authentication:

1. Username password,
2. web3 address.

of course, both ways require a primary web3 address be associated with the account.

Taking things step by step:

- For the first, `passport-local` strategy can be employed, collecting username, password and primary web3 address on signup (this can be obtained with the account selector component).

For understanding [passport](https://www.youtube.com/watch?v=F-sFp_AvHc8).

- For the second, we'd need to employ jwt auth in the same way as [this](https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial), secured like [this](https://www.youtube.com/watch?v=iD49_NIQ-R4) describes. From [this](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/) article.
  On second thought, we could actually use jwts for both.

**Note:** Graphql queries and mutations can be mapped to rest endpoints for ease.

- Once this is setup, custom responses for `req.redirect()` and co. for the client should be setup as showcased [here](https://stackoverflow.com/a/43213567/16071410). Routing can be done manually on the client via [`react-router`](https://github.com/remix-run/react-router/tree/main/examples/auth).

Further relations should be setup on the db for likes and co. due to the immutability of ipfs.

- Also, the endpoint for getting cid should be moved from the firebase cloud function to this server.
  For ease of development, a single response can be stored locally from pinata and sent on request from the client as development moves to the client side.

With that, the server should be ready for use.

# Notes on implemented parts

Only the username/password signup/signin were implemented on the api, and csrf policies require a https connection for polling the server from the ui.
hence why the effects of login are not seen in the video.
Same goes for the gallery page whose designs were completed and showcased although data hasn't been wired up to it.
The build folder is included.

## Further resources and notes:

1. Reference implementation 1 - [Hackathon starter](https://github.com/sahat/hackathon-starter)
2. Reference implementation 2 - [polkassembly](https://github.com/Premiurly/polkassembly/tree/master/auth-server)
3. [@polkadot/util-crypto](https://www.npmjs.com/package/@polkadot/util-crypto/v/7.1.1) - web3 address verification for substrate/polkadot, hash fx and the like. Preferrably the version should match that on the client package.json.
4. [@polkadot/util](https://www.npmjs.com/package/@polkadot/util/v/7.1.1) - probably necessary for utils-crypto
   Note also: `bcrypt.js` could be an alternative to node crypto library for password hashing and salting

### Dev setup

Given that this is purely an api without a direct view, postman or similar software should be sufficient for testing and make sure to setup mongodb for the database

# Notes on user experience.

1. Reset password and account operations
   Proof of ownership for these operations can be done on the fly by requesting signature and sending.

## Long term notes:

Now, for concerns of spam and human verification, a flips-backed human authentication api will eventually act as a check of humanity to avoid spamming the system.

This still doesn't stop users from signing up with multiple web3 addresses and usernames - the primary key on db being the username in this case (subject to change to web3address to align with routes). But ultimately, that has no gain to the user as that cannot be automated due to flips human verification, and they'll probably lose some token on initial review as no reward is given for level0.

Also, such users can be flagged with regular bot detection and blacklisted on the server here.

We can also provide a dust collection policy for storage attacks that states if a user's account has been reaped from the chain for an extended period, their profile should be revoked.

A note also on contacting users. Some additional metadata could be collected e.g twitter, discord, or even gathered from the respective chain via an input tagged "what blockchains have you previously interacted with on this account?" leveraging preexisting identity.

- We could also simply have notifications pop up as the users need, dashboard and all.

The web3 authentication could be extended to substrate with jwts, providing security of the platform both on the site and with blockchain transactions.

## Migrating to app engine

[Multiple services: many app.yamls](https://stackoverflow.com/questions/46036320/deploy-multiple-applications-from-same-project)

Note: Firebase was not considered as a deployment option. This could be the case eventually. In that case, consult [functions/index.ts](../../functions/src/index.ts) and [functions/config.ts](../../functions/src/config.ts)