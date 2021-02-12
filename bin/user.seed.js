const mongoose = require('mongoose');
require('../db/index.js');
const Ngo = require('../models/User.model.js');

Ngo.insertMany([
  {
    name: 'Alvaro',
    password: 1234,
    email: 'a@a.a',
  },
  {
    name: 'Nora',
    password: 1234,
    email: 'n@n.n',
  },
])
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('The USERS have not been upload');
  });
