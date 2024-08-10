
module.exports = headersArr => {
  // console.log('Order Headers');
  const usedHeaders = {};

  for (let i = 0; i <= headersArr.length; i++) {
    switch (headersArr[i]) {
    case 'Order':
    case 'Order Ref':
      usedHeaders.order_id = i;
      break;
    case 'Line':
      if (!usedHeaders.lineNumber) usedHeaders.lineNumber = i;
      break;
    case 'Item':
      usedHeaders.item = i;
      break;
    case 'Source':
      usedHeaders.source = i;
      if (!usedHeaders.job) usedHeaders.job = i;
      break;
    case 'Reference':
    case 'Job':
      usedHeaders.job = i;
      break;
    case 'Released':
      usedHeaders.released = i;
      break;
    case 'Qty Ordered':
      usedHeaders.qtyOrdered = i;
      if (!usedHeaders.released) usedHeaders.released = i;
      break;
    case 'Ready':
      usedHeaders.ready = i;
      break;
    case 'Reserved':
      usedHeaders.reserved = i;
      break;
    case 'Name':
      if (!usedHeaders.name) {
        usedHeaders.name = i;
        usedHeaders.billTo = i;
      }
      if (usedHeaders.name) usedHeaders.shipTo = i;
      break;
    case 'Order Date':
      usedHeaders.orderDate = i;
      break;
    case 'Due Date':
      usedHeaders.dueDate = i;
      break;
      // other
    case 'Destination':
      usedHeaders.destination = i;
      break;
    case 'Destination Type':
      usedHeaders.destinationType = i;
      break;
    case 'Job Date':
      usedHeaders.jobDate = i;
      break;
    case 'End':
      usedHeaders.end = i;
      break;
    case 'Unit Price':
      usedHeaders.unitPrice = i;
      break;
    case 'Unit Cost':
      usedHeaders.unitCost = i;
      break;
    default:
      break;
    }
  }

  return usedHeaders;
};
