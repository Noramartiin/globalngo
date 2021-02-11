const { Schema, model } = require('mongoose');

//NGOs SCHEMA
const NgoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  information: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  url: String,
  key: {
    type: String,
    required: true,
    enum: ['environment', 'animals', 'health', 'education'],
  },
});

//NGOs MODEL
const Ngo = model('Ngo', NgoSchema);

module.exports = Ngo;
