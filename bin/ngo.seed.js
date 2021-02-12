const mongoose = require('mongoose');
require('../db/index.js');
const Ngo = require('../models/Ngo.model.js');
const data = require('../data.js');

Ngo.insertMany(data)
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('The NGOs have not been upload');
  });
