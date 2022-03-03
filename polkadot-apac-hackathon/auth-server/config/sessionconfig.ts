import connectMongo from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
// mongo settings for db and connection
import { envVarPromise } from '.';

const dbOptions: mongoose.ConnectionOptions = {
  // he said: suppress warning
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// db connection. Err handling for connection string is done higher up the chain
export const connectionPromise = envVarPromise.then(function ({ dbString }) {
  const _connection = mongoose.createConnection(dbString, dbOptions);
  return _connection;
});

export const sessionStorePromise = connectionPromise.then((_connection) => {
  const MongoStore = connectMongo(session);
  const store = new MongoStore({
    mongooseConnection: _connection,
    collection: 'sessions',
  });
  return store;
});
