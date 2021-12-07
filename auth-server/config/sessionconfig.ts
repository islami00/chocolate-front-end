import session from 'express-session';
import connectMongo from 'connect-mongo';
import { connection } from './dbconfig';
// store init
const MongoStore = connectMongo(session);
// store config
export const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
// session config
export const sessionConfig: session.SessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
};
