'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');

router.get('/', (req, res, next) => {
  const selectedCategory = req.query.category;
  let searchQuery = {};
  if (selectedCategory === 'General' || !selectedCategory) {
    searchQuery = {};
  } else {
    searchQuery = { category: selectedCategory };
  }
  //console.log(searchQuery);
  Post.find(searchQuery)
    .sort({ createdAt: -1 })
    .populate('author')
    .then(posts => {
      //console.log(posts);
      res.render('index', { posts });
    })
    .catch(error => next(error));
});

module.exports = router;
