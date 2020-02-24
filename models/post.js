'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true
    },
    /*content: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true
    }, */
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    photo: {
      type: String,
      required: true
    },
    category: {
      enum: ['CSS', 'HTML', 'JavaScript', 'General']
    }
  }
  /* {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  } */
);

const Model = mongoose.model('Post', schema);

module.exports = Model;
