const { Schema, model } = require('mongoose');

//USER SCHEMA
const userSchema = new Schema({
  username: {
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
  },
  ngo: {
    type: Schema.Types.ObjectId,
    ref: 'Ngo',
  },
});

//USER MODEL
const User = model('User', userSchema);

module.exports = User;
