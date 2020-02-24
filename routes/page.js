/*'use strict';

const { Router } = require('express');
const router = new Router();

const Page = require('./../models/page');
const Post = require('./../models/post');
const Comment = require('./../models/comment');

const routeGuard = require('../middleware/route-guard');

router.get('/create', routeGuard(true), (req, res, next) => {
  res.render('page/create');
});

router.post('/create', routeGuard(true), (req, res, next) => {
  const { name } = req.body;
  Page.create({
    name
  })
    .then(page => {
      res.redirect(`/page/${page._id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:pageId', (req, res, next) => {
  // const { channelId } = req.params;
  const pageId = req.params.pageId;

  let page;

  Page.findById(pageId)
    .then(document => {
      if (!document) {
        next(new Error('NOT_FOUND'));
      } else {
        page = document;
        return Post.find({ page: pageId })
          .populate('page author')
          .limit(50);
      }
    })
    .then(posts => {
      res.render('page/single', { page, posts });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:pageId/post/create', routeGuard(true), (req, res, next) => {
  res.render('page/create-post');
});

const uploader = require('../multer-configure.js');

router.post(
  '/:pageId/post/create',
  routeGuard(true),
  uploader.array('photos', 1),
  (req, res, next) => {
    const { title, content } = req.body;
    const { pageId } = req.params;

    const urls = req.files.map(file => {
      return file.url;
    });

    const author = req.user._id;

    Post.create({
      title,
      content,
      page: pageId,
      author,
      photos: urls
    })
      .then(post => {
        res.redirect(`/page/${post.page}/post/${post._id}`);
      })
      .catch(error => {
        next(error);
      });
  }
);

router.get('/:pageId/post/:postId', (req, res, next) => {
  const { postId } = req.params;

  let post;
  Post.findById(postId)
    .populate('page author')
    .then(document => {
      post = document;
      if (!document) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Comment.find({ post: postId }).populate('author');
      }
    })
    .then(comments => {
      res.render('page/single-post', { post, comments });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:pageId/post/:postId/edit', (req, res, next) => {
  const { postId } = req.params;

  Post.findOne({
    _id: postId,
    author: req.user._id
  })
    .then(post => {
      if (post) {
        res.render('page/edit-post', { post });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:pageId/post/:postId/edit', routeGuard(true), (req, res, next) => {
  const { pageId, postId } = req.params;
  const { title, content } = req.body;

  Post.findOneAndUpdate(
    {
      _id: postId,
      author: req.user._id
    },
    {
      title,
      content
    }
  )
    .then(() => {
      res.redirect(`/page/${pageId}/post/${postId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:pageId/post/:postId/comment', routeGuard(true), (req, res, next) => {
  const { pageId, postId } = req.params;
  const { content } = req.body;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Comment.create({
          post: postId,
          author: req.user._id,
          content
        });
      }
    })
    .then(() => {
      res.redirect(`/page/${pageId}/post/${postId}`);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;

*/
