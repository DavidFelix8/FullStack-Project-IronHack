'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 50
    },
    /*content: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true
    }, */
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    photos: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    },
    //adicionar restantes
    category: {
      enum: ['CSS', 'HTML', 'JavaScript']
    }
  }
);

const Model = mongoose.model('Post', schema);

module.exports = Model;
