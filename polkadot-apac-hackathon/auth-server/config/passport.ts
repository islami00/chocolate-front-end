import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { UserBaseDocument } from '../models/User';
import { connection } from './sessionconfig';
import type { IStrategyOptionsWithRequest, VerifyFunctionWithRequest } from 'passport-local';
import express from 'express';
import validator from 'validator';
const customFields: IStrategyOptionsWithRequest = {
  usernameField: 'uname',
  passwordField: 'ps',
  passReqToCallback: true,
};
const verifyCallBackLocal: VerifyFunctionWithRequest = (_, username, password, done) => {
  // find by uname
  // Replace later with substrate accountId as that will be our new primary key
  // To-do: add validate middleware for input before find
  if (typeof password !== 'string') {
    return done(null, false, { message: 'Password is not a string' });
  }
  const isAlpha = validator.isAlphanumeric(username);
  const isStrongPs = validator.isStrongPassword(password);
  User.findOne({ profile: { username } })
    .then((user) => {
      if (!user) {
        // no error, no user, reject
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.passwordHash) {
        return done(null, false, {
          message:
            'You signed up with web3, do retry with your address instead. Account management coming soon!',
        });
      }
      return user.validatePassword(password, done);
    })
    .catch((err) => {
      return done(err);
    });
};

const configLocalStrategy = new LocalStrategy(customFields, verifyCallBackLocal);
passport.use(configLocalStrategy);

// passport ser types
declare global {
  namespace Express {
    interface User extends UserBaseDocument {}
  }
}
passport.serializeUser<string>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser<string>((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, false);
    });
});
