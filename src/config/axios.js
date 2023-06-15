import axios from 'axios';
import { server, scroogeServer } from './keys.js';
import Cookies from 'js-cookie';

export const getToken = () => {
  const tokenData = Cookies.get('token') ? Cookies.get('token') : {};

  return tokenData;
};

export const getAuthorizationHeader = () => `Bearer ${getToken()}`;

export const marketPlaceInstance = () =>
  axios.create({
    baseURL: `${server}/api`,
    headers: {
       Authorization: getAuthorizationHeader(),
       "Permissions-Policy": "geolocation=*",
      },
  });

export const kycInstance = () =>
  axios.create({
    baseURL: `${scroogeServer}/v1`,
    headers: { 
      Authorization: getAuthorizationHeader(),
      "Permissions-Policy": "geolocation=*",
    },
  });

export const authInstance = () =>
  axios.create({
    baseURL: `${scroogeServer}/v1`,
    headers: {
       Authorization: getAuthorizationHeader(),
       "Permissions-Policy": "geolocation=*",
      },
  });
