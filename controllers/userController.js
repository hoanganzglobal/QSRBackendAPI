const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authorize = require('../_helpers/jwt');

// routes
router.post('/authenticate', authenticate);
router.post('/refreshToken', refreshToken);
router.post('/login', login);
router.post('/register', authorize('admin'), register);
module.exports = router;

function authenticate(req, res, next) {
  var data = {
    loginName: req.body.loginName.trim(),
    password: req.body.password.trim(),
  };
  if (data.loginName && data.password) {
    userService
      .authenticate(data)
      .then((payload) =>
        payload.success === true
          ? res.status(200).send(payload)
          : res.status(400).json(payload)
      )
      .catch((err) => next(err));
  } else {
    res.status(400).json({
      success: false,
      errorMessage: 'Make sure each field has a valid value.',
    });
  }
}

function login(req, res, next) {
  var data = {
    loginName: req.body.loginName.trim(),
    password: req.body.password.trim(),
  };
  if (data.loginName && data.password) {
    userService
      .login(data)
      .then((payload) => res.status(200).send(payload))
      .catch((err) => next(err));
  } else {
    res.status(400).json({
      success: false,
      errorMessage: 'Make sure each field has a valid value.',
    });
  }
}

function register(req, res, next) {
  var data = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    username: req.body.username.trim(),
    password: req.body.password.trim(),
  };
  if (data.name && data.email && data.username && data.password) {
    userService
      .register(data)
      .then((payload) =>
        payload.success === true
          ? res.status(200).send(payload)
          : res.status(400).json(payload)
      )
      .catch((err) => next(err));
  } else {
    res.status(400).json({
      success: false,
      errorMessage: 'Make sure each field has a valid value.',
    });
  }
}

function refreshToken(req, res, next) {
  var data = {
    token: req.body.token.trim(),
  };

  if (data.token) {
    userService
      .refreshToken(data)
      .then((payload) =>
        payload.success === true
          ? res.status(200).send(payload)
          : res.status(400).json(payload)
      )
      .catch((err) => next(err));
  } else {
    res.status(400).json({
      success: false,
      errorMessage: 'Make sure token is not empty.',
    });
  }
}
