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

# On deploying to gcp.

1. Create a project, preferrably one initialised by firebase.
2. Next, create an app engine app.
3. Next, create a service account and grant it IAM permission:  `App Engine Deploy` and related ones based on this [link](https://cloud.google.com/appengine/docs/standard/python/roles). You'll also need to grant it `App Engine Service Admin` for new versions to have all traffic routed to them. 
> NOTE: This also allows the service account to change number of instances and scaling settings.
4. Next, create the secrets required. `DB_STRING` and `SESSION_SECRET` in this case.
6. Next, grant the app engine default service account access to these secrets (At least, remember to if you can't find the service account). This avoids going back and forth at the IAM console instead of the `secret manager`. Give it the `SECRET MANAGER SECRET ACCESSOR` role for each secret on its page.
7. Next, deploy a default version of your app (This can simply have app.yaml in an empty dir) so you can deploy db.
> You can also use this opportunity to test out the service account key before automating by logging in using the exported json.
6. Next, deploy the db version of your app using the gcloud script here.
7. After deploying, everything should be fine now. Double check the app has access to secrets by making a request to it.

For some reason, I had to enable cloud build for this. Not so sure how valid this is though. Same went for the default project. so I guess it's necessary for app engine.