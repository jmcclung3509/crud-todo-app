const dotenv = require('dotenv');
dotenv.config({ path:  '/.env' });

const connection_string = process.env.MONGO_URI;

const mongoose = require('mongoose'); 

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err: Error) => {
    console.error(`Error connecting to the database. \n${err}`);
  });


export const db = mongoose.connection;

