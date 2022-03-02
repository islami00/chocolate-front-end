import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
// mongo settings for db and connection
import {dbString,sessionSecret, wait} from '.';

const dbOptions: mongoose.ConnectionOptions = {
  // he said: suppress warning
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// db connection
export const connectionPromise = Promise.resolve().then(function(x){
  // Wait off the main thread.
  wait();
  if(dbString && sessionSecret) {
    const _connection = mongoose.createConnection(dbString,dbOptions);
    return _connection;
  }
  else return Promise.reject(new Error("No db string and implicitly other env vars"));
});


export const sessionStorePromise =  connectionPromise.then((_connection)=>{
  const MongoStore = connectMongo(session);
  const store = new MongoStore({
    mongooseConnection: _connection,
    collection: 'sessions',
  });

  return store
})