import axios from 'axios';
<<<<<<< HEAD
import server from './keys';
=======
import { server } from './keys.js';
>>>>>>> 2b4a8785b5a025ed54716dac29ca6c171b45344f
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
