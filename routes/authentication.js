'use strict';

const { Router } = require('express');
const router = new Router();

const passport = require('passport');
const bcryptjs = require('bcryptjs');
const routeGuard = require('./../middleware/route-guard');
const User = require('./../models/user');

router.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: './sign-up'
  })
);

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: './sign-in'
  })
);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google-callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
