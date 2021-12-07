// put at the top to avoid race issues
import dotEnv from 'dotenv';
dotEnv.config();
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import session from 'express-session';
import indexRouter from './routes/index';
import sessionRouter from './routes/session-example';
/**
 * General setup - Settings for mongodb and express-session.
 */
import { sessionConfig } from './config/sessionconfig';

const app = express();
/*
 * express middles - logger is necessarry for development
 */
app.use(logger('dev'));
app.use(json()); // EXPRESS JSON() IS THE DEFACTO NOW , NO BODY PARSER
app.use(urlencoded({ extended: false }));

// our session middleware, requires a store.
app.use(session(sessionConfig));
// passport setup

/**
 * Routes
 */
// always return something from res else 404
app.use('/', indexRouter);
app.get('/session-example', sessionRouter);
// might wANT TO ADD ERROR HANDLER AFTER ROUTeS
export default app;
