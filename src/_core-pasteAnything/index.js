
const mapHeadersForTransfer = require('./mapTransfer');
const mapHeadersForJOB = require('./mapJob');
const mapHeadersForORDER = require('./mapOrderLines');

const parseRowToOrderLine = require('./parseRowToOrderLine');
const parseQuickOrderData = require('./parseQuickOrderData');
const parseQuickOrderLine = require('./parseQuickOrderLine');

const contentIsTransferOrder = headerString => headerString.indexOf('Transfer') !== -1;
const contentIsCustomerOrder = headerString => headerString.indexOf('Order Ref') !== -1 && headerString.indexOf('Line\t') !== -1 || headerString.indexOf('Order\t') !== -1 && headerString.indexOf('Source\t') !== -1;
const contentIsJobImport = headerString => headerString.indexOf('Destination Line-Suffix\t') !== -1 && headerString.indexOf('Job\t') !== -1 && headerString.indexOf('Destination Type\t') !== -1;

const mapUsefulHeaders = (headerString, headersArr) => {
  if (contentIsTransferOrder(headerString)) return mapHeadersForTransfer(headersArr);
  if (contentIsCustomerOrder(headerString)) return mapHeadersForORDER(headersArr);
  if (contentIsJobImport(headerString)) return mapHeadersForJOB(headersArr);
  return false;
};

const parseQuickInput = ({ inputTextOrder, inputTextLines }) => {
  const oDetails = parseQuickOrderData(inputTextOrder);
  const oLines = parseQuickOrderLine(inputTextLines);
  const _id = oDetails.order_id;
  return {
    _id,
    oDetails,
    oLines,
  };
};

const parseInput = rawText => {
  const importList = {};
  const allTextLines = rawText.split(/\n/);
  const headerString = allTextLines[0];
  const headers = allTextLines[0].split(/\t/);
  const usedHeaders = mapUsefulHeaders(headerString, headers);

  // if (!usedHeaders.released) usedHeaders.released = usedHeaders.qtyOrdered;
  if (usedHeaders) {
    for (let i = 1; i < allTextLines.length; i++) {
      const row = allTextLines[i].split(/\t/);
      if (!row[0]) continue;
      const parsedRow = parseRowToOrderLine(row, usedHeaders);
      if (!parsedRow) continue;
      if (parsedRow.error) {
        console.error(parsedRow.error);
        continue;
      }
      const { order_id, ln, oDetails, oLine } = parsedRow;
      if (!importList[order_id]) importList[order_id] = { oDetails, oLines: {} };
      if (!importList[order_id].oLines[ln]) importList[order_id].oLines[ln] = oLine;
    }
  }
  else {
    return { error: 'headers do not match' };
  }

  // to array
  const ids = Object.keys(importList);
  const importArrayList = [];
  for (const _id of ids) {
    importArrayList.push({
      _id,
      oDetails: importList[_id].oDetails,
      oLines: importList[_id].oLines,
    });
  }

  return importArrayList;
};

module.exports = {
  parseInput,
  parseQuickInput,
};
