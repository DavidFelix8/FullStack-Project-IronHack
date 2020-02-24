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
    photos: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    },
    category: {
      enum: ['CSS', 'HTML', 'JavaScript', 'General'],
      required: true
    }
  }
);

const Model = mongoose.model('Post', schema);

module.exports = Model;
