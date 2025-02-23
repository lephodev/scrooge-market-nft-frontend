import { kycInstance } from "../config/axios.js";
import encryptPayload from "./eencryptPayload.js";

export const createKYC = async (requestData) => {
  try {
    const res = await (
      await kycInstance()
    ).post(`users/createKyc`, encryptPayload(requestData));
    return res;
  } catch (error) {
    console.log("Error in KYC brands api =>", error);
    return error.response.data;
  }
};

export const userKycDetails = async () => {
  try {
    const response = await (await kycInstance()).get(`users/getKycDetails`);
    console.info("get Kyc Details", response);
    return response.data;
  } catch (error) {
    console.info("error in deposit>>", error);
    return error?.response?.data;
  }
};

export const reApply = async () => {
  try {
    const response = await (await kycInstance()).get(`users/reApply`);
    console.info("get Kyc Details", response);
    return response.data;
  } catch (error) {
    console.info("error in deposit>>", error);
    return error?.response?.data;
  }
};

export const VerifySessions = async () => {
  try {
    const response = await (await kycInstance()).post(`users/veriffSessions`);
    console.info("get Kyc Details", response);
    return response.data;
  } catch (error) {
    console.info("error in deposit>>", error);
    return error?.response?.data;
  }
};

export const UpdateKycImage = async (requestData) => {
  try {
    const res = await (
      await kycInstance()
    ).post(`users/UpdateKycProofImage`, encryptPayload(requestData));
    return res;
  } catch (error) {
    console.log("Error in KYC brands api =>", error);
    return error.response.data;
  }
};
