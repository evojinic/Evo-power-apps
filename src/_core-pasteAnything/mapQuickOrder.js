
module.exports = headersArr => {
  // console.log('Quick Order(s)');
  const usedHeaders = {};

  for (let i = 0; i <= headersArr.length; i++) {
    switch (headersArr[i]) {
    case 'Order':
      usedHeaders.order_id = i;
      break;
    case 'Cust PO':
      usedHeaders.po = i;
      break;
    case 'Address':
      if (!usedHeaders.Address) {
        usedHeaders.address = i;
      }
      break;
    case 'Ship Via':
      usedHeaders.shipVia = i;
      break;
    case 'Order Date':
      usedHeaders.orderDate = i;
      break;
    case 'Promise Date':
      usedHeaders.dueDate = i;
      break;
    case 'C(CadrNameStatic)':
      usedHeaders.shipTo = i;
      break;
    case 'C(BillToNameStatic)':
      usedHeaders.billTo = i;
      break;
    case 'Name':
      if (!usedHeaders.name) {
        usedHeaders.name = i;
        usedHeaders.billTo = i;
      }
      if (usedHeaders.name) {
        usedHeaders.shipTo = i;
      }
      break;
    case 'Originating Site':
      usedHeaders.originatingSite = i;
      break;
    case 'Demanding Site':
      usedHeaders.demandingSite = i;
      break;
    case 'Taken By':
      usedHeaders.takenBy = i;
      break;
      // transfer
    case 'Transfer':
      usedHeaders.order_id = i;
      break;
    case 'From Site':
      usedHeaders.originatingSite = i;
      break;
    case 'To Site':
      usedHeaders.name = i;
      usedHeaders.demandingSite = i;
      break;
    case 'Created By':
      usedHeaders.takenBy = i;
      break;
    default:
      break;
    }
  }

  return usedHeaders;
};
