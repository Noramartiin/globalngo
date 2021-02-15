const { Schema, model } = require('mongoose');

//USER SCHEMA
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//USER MODEL
const User = model('User', userSchema);

module.exports = User;
