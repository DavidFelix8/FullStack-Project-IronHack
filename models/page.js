'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  category: {
    //type: String,
    //trim: true,
    //required: true,
    //maxlength: 20,
    enum: ['CSS', 'HTML', 'JavaScript', 'General']
  }
});

module.exports = mongoose.model('Page', schema);
