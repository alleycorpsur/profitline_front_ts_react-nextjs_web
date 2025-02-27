import config from "@/config";
import { ISendOtpResponse, IValidateOtpResponse } from "@/types/externalAuth/externalAuth";
import { API } from "@/utils/api/api";

export const sendOtp = async (email: string): Promise<ISendOtpResponse> => {
  try {
    const response: ISendOtpResponse = await API.post(`${config.API_HOST}/email-otp`, {
      email
    });

    return response;
  } catch (error) {
    console.warn("error sending otp: ", error);
    return error as any;
  }
};

export const validateOtp = async (email: string, otp: string): Promise<IValidateOtpResponse> => {
  try {
    const response: IValidateOtpResponse = await API.post(`${config.API_HOST}/email-otp/validate`, {
      email,
      otp
    });

    return response;
  } catch (error) {
    console.warn("error sending otp: ", error);
    return error as any;
  }
};
