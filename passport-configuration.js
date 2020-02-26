/* 'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');
const bcryptjs = require('bcryptjs');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  'local-sign-up',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      console.log('req.body', req.body);
      const name = req.body.name;
      bcryptjs
        .hash(password, 10)
        .then(hash => {
          return User.create({
            name,
            email,
            passwordHash: hash
          });
        })
        .then(user => {
          console.log('USER', user);
          callback(null, user);
        })
        .catch(error => {
          console.log('ERROR', error);
          callback(error);
        });
    }
  )
);

passport.use(
  'local-sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then(document => {
        //console.log(req.body);
        user = document;
        console.log(user);
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error('WRONG_PASSWORD'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"http://www.example.com/auth/google/callback"
      //scope: 'user:email'
    },
  /*   function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
      });
    }
  )); */
/*(accessToken, refreshToken, profile, callback) => {
      const { displayName: name, emails, photos: [{ value: photo } = {}] = [] } = profile;
      const primaryEmail = emails.find(email => email.primary).value;
      User.findOne({ email: primaryEmail })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: primaryEmail,
              photo,
              name,
              githubToken: accessToken
            });
          }
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);
*/
