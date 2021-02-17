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
  profileImg: {
    type: String,
    default: "https://www.madd.org/wp-content/uploads/2019/02/blank-profile-picture-973460_640.png",
  },
});

//USER MODEL
const User = model('User', userSchema);

module.exports = User;
