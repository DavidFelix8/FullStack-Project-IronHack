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
  const postsWithLikes = [];
  Post.find(searchQuery)
    .lean()
    .sort({ createdAt: -1 })
    .populate('author')
    .then(posts => {
      const postIds = posts.map(post => post._id);

      Like.find({ postId: postIds })
        .then(likes => {
          for (let singlePost of posts) {
            const likesOfPost = likes.filter(
              like => like.postId.toString() === singlePost._id.toString()
            );
            const likeCount = likesOfPost.length;
            singlePost.numLikes = likeCount;
            postsWithLikes.push(singlePost);
          }
          const data = {
            editedPosts: postsWithLikes
          };
          res.render('index', data);
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => next(error));
});

module.exports = router;
