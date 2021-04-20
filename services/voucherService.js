var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

const config = {
  server: process.env.mssql_server, // '192.168.11.68',  //update me
  authentication: {
    type: 'default',
    options: {
      userName: process.env.mssql_user, //'sang.m.nguyen', //update me
      password: process.env.mssql_password, //'MinhSang123@@@'  //update me
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: false,
    tdsVersion: '7_1',
    database: process.env.mssql_database, //'QSR_Evoucher'  //update me
    enableArithAbort: true,
    rowCollectionOnDone: true,
  },
};

const storedProcedure = '[dbo].[pr_Evoucher3partner_GetBySourceCampaign]';

async function random3rdVoucher({ campaignID, sourceID, transactionID }) {
  var payload = {};
  payload.success = false;

  var connection = new Connection(config);
  var t = new Promise((resolve, reject) => {
    connection.on('connect', (err) => {
      if (err) {
        //console.log('Database Connection Error: ', err);
        payload.success = false;
        payload.errorMessage = 'Database Connection Error!!!';
        payload.result = '';
        resolve(payload);
      } else {
        callProcedureWithParameters(campaignID, sourceID, transactionID).then(
          (result) => {
            resolve(result);
          }
        );
      }
    });
  });

  return t.then((payload) => {
    if (payload.success === true) {
      if (payload.result == '-2') {
        payload.errorMessage = 'Voucher not found from source ' + sourceID;
      } else if (payload.result == '-3') {
        payload.errorMessage =
          'Transaction ID (' + transactionID + ') has already in system';
      } else if (payload.result == '-1') {
        payload.errorMessage = 'System error!!! Contact IT QSR';
      } else {
        payload.errorMessage = '';
      }
    }
    return payload;
  });

  function callProcedureWithParameters(campaignID, sourceID, transactionID) {
    return new Promise((resolve, reject) => {
      const request = new Request(storedProcedure, (err) => {
        if (err) {
          console.log(err);
          payload.success = false;
          payload.errorMessage = 'Error call procedure!!!';
          payload.result = '';
          resolve(payload);
        } else {
          payload.success = true;
        }
        resolve(payload);

        connection.close();
      });
      request.addParameter('campaignid', TYPES.VarChar, campaignID);
      request.addParameter('sourceid', TYPES.VarChar, sourceID);
      request.addParameter('transactionid', TYPES.VarChar, transactionID);

      request.on('row', function (columns) {
        columns.forEach(function (column) {
          if (column.value === null) {
            payload.success = true;
            payload.errorMessage = 'Result empty';
            payload.result = '';
            console.log('NULL');
          } else {
            payload.success = true;
            payload.result = column.value;
          }
        });
        resolve(payload);
      });

      connection.callProcedure(request);
    });
  }
}

module.exports = {
  random3rdVoucher,
};
