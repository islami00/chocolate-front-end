// put at the top to avoid race issues
import dotEnv from 'dotenv';
dotEnv.config();
// create db connection first
import { sessionConfig } from './config/sessionconfig';
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import session from 'express-session';
import indexRouter from './routes/index';
import sessionRouter from './routes/session-example';

// passport setup
import passport from 'passport';

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
/*
 * express middles - logger is necessarry for development
 */
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

/**
 * -------------- SESSION SETUP ----------------
 */

// TODO
// our session middleware, requires a store.
app.use(session(sessionConfig));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

import './config/passport';
app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js

app.use(indexRouter);
app.use(sessionRouter);
export default app;
