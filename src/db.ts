const mongoose = require('mongoose');
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.MONGO_URI;



const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(URL, connectionParams)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err: Error) => {
    console.error(`Error connecting to the database. \n${err}`);
  });


export const db = mongoose.connection;

