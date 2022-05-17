import cors from 'cors';
import express, { json, RequestHandler, urlencoded } from 'express';
import session from 'express-session';
import logger from 'morgan';
import passport from 'passport';
import mongoSanitize from 'express-mongo-sanitize';

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
// Cors
const isDev = process.env.NODE_ENV === 'dev-dotenv';
const corsList: string[] = [
  'https://chocolate-demo.web.app',
  'https://chocolate-web-app-nightly.web.app',
];
if (isDev) {
  corsList.push(...['http://localhost:8000', 'http://localhost:3000']);
  if (process.env.PUBLIC_HOST) corsList.push(process.env.PUBLIC_HOST);
}
/*
 * express middles - logger is necessarry for development
 */
app.use(
  // https://github.com/pillarjs/understanding-csrf
  cors({
    origin: corsList,
    credentials: true,
  })
);
// Config continue
app.use(logger('dev'));
// https://stackoverflow.com/questions/28710345/sanitize-user-input-in-mongoose
app.use(
  mongoSanitize({
    onSanitize: ({ key, req }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);
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
  const arrVars = await errorHandled(envVarPromise);
  if (arrVars[1]) return next(arrVars[1]);
  const { sessionSecret } = arrVars[0];

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
      cookie: {
        // strict means only same-origin. cors should protect post for json endpoints.
        sameSite: 'lax',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      },
    });
    memo.middle = middleWare;
  }
  middleWare(req, res, next);
});
// This has to be set so application knows it is behind a proxy such as in gitpod env. Not sure about google either -- review security.
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */
// Imports all of the routes from ./routes/index.js as handlers for "/".
// Nesting can happen at the index router since this kicks control of "/" to it.
app.use(indexRouter);

// Validator.
export default app;
