const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/jwt');

// routes
router.post(
  '/notify-insert',
  authorize(['basic']),
  getNotifyInsert
);
router.post(
  '/notify-update',
  authorize(['basic']),
  getNotifyUpdate
);

module.exports = router;

function getNotifyInsert(req, res, next) {
  const io = req.io;

  var data = {
    orderRow: req.body.ecomOrderRow,
  };

  var orderRow = data.orderRow;
  var payload = {
    success: true,
    data: orderRow[0],
  };

  req.app.get('socketService').emiter('notify order insert', payload);

  payload.success === true
    ? res.status(200).send(payload)
    : res.status(400).json(payload);
}

function getNotifyUpdate(req, res, next) {
  const io = req.io;

  var data = {
    orderRow: req.body.ecomOrderRow,
  };

  var orderRow = data.orderRow;
  var payload = {
    success: true,
    data: orderRow[0],
  };

  req.app.get('socketService').emiter('notify order update', payload);

  payload.success === true
    ? res.status(200).send(payload)
    : res.status(400).json(payload);
}
