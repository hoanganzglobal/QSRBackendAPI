const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require("./database");
const errorHandler = require('./_helpers/error-handler');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// api routes
app.use("/users", require('./controllers/userController'));
app.use("/vouchers", require('./controllers/voucherController'));

// global error handler
app.use(errorHandler);

mongoose.connect();

const server = app.listen(port, () => {
    console.log("server listening on port " + port);
})