'use strict';

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    // required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  content: {
    type: String,
    maxlength: 500,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true
  },
  photo: {
    type: String,
    default: '/images/no-pic.png'
  },
  passwordHash: {
    type: String
    // required: true
  },
  googleId: {
    type: String
  },
  googleUsername: {
    type: String
  }
});

schema.plugin(findOrCreate);

const User = mongoose.model('User', schema);

module.exports = User;
