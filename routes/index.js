'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Post = require('./../models/post');
const Page = require('./../models/page');

router.get('/', (req, res, next) => {
  let pages;

  Page.find()
    .limit(10)
    .then(documents => {
      pages = documents;
      return Post.find()
        .populate('page author')
        .limit(20);
    })
    .then(posts => {
      res.render('index', { posts, popularPages: pages });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
