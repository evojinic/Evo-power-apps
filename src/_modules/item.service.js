import line from './dropDowns/line';
import job from './dropDowns/job';
import product from './dropDowns/product';
import custom from './dropDowns/custom';
import charge from './dropDowns/charge';
import isoTube from './dropDowns/isoTube';
import isoSleeve from './dropDowns/isoSleeve';
import isoWasher from './dropDowns/isoWasher';
import retWasher from './dropDowns/retWasher';
import swSet from './dropDowns/swSet';
import gaskets from './dropDowns/gaskets';
import other from './dropDowns/other';
import spec from './dropDowns/spec';
// import sideOfBolts from './dropDowns/sideOfBolts';
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

const getItem = async(itemQ, query = '') => handleResponse(
  await gpi.get(`item/gApp/${itemQ}${query}`, { headers: authHeader() }),
);
const getItemPB = async(itemQ, query = '') => handleResponse(
  await gpi.get(`item/pb/${itemQ}${query}`, { headers: authHeader() }),
);
const getPriceAndCost = async(itemQ, query = '') => handleResponse(
  await gpi.get(`item/pAc/${itemQ}${query}`, { headers: authHeader() }),
);
const getItemVrBOM = async itemQ => handleResponse(
  await gpi.get(`item/vrBom/${itemQ}`, { headers: authHeader() }),
);
const getItemThumb = async itemQ => handleResponse(
  await gpi.get(`item/thumb/${itemQ}`, { headers: authHeader() }),
);
const getOptionsList = async name => {
  if (!name) return {};
  if (name === 'job') return job;
  if (name === 'line') return line;
  if (name === 'product') return product;
  // if (name === 'sideOfBolts') return sideOfBolts;
  if (name === 'custom') return custom;
  if (name === 'charge') return charge;
  if (name === 'isoTube') return isoTube;
  if (name === 'isoSleeve') return isoSleeve;
  if (name === 'isoWasher') return isoWasher;
  if (name === 'retWasher') return retWasher;
  if (name === 'other') return other;
  if (name === 'ik_swSet') return swSet;
  if (name === 'gaskets') return gaskets;
  if (name === 'spec') return spec;
  return handleResponse(await gpi.get(`item/list/${name}`, { headers: authHeader() }));
};
const getPackFromList = async body => handleResponse(
  await gpi.post('parcels/', body, { headers: authHeader() }),
);

const makeSugFastener = async data => handleResponse(
  await gpi.post('item/makeSugFastener', data, { headers: authHeader() }),
);
const matrix = async data => handleResponse(
  await gpi.post('item/matrix', data, { headers: authHeader() }),
);

export default {
  getItemPB,
  getItem,
  getPriceAndCost,
  getItemVrBOM,
  getItemThumb,
  getOptionsList,
  getPackFromList,
  makeSugFastener,
  matrix,
};
