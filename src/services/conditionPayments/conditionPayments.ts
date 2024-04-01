import config from "@/config";
import { IConditionPayments } from "@/types/conditionPayments/conditionPayments";
import { getIdToken } from "@/utils/api/api";
import axios from "axios";

export const getAllConditionPayments = async (): Promise<IConditionPayments> => {
  const token = await getIdToken();
  try {
    const response: IConditionPayments = await axios.get(
      `${config.API_HOST}/client/condition-payments`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response);

    return response;
  } catch (error) {
    return error as any;
  }
};
