'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Like = require('./../models/like');

router.get('/', (req, res, next) => {
  const selectedCategory = req.query.category;
  let searchQuery = {};
  if (selectedCategory === 'General' || !selectedCategory) {
    searchQuery = {};
  } else {
    searchQuery = { category: selectedCategory };
  }
  let postsWithLikes = [];
  Post.find(searchQuery)
    .lean()
    .sort({ createdAt: -1 })
    .populate('author')
    .then(posts => {
      posts.map(singlePost => {
        Like.find({ postId: singlePost._id })
          .then(likes => {
            singlePost.numLikes = likes.length;
            postsWithLikes.push(singlePost);
          })
          .catch(error => {
            next(error);
          });
      });
      const data = {
        editedPosts: postsWithLikes
      };
      res.render('index', data);
    })
    .catch(error => next(error));
});

module.exports = router;
