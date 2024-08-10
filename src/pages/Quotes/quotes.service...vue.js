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

const getUsersQuotes = async(user_id, status, skip = 0, limit = false) => {
  let query = `?status=${status}`;
  if (skip) query += `&skip=${skip}`;
  if (limit) query += `&limit=${limit}`;
  return handleResponse(
    await gpi.get(`u/${user_id}/q/${query}`, { headers: authHeader() }),
  );
};
const get = async quoteID => handleResponse(
  await gpi.get(`q/${quoteID}`, { headers: authHeader() }),
);
const stats = async userID => handleResponse(
  await gpi.get(`q/stats?user=${userID}`, { headers: authHeader() }),
);
const update = async(quoteID, data) => handleResponse(
  await gpi.put(`q/${quoteID}`, data, { headers: authHeader() }),
);
const create = async data => handleResponse(
  await gpi.post('q/', data, { headers: authHeader() }),
);
const verifyMaterial = async data => handleResponse(
  await gpi.put('q/verify', data, { headers: authHeader() }),
);
const verifyBOM = async data => handleResponse(
  await gpi.post('item/verifyBOM', data, { headers: authHeader() }),
);

export default {
  getUsersQuotes,
  get,
  stats,
  update,
  create,
  verifyMaterial,
  verifyBOM,
};
