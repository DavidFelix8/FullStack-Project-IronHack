'use strict';
const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');
const Comment = require('./../models/comment');
const routeGuard = require('../middleware/route-guard');
const Like = require('./../models/like');
router.get('/create', routeGuard(true), (req, res, next) => {
  res.render('page/create-post');
});

const uploader = require('../multer-configure.js');

router.post('/create', routeGuard(true), uploader.single('photo'), (req, res, next) => {
  const { title, category } = req.body;

  const photo = req.file.url;

  const author = req.user._id;

  Post.create({
    title,
    author,
    category,
    photo
  })
    .then(post => {
      //console.log(post);
      res.redirect(`/post/${post._id}`);
    })
    .catch(error => {
      // console.log(error);
      next(error);
    });
});

router.get('/:postId', (req, res, next) => {
  let user;
  req.user ? (user = req.user._id) : (user = '');
  const postId = req.params.postId;
  let postInfo;
  let ownProfile;

  Post.findById(postId)
    .populate('author')
    .then(postData => {
      postInfo = postData;
      //console.log(postInfo);
      return Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate('author')
        .lean();
    })
    .then(comments => {
      user.toString() == postInfo.author._id.toString()
        ? (ownProfile = true)
        : (ownProfile = false);
      comments.map(comment => {
        comment.creation = new Date(comment.createdAt);
      });
      const editedComments = comments.map((val, ind) => {
        if (val.author._id.toString() == user.toString()) {
          val.canDelete = true;
          return val;
        } else {
          return val;
        }
      });
      Like.find({ postId: postId }).then(likes => {
        const numLikes = likes.length;
        console.log(likes, numLikes);
        res.render('page/single-post', { postInfo, editedComments, ownProfile, numLikes });
      });
    })
    .catch(error => next(error));
});

//add like

router.post('/:postId/like', (req, res, next) => {
  console.log('i am here', req.user._id, req.params.postId);
  const postId = req.params.postId;
  const user = req.user._id;
  Like.create({
    postId,
    userId: user
  })
    .then(data => {
      console.log(data);
      res.redirect(`/post/${postId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:postId/edit', (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then(data => {
      res.render(`page/edit-post`, { data });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:postid/edit', (req, res, next) => {
  const postId = req.params.postid;
  const newtitle = req.body.title;
  Post.findByIdAndUpdate(postId, {
    title: newtitle
  })
    .then(update => {
      res.redirect(`/post/${postId}`);
    })
    .catch(error => {
      next(error);
    });
});

//Comments
router.post('/:postId/comment', routeGuard(true), (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;
  Comment.create({
    post: postId,
    author: userId,
    content: content
  })
    .then(newComment => {
      //console.log(newComment);
      res.redirect(`/post/${postId}`);
    })
    .catch(error => next(error));
});

router.post('/:postId/:commentId/delete', (req, res, next) => {
  console.log('I am deleting a comment');
  const commentId = req.params.commentId;
  const { postId } = req.params;

  Comment.findByIdAndDelete(commentId)
    .then(postInfo => {
      console.log('Remove Comment', postInfo);
      res.redirect(`/post/${postId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:postId/delete', (req, res, next) => {
  const postId = req.params.postId;

  Post.findByIdAndDelete(postId)
    .then(postInfo => {
      console.log('Remove Post', postInfo);
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

//delete

module.exports = router;
