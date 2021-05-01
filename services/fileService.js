const fs = require('fs');

module.exports = {
  ReadingAndWritingJsonToFile,
  CheckFileExists,
};

function ReadingAndWritingJsonToFile(targetPath, orderT) {
  var obj = {
    orders: [],
  };
  if (CheckFileExists(targetPath)) {
    try {
      var data = fs.readFileSync(targetPath, 'utf8');
      data = JSON.parse(data);
      var orders = [];
      if (data.hasOwnProperty('orders')) {
        orders = data.orders;
        if (orders.length > 0) {
          let index = -1;
          for (var i=0; i < orders.length; i++) {
            let order = JSON.parse(orders[i]);
            if (order.Id == orderT.Id) {
              index = i;
              break;
            }
          }
          if (index == -1) {
            orders.push(JSON.stringify(orderT));
          } else {
            let order = JSON.parse(orders[index]);
            order.OrderStatusId = orderT.OrderStatusId;
            order.PaymentStatusId = orderT.PaymentStatusId;
            order.DeliveryTime = orderT.DeliveryTime;
            order.syncStatus = orderT.syncStatus;
            orders[index] = JSON.stringify(order);
          }
        } else {
          orders.push(JSON.stringify(orderT));
        }
      } else {
        orders.push(JSON.stringify(orderT));
      }
      obj.orders = orders;
    } catch (err) {
      console.error(err);
    }
  } else {
    obj.orders.push(JSON.stringify(orderT));
  }

  try {
    fs.writeFileSync(targetPath, JSON.stringify(obj));
  } catch (err) {
    console.log(err);
  }
}

function CheckFileExists(targetPath) {
  var flag = false;
  try {
    if (fs.existsSync(targetPath)) {
      flag = true;
    }
  } catch (err) {
    console.error(err);
  }

  return flag;
}
