
const mapHeadersQuickOrder = require('./mapQuickOrder');

const parseQuickOrderData = inputText => {
  if (!inputText) return {};
  const rows = inputText.split(/\n/);
  const headersArr = rows[0].split(/\t/);
  const usedHeaders = mapHeadersQuickOrder(headersArr);
  const returnArr = {};
  if (usedHeaders) {
    // single order import only
    const row = rows[1].split(/\t/);
    // set order details
    const hKeys = Object.keys(usedHeaders);
    for (const header of hKeys) {
      returnArr[header] = row[usedHeaders[header]].trim();
    }
    // single order import only
    for (let i = 2; i < rows.length; i++) {
      // let addressRow = rows[i].split(/\t/);
      // pick up the address
      // if (!addressRow[1] & addressRow[0] !== '') {
      //   console.log(rows[i])
      //   returnArr.address += '\n'+rows[i];
      // }
    }
  }
  else {
    return { error: 'headers do not match' };
  }
  return returnArr;
};

module.exports = parseQuickOrderData;
