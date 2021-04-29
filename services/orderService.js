const fs = require('fs');
const fileService = require('../services/fileService');

module.exports = {
  getOrders,
};

async function getOrders(targetPath) {
  var payload = {
      success: true,
      data: [],
  };

  var data = [];
  if (fileService.CheckFileExists(targetPath)) {
    try {
      var jsonString = fs.readFileSync(targetPath, 'utf8');
      var objT = JSON.parse(jsonString);
      if (objT.hasOwnProperty('orders')) {
        var orders = objT.orders;
        if (orders.length > 0) {
          for (var i = 0; i < orders.length; i++) {
            let order = JSON.parse(orders[i]);
            data.push({
              orderCode: order.Id,
              orderBrandCode: 'TPC',
              orderShopName: order.ShopName,
              orderChannel: order.OrderChannel,
              orderPaymentMethod: order.PaymentMethodSystemName,
              orderStatus: order.OrderStatusId,
              orderPaymentStatus: order.PaymentStatusId,
              orderMethod: order.PickupInStore,
              orderCustomerInfo: order.CustomerPhone + ' | ' + order.CustomerName,
              orderSyncStatus: order.syncStatus,
              orderCreatedAt: order.OrderDate,
              orderDeliveryTime: order.DeliveryTime,
              orderTotal: order.Total
            });
          }
        }
      }
      payload.success = true;
      payload.data = data;
    } catch (err) {
      payload.success = false;
      payload.errorMessage = err;
    }
    return payload;
  }

  return payload;
}
