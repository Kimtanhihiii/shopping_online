const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = process.env.MONGODB_URI || MyConstants.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log(`Connected MongoDB: ${uri}`);
  })
  .catch((err) => console.error(err));
