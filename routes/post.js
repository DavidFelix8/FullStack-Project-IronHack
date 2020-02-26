'use strict';
const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');
const Comment = require('./../models/comment');
const routeGuard = require('../middleware/route-guard');

// cRud - Get all the posts. http://localhost:3000/post

//TODO: TALK ABOUT THIS WITH THE GROUP-THIS IS ALREADY BEEN DONE IN THE INDEX ROUTER
// router.get('/', (req, res, next) => {
//   Post.find()
//     // .limit(10)
//     .then(posts => {
//       console.log('POSTS', posts);
//       res.render('index', { posts });
//     })
//     .catch(error => {
//       next(error);
//     });
// });

// Crud - Get all the posts. http://localhost:3000/post/create
router.get('/create', routeGuard(true), (req, res, next) => {
  res.render('page/create-post');
});

// Crud - Get all the posts. http://localhost:3000/post/create
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
        //console.log(comment);
        comment.creation = new Date(comment.createdAt);
      });
      const editedComments = comments.map((val, ind) => {
        console.log('filtering', user, val.author._id);
        if (val.author._id.toString() == user.toString()) {
          val.canDelete = true;
          return val;
        } else {
          return val;
        }
      });

      console.log('mine', editedComments);
      res.render('page/single-post', { postInfo, editedComments, ownProfile });
    })
    .catch(error => next(error));
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

  console.log('HREE', commentId);

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
