
const parseQuickOrderLine = inputText => {
  if (!inputText) return {};
  const rows = inputText.split(/\n/);

  const headersArr = rows[0].split(/\t/);
  const usedHeaders = {};
  for (let i = 0; i < headersArr.length; i++) {
    switch (headersArr[i]) {
    case 'Line':
      if (!usedHeaders.lineNumber) {
        usedHeaders.lineNumber = i;
      }
      break;
    case 'Item':
      usedHeaders.item = i;
      break;
    case 'Qty Ordered':
      usedHeaders.qtyOrdered = i;
      usedHeaders.released = i;
      break;
    case 'Due Date':
      usedHeaders.dueDate = i;
      break;
    case 'Unit Price':
      usedHeaders.unitPrice = i;
      break;
    case 'Unit Cost':
      usedHeaders.unitCost = i;
      break;
    case 'Source Type':
      usedHeaders.source = i;
      break;
    case 'Source':
      if (!usedHeaders.job) {
        usedHeaders.job = i;
      }
      break;
      // transfer order headers
    case 'Quantity':
      usedHeaders.qtyOrdered = i;
      usedHeaders.released = i;
      break;
    case 'Sched Ship Date':
      usedHeaders.dueDate = i;
      break;
    default:
      break;
    }
  }

  const returnArr = {};
  if (usedHeaders) {
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(/\t/);
      if (!row[1]) { continue; }
      const line = parseInt(row[usedHeaders.lineNumber], 10);
      returnArr[line] = {};
      const hKeys = Object.keys(usedHeaders);
      for (const header of hKeys) {
        let v = row[usedHeaders[header]].trim();
        if (!isNaN(v) && header !== 'job') {
          v = Number(v);
        }
        returnArr[line][header] = v;
      }
      // returnArr[line].destination = 'Order';
    }
  }
  return returnArr;
};

module.exports = parseQuickOrderLine;
