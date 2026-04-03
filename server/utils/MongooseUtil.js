const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = process.env.MONGODB_URI || MyConstants.MONGODB_URI;
const dbName = process.env.DB_DATABASE || MyConstants.DB_DATABASE;

mongoose.connect(uri, { dbName })
  .then(() => {
    console.log(`Connected MongoDB database: ${dbName}`);
  })
  .catch((err) => console.error(err));
