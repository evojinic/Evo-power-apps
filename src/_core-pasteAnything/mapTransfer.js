
module.exports = headersArr => {
  // console.log('Transfer Order(s)');
  const usedHeaders = {};

  for (let i = 0; i <= headersArr.length; i++) {
    switch (headersArr[i]) {
    case 'Transfer':
      usedHeaders.order_id = i;
      break;
    case 'Line':
      if (!usedHeaders.lineNumber) usedHeaders.lineNumber = i;
      break;
    case 'Item':
      usedHeaders.item = i;
      break;
    case 'Source Type':
      usedHeaders.source = i;
      break;
    case 'Source':
      usedHeaders.job = i;
      break;
    case 'Released':
      usedHeaders.released = i;
      break;
    case 'Quantity':
      usedHeaders.qtyOrdered = i;
      break;
    case 'Ready':
      usedHeaders.ready = i;
      break;
    case 'Plan On Save':
      usedHeaders.reserved = i;
      break;
    case 'To Site':
      usedHeaders.name = i;
      break;
    case 'Order Date':
      usedHeaders.orderDate = i;
      break;
    // case 'Job Date':
      // 		usedHeaders['jobDate'] = i;
      // 		break;
    case 'Sched Ship Date':
      usedHeaders.dueDate = i;
      break;
    default:
      break;
    }
  }

  return usedHeaders;
};
