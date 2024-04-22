import axios from "axios";
import CryptoJS from "crypto-js";
import kountSDK from "@kount/kount-web-client-sdk";
import { v4 as uuidv4 } from "uuid";

export const getAge = (dateString) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Encrypt = (cipher) => {
  const PUBLICK_KEY = "AC2d27e9ad2978d70ffb5637ce05542073";
  // Decrypt
  if (cipher) {
    const ciphercard = CryptoJS.AES.encrypt(cipher, PUBLICK_KEY).toString();
    return ciphercard;
  }
};

const getUtcTime = async () => {
  try {
    const response = await axios.get(
      "https://worldtimeapi.org/api/timezone/Etc/UTC"
    );
    return response.data.utc_datetime;
    // const utcDatetimeStr = response.data.utc_datetime;
    // const utcDatetime = new Date(utcDatetimeStr);
    // return utcDatetime;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

export const validateToken = async () => {
  try {
    const utcDtTime = await getUtcTime();
    console.log("utcDtTime=====>", utcDtTime);
    // const getPass = new Date().toISOString();
    const newDt = new Date(utcDtTime).getTime();
    const base64Credentials = btoa(`scr@@ze:${newDt}`);
    const crd = Encrypt(base64Credentials);
    const authHeader = `Basic ${crd}`;
    return authHeader;
  } catch (error) {
    console.log("error", error);
  }
};

export const getDDC = () => {
  const sessionID = uuidv4().replace(/-/g, "");
  console.log("sessionID", sessionID);
  // const sessionID = 'ghghghg';
  const kountConfig = {
    clientID: "102119",
    environment: "TEST",
    isSinglePageApp: true,
  };
  const sdk = kountSDK(kountConfig, sessionID);
  console.log("sdk", sdk);
  console.log("sdk", sdk?.sessionID);

  if (sdk) {
    console.log("Anti-fraud SDK activated!");
    return sdk;
    // Any non-blocking post-initialization logic can go here
  }
};
