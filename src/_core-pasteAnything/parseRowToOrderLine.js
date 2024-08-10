
const cleanUpValue = (gv, header) => {
  if (gv === undefined) return '';
  let v = gv.trim();
  if (isNaN(v) && (header !== 'released' || header !== 'qtyOrdered')) v = v.replace(',', '');
  if (header === 'released' || header === 'qtyOrdered') v = Number(v);
  else if (!isNaN(v) && header !== 'job' && header !== 'source') v = Number(v);
  return v;
};

const rowValLookUp = (row, headers) => header => row[headers[header]];

const invJobComment = ({ type, item, rowVal }) => {
  const qty = cleanUpValue(rowVal('released'), 'released');
  let comment = '';
  comment = `${qty}x ${cleanUpValue(item, 'item')} ${type} for `;
  if (rowVal('jobSuffix') && rowVal('jobSuffix') !== 0 && rowVal('order_id')) {
    comment += `${rowVal('order_id').trim()}-${rowVal('lineNumber').trim()}`;
  }
  else comment += 'inventory';
  return comment;
};

const parseRowToOrderLine = (row, headers) => {
  let order_id = '';
  let ln = '';
  const oDetails = {
    order_id: '',
    name: '',
    billTo: '',
    shipTo: '',
    PO: '',
    orderDate: '',
    takenBy: '',
    originatingSite: '',
    shipVia: '',
    demandingSite: '',
    dueDate: '',
    comments: '',
  };
  const oLine = {
    lineNumber: '',
    item: '',
    qtyOrdered: 0,
    released: 0,
    dueDate: '',
    unitPrice: '',
    unitCost: '',
    source: '',
    job: '',
    // reserved: 0,
    // ready: 0,
    destination: '',
  };
  const rowVal = rowValLookUp(row, headers);

  order_id = rowVal('order_id').trim();
  ln = rowVal('lineNumber').trim();
  let comments = '';
  const item = rowVal('item');

  // if import is a job and not customer order or transfer
  if (headers.destination >= 0) {
    const isSealJob = item.startsWith('PS-');
    const isWasherJob = (item.startsWith('MW-') || item.startsWith('PW-')) && headers.job;
    const isInventory = rowVal('destination') && rowVal('destination') === 'Inventory' || rowVal('destinationType') && rowVal('destinationType') === 'Inventory';
    const isInventoryJob = isSealJob || isWasherJob || isInventory;
    if (isInventoryJob) {
      order_id = rowVal('job').trim();
      ln = rowVal('job').trim();
    }

    if (isSealJob) comments = invJobComment({ type: 'seals', item, rowVal });
    if (isWasherJob) comments = invJobComment({ type: 'washers', item, rowVal });
    else {
      // ignore child suffixes
      if (rowVal('jobSuffix') && rowVal('jobSuffix') != 0) return null; // eslint-disable-line eqeqeq
      if (isInventory) {
        // if (!rowVal('dueDate')) rowVal('dueDate') = rowVal('end');
      }
    }
  }

  if (!ln) {
    return { error: `fatal error line number can not be 0, table column used to determine line ${parseInt(headers.lineNumber, 10) + 1}` };
  }

  const hKeys = Object.keys(headers);
  for (const header of hKeys) {
    const rowIndex = headers[header];
    if (!row[rowIndex]) continue;
    // if order detail
    if (
      header === 'order_id' ||
      header === 'billTo' ||
      header === 'shipTo' ||
      header === 'name' ||
      header === 'orderDate'
    ) {
      oDetails[header] = cleanUpValue(row[rowIndex], header);
    }
    // line detail
    else {
      oLine[header] = cleanUpValue(row[rowIndex], header);
    }
  }

  // correct order details
  if (!oDetails.name) oDetails.name = rowVal('billTo');
  if (ln === order_id) {
    oDetails.name = 'Inventory';
    // oDetails.billTo = false;
    // oDetails.shipTo = false;
    // oDetails.po = false;
    // oDetails.shipVia = false;
    oDetails.destination = 'Inventory';
    oDetails.originatingSite = 'DNV';
    oDetails.demandingSite = 'DNV';
    oDetails.orderDate = rowVal('jobDate');
    oDetails.dueDate = rowVal('end');
  }
  else {
    if (!oLine.destination) oLine.destination = order_id;
    if (!oLine.destinationType) oLine.destinationType = 'Order';
  }
  oDetails.order_id = order_id;

  // if (comments)
  oDetails.comments = comments;

  // correct line details
  if (!oLine.lineNumber) oLine.lineNumber = rowVal('job');
  if (!oLine.destination) delete oLine.destination;
  if (!oLine.released) oLine.released = rowVal('qtyOrdered');
  if (!oLine.dueDate) oLine.dueDate = rowVal('end');
  if (oLine.job && oLine.job === oLine.source) oLine.source = 'Job';

  return { order_id, ln, oDetails, oLine };
};

module.exports = parseRowToOrderLine;
