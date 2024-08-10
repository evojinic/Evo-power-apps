/* eslint-disable no-underscore-dangle */

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

const getList = async() => handleResponse(
  await gpi.get('ps/list', { headers: authHeader() }),
);
const loadPS = async itemQ => handleResponse(
  await gpi.get(`ps/${itemQ}`, { headers: authHeader() }),
);
const savePS = async data => handleResponse(
  await gpi.put(`ps/${data._id}`, data, { headers: authHeader() }),
);

export default {
  getList,
  loadPS,
  savePS,
};
