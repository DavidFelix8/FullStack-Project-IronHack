'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  content: {
    type: String,
    maxlength: 500,
    trim: true
  },
  photo: {
    type: String
  },
  passwordHash: {
    type: String,
    required: true
  },
  googleId: {
    type: String
  },
  googleUsername: {
    type: String
  }
});

module.exports = mongoose.model('User', schema);
