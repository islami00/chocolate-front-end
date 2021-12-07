// put at the top to avoid race issues
import dotEnv from 'dotenv';
dotEnv.config();
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import session from 'express-session';
import indexRouter from './routes/index';
import { sessionConfig } from './config/sessionconfig';

const app = express();
// mongo settings
// express middles - logger is necessarry for development
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

// our session middleware, requires a store.
app.use(session(sessionConfig));
app.use('/', indexRouter);

export default app;
