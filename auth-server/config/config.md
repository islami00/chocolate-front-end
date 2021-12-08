# Overview

This will have our passportjs strategies and their implementation uses the convenience methods described on the user which take the verify callback in and calls it with db related stuff.

# Hashing and crypto

So far our crypto and hashing will be done by node's crypto module, we eventually plan to use bcrypt or polkadot/utils-crypto

# Passport notes

```js
// on verify callback
const verifyCallback = (uname, password, done) => {};
// populated by passport-local from req body of login form. from username and password fields
// if not named username and password, setup custom names
// do your custom verification here. It is independent of the db or any other auth system
// all that matters is the done callback.
// you could even do nothing and just call done()
```

Note also: based on how we setup, this also calls user verify pass on db end.

# mongo notes

```js
/* connect.models.User is the same as connection.model('User'). This is loosely typed.
note: potential fail point if the model isn't on connection already
ref: https://mongoosejs.com/docs/api/connection.html#connection_Connection-models
*/
const connectedModelUser: UserModel = connection.models['User'];
// is practically same as:
const userModel = db.model('User', schema);

/// note also that the db.model is preferred over mongoose.model for localising models to connection
// using mongoose.model risks model not being on connection if it is not the default connection
```
