const mongoose = require('mongoose');
require('../db/index.js');
const Ngo = require('../models/User.model.js');

Ngo.insertMany([{}, {}])
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('The USERS have not been upload');
  });
