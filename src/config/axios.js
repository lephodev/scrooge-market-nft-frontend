import axios from 'axios';
import server from './keys';
import Cookies from 'js-cookie';

export const getToken = () => {
  const tokenData = Cookies.get('token') ? Cookies.get('token') : {};

  return tokenData;
};

export const getAuthorizationHeader = () => `Bearer ${getToken()}`;

export const marketPlaceInstance = () =>
  axios.create({
    baseURL: `${server}/api`,
    headers: { Authorization: getAuthorizationHeader() },
  });
