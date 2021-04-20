const express = require('express');
const router = express.Router();
const voucherService = require('../services/voucherService');
const authorize = require('../_helpers/jwt');

// routes
router.post(
  '/random3rdVoucher',
  authorize(['basic']),
  random3rdVoucher
);
module.exports = router;

function random3rdVoucher(req, res, next) {
  var data = {
    campaignID: (req.body.campaignID).trim(),
    sourceID: (req.body.sourceID).trim(),
    transactionID: (req.body.transactionID).trim(),
  };
  voucherService
    .random3rdVoucher(data)
    .then((payload) =>
      
      payload.success === true
        ? res.status(200).send(payload)
        : res.status(400).json(payload)
    )
    .catch((err) => next(err));
}
