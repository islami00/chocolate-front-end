import cors from 'cors';
import express, { json, RequestHandler, urlencoded } from 'express';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';
import { envVarPromise } from './config';
// config should come before other modules because it calls dotenv.
/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
import './config/passport';
import { sessionStorePromise } from './config/sessionconfig';
import indexRouter from './routes/index';
import { errorHandled } from './utils/regUtils';

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
/*
 * express middles - logger is necessarry for development
 */
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://chocolate-demo.web.app',
      // Dynamically include dev list
      'https://8000-chocolatenetwor-chocolat-qnb1x5sione.ws-eu38.gitpod.io',
      'http://localhost:8000',
    ],
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

/**
 * -------------- SESSION SETUP ----------------
 */
const memo: Record<string, RequestHandler | null> = {
  middle: null,
};
app.use(async (req, res, next) => {
  // Dynamic session. Promise ensures we kick down err if env variables haven't been supplied. 
  // Earliest handler for env vars here.
  // https://stackoverflow.com/a/68669306/16071410
  const arrVars =  await errorHandled(envVarPromise);
  if(arrVars[1]) return next(arrVars[1]);
  const {sessionSecret} = arrVars[0];
  
  const arr = await errorHandled(sessionStorePromise);
  if (arr[1]) return next(arr[1]);
  const store = arr[0];
  
  // Replicate behaviour of app.use(session(config)) by memoising first return value.
  let middleWare;
  if (memo.middle) {
    middleWare = memo.middle;
  } else {
    middleWare = session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      store,
      // despite passport, we still manage our own cookies so we can set as needed.
      // secure by default
      cookie: {
        // specify samesite=false and secure for cross origin
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production', // set to true in production for https sec
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      },
    });
    memo.middle = middleWare;
  }
  middleWare(req, res, next);
});

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js as handlers for "/".
// Nesting can happen at the index router since this kicks control of "/" to it.
app.use(indexRouter);

export default app;
