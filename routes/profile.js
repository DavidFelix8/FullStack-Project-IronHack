'use strict';

const { Router } = require('express');
const router = new Router();

const User = require('./../models/user');
const Post = require('./../models/post');
const uploader = require('../middleware/upload-photo');
const routeGuard = require('./../middleware/route-guard');

//Profile Edit Photo
router.get('/:userId/edit', routeGuard(true), (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId).then(user => {
    res.render('edit-profile', user);
  });
});

router.post('/:userId/edit', routeGuard(true), uploader.single('photo'), (req, res, next) => {
  const userId = req.params.userId;
  const url = req.file ? req.file.url : req.user.photo;

  const { name, email, description } = req.body;
  console.log(description);

  User.findByIdAndUpdate(userId, {
    name,
    email,
    description,
    photo: url
  })
    .then(data => {
      //console.log('new', data);
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  let user;

  User.findById(userId)
    .then(document => {
      user = document;
      if (document) {
        return Post.find({ author: userId }).populate('author');
      } else {
        next(new Error('USER_NOT_FOUND'));
      }
    })
    .then(posts => {
      const isOwnProfile = req.user && req.user._id.toString() === user._id.toString();
      res.render('author', { author: user, posts, isOwnProfile });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
