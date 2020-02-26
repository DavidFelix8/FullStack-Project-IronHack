'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportGoogle = require('passport-google-oauth20').Strategy;

const PassportGoogleStrategy = passportGoogle.Strategy;

const bcryptjs = require('bcryptjs');

const User = require('./models/user');

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
          callback(null, user);
        })
        .catch(error => {
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
        user = document;
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

const GoogleStrategy = new PassportGoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, callback) => {
    const data = {
      name: profile.displayName,
      googleId: profile.id,
      googleUsername: profile.username,
      photo: profile.photos.length ? profile.photos[0].value : undefined
    };

    User.findOne({
      googleId: data.googleId
    })
      .then(user => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return User.create(data);
        }
      })
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  }
);

passport.use('google', GoogleStrategy);
