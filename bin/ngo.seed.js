const mongoose = require('mongoose');
require('../db/index.js');
const Ngo = require('../models/Ngo.model.js');

Ngo.insertMany([{}, {}, {}, {}])
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('The NGOs have not been upload');
  });
