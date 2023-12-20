import CryptoJS from "crypto-js";

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

export const validateToken = () => {
  try {
    const getPass = new Date().toISOString();
    const newDt = new Date(getPass).getTime();
    const base64Credentials = btoa(`scr@@ze:${newDt}`);
    const crd = Encrypt(base64Credentials);
    const authHeader = `Basic ${crd}`;
    return authHeader;
  } catch (error) {
    console.log("error", error);
  }
};
