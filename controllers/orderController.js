const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/jwt');
const fileService = require('../services/fileService');
const path = require('path');

// routes
router.post('/notify-insert', authorize(['basic']), getNotifyInsert);
router.post('/notify-update', authorize(['basic']), getNotifyUpdate);

module.exports = router;

var filePath = `/data/orders.json`;
var targetPath = path.join(__dirname, `../${filePath}`);

function getNotifyInsert(req, res, next) {
  var data = {
    orderRow: req.body.ecomOrderRow,
  };

  var orderRow = data.orderRow;
  var payload = {
    success: true,
    data: orderRow[0],
  };

  req.app.get('socketService').emiter('notify order insert', payload);

  fileService.ReadingAndWritingJsonToFile(targetPath, orderRow[0]);

  payload.success === true
    ? res.status(200).send(payload)
    : res.status(400).json(payload);
}

function getNotifyUpdate(req, res, next) {
  var data = {
    orderRow: req.body.ecomOrderRow,
  };

  var orderRow = data.orderRow;
  var payload = {
    success: true,
    data: orderRow[0],
  };

  req.app.get('socketService').emiter('notify order update', payload);

  fileService.ReadingAndWritingJsonToFile(targetPath, orderRow[0]);

  payload.success === true
    ? res.status(200).send(payload)
    : res.status(400).json(payload);
}
