import axios from "axios";
import { server, scroogeServer, serverSlot } from "./keys.js";
import Cookies from "js-cookie";
import { validateToken } from "../utils/dateUtils.mjs";

export const getToken = () => {
  const tokenData = Cookies.get("token") ? Cookies.get("token") : {};

  return tokenData;
};

export const getAuthorizationHeader = async () => {
  const basicAuthToken = await validateToken();
  return basicAuthToken;
};

export const marketPlaceInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${server}/api`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
};

export const kycInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${scroogeServer}/v1`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
};

export const authInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${scroogeServer}/v1`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
};

export const relaxGamingInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${serverSlot}/api/relaxgaming`,
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
};

export const bGamingInstance = async () => {
  const token = await getAuthorizationHeader();
  return axios.create({
    baseURL: `${serverSlot}/api/bgaming`, /// api/bgaming
    headers: {
      Authorization: token,
      "Permissions-Policy": "geolocation=*",
    },
    withCredentials: true,
    credentials: "include",
  });
};
