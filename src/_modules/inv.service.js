
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

const getInv = async itemQ => handleResponse(
  await gpi.get(`inv/${itemQ}`, { headers: authHeader() }),
);
const getReorder = async() => handleResponse(
  await gpi.get('inv/reorder', { headers: authHeader() }),
);
const getShort = async() => handleResponse(
  await gpi.get('inv/short', { headers: authHeader() }),
);
const getNegatives = async() => handleResponse(
  await gpi.get('inv/neg', { headers: authHeader() }),
);
const getInvList = async partList => handleResponse(
  await gpi.get(`inv/${encodeURIComponent(JSON.stringify(partList))}`, { headers: authHeader() }),
);
// const post = async data => handleResponse(
//   await gpi.post(`inv/${data}`, { headers: authHeader() }),
// );

export default {
  getInv,
  getReorder,
  getShort,
  getNegatives,
  getInvList,
  // post,
};
