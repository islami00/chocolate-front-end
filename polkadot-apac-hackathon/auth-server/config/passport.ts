import passport from 'passport';
import type { IStrategyOptionsWithRequest, VerifyFunctionWithRequest } from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';
import validator from 'validator';
import { UserBaseDocument, UserPromise } from '../models/User';
const customFields: IStrategyOptionsWithRequest = {
  usernameField: 'uname',
  passwordField: 'ps',
  passReqToCallback: true,
};
const verifyCallBackLocal: VerifyFunctionWithRequest = (_, username, password, done) => {
  // find by uname
  // Replace later with substrate accountId as that will be our new primary key
  if (typeof password !== 'string') {
    return done(null, false, { message: 'Password is not a string' });
  }
  UserPromise.then(async _User=>{
    const user = await _User.findOne({ profile: { username } });
    if (!user) {
      // no error, no user, reject
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.passwordHash) {
      return done(null, false, {
        message: 'You signed up with web3, do retry with your address instead. Account management coming soon!',
      });
    }
    return user.validatePassword(password, done);
  }).catch(err => done(err));
  
};

// Export and do this in app.ts
export const configLocalStrategy = new LocalStrategy(customFields, verifyCallBackLocal);
passport.use(configLocalStrategy);

// passport ser types
declare global {
  namespace Express {
    interface User extends UserBaseDocument {}
  }
}
//ToDo Refactor to function and do this in app.ts
passport.serializeUser<string>((user, done) => {
  done(null, user.id);
});

// Refactor to function and do this in app.ts
passport.deserializeUser<string>((id, done) => {
  UserPromise.then(async _User =>{
    const user = await _User.findById(id);
    done(null, user);
  }).catch((err) => {
    done(err, false);
  });
});
