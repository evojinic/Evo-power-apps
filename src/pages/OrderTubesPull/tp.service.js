
// import authHeader from './authHeaderOrder';

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

const generate = async() => handleResponse(
  await gpi.get('tp/new', { headers: authHeader() }),
);
const get = async tpID => handleResponse(
  await gpi.get(`tp/${tpID}`, { headers: authHeader() }),
);
const update = async(tpID, data) => handleResponse(
  await gpi.put(`tp/${tpID}`, data, { headers: authHeader() }),
);
const create = async data => handleResponse(
  await gpi.post('tp/', data, { headers: authHeader() }),
);

export default {
  get,
  update,
  create,
  generate,
};
