/* eslint-disable no-undef */

import authHeader from '../../_helpers/authHeader';
import { gpi } from '../../_helpers/gpi';

const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
  localStorage.removeItem('dist');
  localStorage.removeItem('dp');
};

const handleResponse = async response => {
  if (response.status !== 200) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout();
      location.reload(true); // eslint-disable-next-line no-restricted-globals
    }

    const error = response.data && response.data.message || response.statusText;
    throw new Error(error);
  }
  return response.data;
};

const login = (username, password) => {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return gpi.post('login/', { username, password }, requestOptions)
    .then(res => {
      // login successful if there's a jwt token in the response
      if (res.data.token) {
        // store user details and jwt token in local storage
        // to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(res.data));
      }

      return res.data;
    });
};

const getAllUsers = async() => handleResponse(await gpi.get('u/list', { headers: authHeader() }));
const listRoles = async() => handleResponse(await gpi.get('u/roles', { headers: authHeader() }));
const getUser = async userID => handleResponse(await gpi.get(`u/${userID}`, { headers: authHeader() }));
const passwordReset = async userID => handleResponse(await gpi.put(`u/${userID}`, { resetPassword: true }, { headers: authHeader() }));
const updateUser = async(userID, data) => handleResponse(await gpi.put(`u/${userID}`, data, { headers: authHeader() }));
const createUser = async data => handleResponse(await gpi.post('u/', data, { headers: authHeader() }));

export default {
  login,
  logout,
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  passwordReset,
  listRoles,
};
