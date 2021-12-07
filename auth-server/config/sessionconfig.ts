import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
// mongo settings for db and connection
const dbString = process.env.DB_STRING ?? '';
const dbOptions: mongoose.ConnectionOptions = {
  // he said: suppress warning
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// db connection
export const connection = mongoose.createConnection(dbString, dbOptions);

// store init
const MongoStore = connectMongo(session);
// store config
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
// session config
const sessionSecret = process.env.DB_SECRET ?? '';
export const sessionConfig: session.SessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: false, // set to true in production for https sec
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
};
