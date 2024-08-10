/* eslint-disable no-undef */

import authHeader from '../../_helpers/authHeader';
import { gpi } from '../../_helpers/gpi';

const handleResponse = async response => {
  if (response.status !== 200) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout();
      // eslint-disable-next-line no-restricted-globals
      location.reload(true);
    }

    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const getDist = async distTag => handleResponse(await gpi.get(`d/${distTag}`, { headers: authHeader() }));
const createDist = async data => handleResponse(await gpi.post('d/', data, { headers: authHeader() }));
const updateDist = async data => handleResponse(await gpi.put(`d/${data.tag}`, data, { headers: authHeader() }));
const getDistList = async() => handleResponse(await gpi.get('d/list', { headers: authHeader() }));

export default {
  getDistList,
  getDist,
  updateDist,
  createDist,
};
