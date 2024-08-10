/* eslint-disable import/prefer-default-export */
import axios from 'axios';

// env broke somehow...
// console.log(process.env.NODE_ENV)
// console.log(process.env.VUE_APP_API)
let apiURL = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') { // eslint-disable-line no-process-env
  apiURL = 'https://gapi.lamons.com/';
}

export const gpi = axios.create({
  // baseURL: process.env.VUE_APP_API,
  baseURL: apiURL,
});
