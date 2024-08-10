
import authHeader from '../_helpers/authHeader';
import { gpi } from '../_helpers/gpi';

const handleResponse = async response => {
  // console.log(response);
  if (response.status !== 200) {
    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const get = async(dropDown, query = '') => handleResponse(
  await gpi.get(dropDown + query, { headers: authHeader() }),
);

export default {
  get,
};
