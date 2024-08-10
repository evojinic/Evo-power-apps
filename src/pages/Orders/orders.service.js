
// import authHeader from './authHeaderOrder';

import authHeader from '../../_helpers/authHeader';
import { gpi } from '../../_helpers/gpi';
// import zlib from 'zlib';

const handleResponse = async response => {
  // console.log(response);
  if (response.status !== 200) {
    // if (response.gzip) {
    //   const buffer = Buffer.from(response.gzip, 'base64');
    //   return zlib.unzip(buffer, { finishFlush: zlib.Z_SYNC_FLUSH }, (err, uz) => {
    //     if (!err) {
    //       console.log(uz.toString());
    //     }
    //     else {
    //       console.log(uz);
    //       // handle error
    //     }
    //   });
    // }
    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const get = async(orderID, query = '?lineDetails=1&details=1&zpl=1') => handleResponse(
  await gpi.get(`o/${orderID}${query}`, { headers: authHeader() }),
);
const update = async(orderID, data) => handleResponse(
  await gpi.put(`o/${orderID}`, data, { headers: authHeader() }),
);
const create = async data => handleResponse(
  await gpi.post('o/', data, { headers: authHeader() }),
);
const sync = async data => handleResponse(
  await gpi.post('o/', data, { headers: authHeader() }),
);

export default {
  get,
  update,
  create,
  sync,
};
