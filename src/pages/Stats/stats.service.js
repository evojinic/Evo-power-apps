/* eslint-disable no-underscore-dangle */

import authHeader from '../../_helpers/authHeader';
import { gpi } from '../../_helpers/gpi';

const handleResponse = async response => {
  if (response.status !== 200) {
    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const getTransactions = async query => handleResponse(
  await gpi.get(`s/transactions?${query}`, { headers: authHeader() }),
);

export default {
  getTransactions,
};
