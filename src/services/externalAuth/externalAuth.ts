import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { ISendOtpResponse, IValidateOtpResponse } from "@/types/externalAuth/externalAuth";
import { STORAGE_TOKEN } from "@/utils/constants/globalConstants";

export const sendOtp = async (email: string, token: string): Promise<ISendOtpResponse> => {
  try {
    const response: AxiosResponse<ISendOtpResponse> = await axios.post(
      `${config.API_HOST}/email-otp`,
      {
        email
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.warn("error sending otp: ", error);
    return error as any;
  }
};

export const validateOtp = async (
  email: string,
  otp: string,
  token: string
): Promise<IValidateOtpResponse> => {
  try {
    const response: AxiosResponse<IValidateOtpResponse> = await axios.post(
      `${config.API_HOST}/email-otp/validate`,
      {
        email,
        otp
      },
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `${token}`
        }
      }
    );
    await fetch("/api/auth", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${response.data.data.auth}`
      }
    }).then(async (response) => {
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem(STORAGE_TOKEN, data.data.token);
      }
    });

    return response.data;
  } catch (error) {
    console.warn("error sending otp: ", error);
    return error as any;
  }
};
