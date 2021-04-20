const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const secret = process.env.secret;

module.exports = {
  authenticate,
  refreshToken,
  register,
  login,
};

async function authenticate({ loginName, password }) {
  var payload = {};
  var data = {
    loginName: loginName,
    password: password,
  };

  var user = await User.findOne({
    $or: [{ username: data.loginName }, { email: data.loginName }],
  }).catch((error) => {
    console.log(error);
    payload.success = false;
    payload.errorMessage = 'Something went wrong.';
    return payload;
  });

  if (!user) {
    payload.success = false;
    payload.errorMessage = 'The user not found.';
    return payload;
  }

  if (user && bcrypt.compareSync(data.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: '365d' }
    );

    const updateUserToken = await User.findByIdAndUpdate(
      user.id,
      {
        accessToken: token,
      },
      { new: true }
    );

    if (!updateUserToken) {
      payload.success = false;
      payload.errorMessage = 'the token cannot be updated!';
    } else {
      payload.success = true;
      payload.accessToken = token;
    }

    return payload;
  } else {
    payload.success = false;
    payload.errorMessage = 'password is wrong!';
    return payload;
  }
}

async function login({ loginName, password }) {
  var payload = {};
  var data = {
    loginName: loginName,
    password: password,
  };

  var user = await User.findOne({
    $or: [{ username: data.loginName }, { email: data.loginName }],
    "isVerify": true,
  }).catch((error) => {
    console.log(error);
    payload.success = false;
    payload.errorMessage = 'Something went wrong.';
    return payload;
  });

  if (!user) {
    payload.success = false;
    payload.errorMessage = 'The user not found.';
    return payload;
  }

  if (user && bcrypt.compareSync(data.password, user.password)) {
    payload.success = true;
    payload.user = user;
    return payload;
  } else {
    payload.success = false;
    payload.errorMessage = 'Password is wrong!';
    return payload;
  }
}

async function register({ name, email, username, password }) {
  var payload = {};
  var data = {
    name: name,
    email: email,
    username: username,
    password: password,
  };
  var user = await User.findOne({
    $or: [{ username: data.username }, { email: data.email }],
  }).catch((error) => {
    payload.success = false;
    payload.errorMessage = 'Something went wrong.';
    return payload;
  });

  if (user === null) {
    // No user found
    data.password = bcrypt.hashSync(data.password, 10);
    const accessToken = jwt.sign(
      { userId: data.username, role: 'basic' },
      secret,
      { expiresIn: '365d' }
    );
    data.accessToken = accessToken;

    let newUser = new User(data);
    newUser = await newUser.save();
    if (newUser) {
      payload.success = true;
      payload.user = newUser;

      return payload;
    }
  } else {
    // User found
    payload.success = false;
    if (data.email == user.email) {
      payload.errorMessage = 'Email already in use.';
    } else {
      payload.errorMessage = 'Username already in use.';
    }

    return payload;
  }
}

async function refreshToken({ token }) {
  var payload = {};
  var decrypted = jwt.decode(token);
  var userId = '';
  var accessToken = '';

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      if (error.expiredAt) {
        userId = decrypted.userId;
        accessToken = jwt.sign(
          { userId: decrypted.userId, role: 'basic' },
          secret,
          { expiresIn: '365d' }
        );

        payload.success = true;
      } else {
        payload.success = false;
        payload.errorMessage = error.message;
      }
    } else {
      userId = decoded.userId;
      accessToken = jwt.sign(
        { userId: decoded.userId, role: 'basic' },
        secret,
        { expiresIn: '365d' }
      );

      payload.success = true;
    }
  });

  if (payload.success) {
    const updateUserToken = await User.findByIdAndUpdate(
      userId,
      {
        accessToken: accessToken,
      },
      { new: true }
    );

    if (!updateUserToken) {
      payload.success = false;
      payload.errorMessage = 'the token cannot be updated!';
    } else {
      payload.accessToken = accessToken;
    }
  }

  return payload;
}
