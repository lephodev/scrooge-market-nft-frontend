import { kycInstance } from "../config/axios.js";

export const createKYC = async (requestData) => {
  try {
    const res = await kycInstance().post(`users/createKyc`, requestData);
    return res;
  } catch (error) {
    console.log("Error in KYC brands api =>", error);

    return error.response.data;
  }
};

export const userKycDetails = async () => {
  try {
    const response = await kycInstance().get(`users/getKycDetails`);
    console.info("get Kyc Details", response);
    return response.data;
  } catch (error) {
    console.info("error in deposit>>", error);
    return error?.response?.data;
  }
};

export const reApply = async () => {
  try {
    const response = await kycInstance().get(`users/reApply`);
    console.info("get Kyc Details", response);
    return response.data;
  } catch (error) {
    console.info("error in deposit>>", error);
    return error?.response?.data;
  }
};
