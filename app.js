const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('./database');
const errorHandler = require('./_helpers/error-handler');
var ActiveDirectory = require('activedirectory2');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// api routes
app.use('/users', require('./controllers/userController'));
app.use('/vouchers', require('./controllers/voucherController'));
app.use('/orders', require('./controllers/orderController'));

// global error handler
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log('server listening on port ' + port);
});

mongoose.connect();

const SocketService = require('./services/socketService');
app.set('socketService', new SocketService(server));

async function auth() {
  var username = 'xxxxxx';
  var password = 'xxxxxx';
  var config = {
    url: 'ldap://192.168.11.36:389',
    baseDN: 'ou=qsrvietnam,dc=qsr,dc=local',
    username: username,
    password: password,
  };
  var ad = new ActiveDirectory(config);
  // Authenticate
  await ad.authenticate(username, password, function (err, auth) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    if (auth) {
      ad.findUser(username, function (err, user) {
        if (err) {
          console.log('ERROR: ' + JSON.stringify(err));
          return;
        }

        if (!user) console.log('User: ' + username + ' not found.');
        else console.log(JSON.stringify(user));
      });
    } else {
      console.log('Authentication failed!');
    }
  });
}

//auth();
