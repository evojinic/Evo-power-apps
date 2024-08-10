/* eslint-disable camelcase */

import authHeader from '../../_helpers/authHeader';
import { gpi } from '../../_helpers/gpi';

const handleResponse = async response => {
  // console.log(response);
  if (response.status !== 200) {
    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const list = async() => handleResponse(
  await gpi.get('hb/list', { headers: authHeader() }),
);
const listWithPOs = async() => handleResponse(
  await gpi.get('hb/withPOs', { headers: authHeader() }),
);
const refresh = async stamp => handleResponse(
  await gpi.get(`hb/list?cache=${stamp}`, { headers: authHeader() }),
);
const get = async id => handleResponse(
  await gpi.get(`hb/${id}`, { headers: authHeader() }),
);
const update = async(id, data) => handleResponse(
  await gpi.put(`hb/${id}`, data, { headers: authHeader() }),
);
const create = async data => handleResponse(
  await gpi.post('hb/', data, { headers: authHeader() }),
);
const getQuote = async quote_id => handleResponse(
  await gpi.get(`q/${quote_id}`, { headers: authHeader() }),
);
const verifyBOM = async data => handleResponse(
  await gpi.post('item/verifyBOM', data, { headers: authHeader() }),
);

export default {
  list,
  listWithPOs,
  refresh,
  get,
  update,
  create,
  getQuote,
  verifyBOM,
};
