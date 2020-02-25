'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['CSS', 'HTML', 'JavaScript', 'General']
  }
});

module.exports = mongoose.model('Page', schema);
