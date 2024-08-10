
module.exports = headersArr => {
  // console.log('Job Order(s)');
  const usedHeaders = {};

  for (let i = 0; i <= headersArr.length; i++) {
    switch (headersArr[i]) {
    case 'Destination':
      usedHeaders.order_id = i;
      usedHeaders.destination = i;
      break;
    case 'Destination Line-Suffix':
      usedHeaders.lineNumber = i;
      break;
    case 'Item':
      usedHeaders.item = i;
      break;
    case 'Destination Type':
      usedHeaders.destinationType = i;
      break;
    // case 'Destination':
    //   usedHeaders.destination = i;
    //   break;
    case 'Job':
      usedHeaders.job = i;
      break;
    case 'Job Suffix':
      usedHeaders.jobSuffix = i;
      break;
    case 'Released':
      usedHeaders.released = i;
      break;
    case 'Qty Ordered':
      usedHeaders.qtyOrdered = i;
      break;
    // case 'Ready':
    //   usedHeaders.ready = i;
    //   break;
    // case 'Reserved':
    //   usedHeaders.reserved = i;
    //   break;
    case 'Name':
      if (!usedHeaders.name) {
        usedHeaders.name = i;
        usedHeaders.billTo = i;
      }
      // if (usedHeaders['name']) usedHeaders['shipTo'] = i;
      break;
    case 'Order Date':
      usedHeaders.orderDate = i;
      break;
    case 'Job Date':
      usedHeaders.jobDate = i;
      break;
    case 'Due Date':
      usedHeaders.dueDate = i;
      break;
    case 'End':
      usedHeaders.end = i;
      break;
    case 'End Date':
      if (!usedHeaders.end) usedHeaders.end = i;
      break;
    default:
      break;
    }
  }

  return usedHeaders;
};
