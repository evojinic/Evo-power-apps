/* eslint-disable no-undef */

const headers = {
  // 'X-API-Key': '0gpys2KreP9CHJkeQKHtH3jSkvdCciMi1BCULN2j'
  'X-API-Key': 'Yrpyi8nCXR6lhocDnANzd56xQP2zF0vw8a3ObfG4',
};

export default function authHeader() {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return {
      ...headers,
      Authorization: user.token,
    };
  }
  return headers;
}
