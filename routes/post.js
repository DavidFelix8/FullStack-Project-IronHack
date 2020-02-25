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
      console.log(error);
      next(error);
    });
});

router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId;
  let postInfo;
  Post.findById(postId)
    .populate('author')
    .then(postData => {
      postInfo = postData;
      console.log(postInfo);
      return Comment.find({ post: postId }).populate('author');
    })
    .then(comments => {
      console.log(comments);
      res.render('page/single-post', { postInfo, comments });
    })
    .catch(error => next(error));
});

/*Working on it Post to comments*/
//Comments
<<<<<<< HEAD
router.post('/:postId/comment', routeGuard(true), (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
=======
/* router.post('/:pageId/post/:postId/comment', routeGuard(true), (req, res, next) => {
  const { pageId, postId } = req.params;
>>>>>>> a61411ed43a02c0d1ac898638466bf075f1af80b
  const { content } = req.body;
  Comment.create({
    post: postId,
    author: userId,
    content: content
  })
    .then(newComment => {
      console.log(newComment);
      res.redirect(`/post/${postId}`);
    })
    .catch(error => next(error));
});
<<<<<<< HEAD

=======
 */
>>>>>>> a61411ed43a02c0d1ac898638466bf075f1af80b
module.exports = router;
