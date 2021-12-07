import mongoose from 'mongoose';
const dbString = process.env.DB_STRING ?? '';
// stability
const dbOptions: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// db connection
export const connection = mongoose.createConnection(dbString, dbOptions);
