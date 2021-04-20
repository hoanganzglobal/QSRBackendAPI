const expressJwt = require('express-jwt');
const userService = require('../services/userService');

function authJwt(roles = []) {
  const secret = process.env.secret;

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({
      secret,
      algorithms: ['HS256'],/*
      credentialsRequired: false,
      getToken: function (req) {
        if (req.headers.authorization) {
          const base64Credentials = req.headers.authorization.split(' ')[1];
          const credentials = Buffer.from(base64Credentials, 'base64').toString(
            'ascii'
          );
          const [loginName, password] = credentials.split(':');
          userService.authenticate({ loginName, password }).then((payload) => {
            console.log(payload);
            if (payload && payload.success === true) {
              return payload.accessToken;
            }
          });
        }
      },*/
    }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    },
  ];
}

module.exports = authJwt;
