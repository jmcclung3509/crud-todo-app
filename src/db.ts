const mongoose = require('mongoose');

require('dotenv').config()

const URL=process.env.URL






const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(URL, connectionParams)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err: Error) => {
    console.error(`Error connecting to the database. \n${err}`);
  });


export const db = mongoose.connection;


