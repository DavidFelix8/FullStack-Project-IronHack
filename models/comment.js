'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  timestamps: {
    createdAt: 'creationDate',
    updatedAt: 'updateDate'
  }
});

module.exports = mongoose.model('Comment', schema);
