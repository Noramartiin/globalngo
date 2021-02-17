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
  images: [
    {
      type: String,
      required: false,
    },
  ],

  url: String,
  key: {
    type: String,
    required: true,
    enum: ['environment', 'animals', 'health', 'education'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

//NGOs MODEL
const Ngo = model('Ngo', NgoSchema);

module.exports = Ngo;
