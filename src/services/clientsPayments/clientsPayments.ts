import config from "@/config";
import { GenericResponse } from "@/types/global/IGlobal";
import { API } from "@/utils/api/api";

interface IAccount {
  id: number;
  account_number: string;
  description: string;
  type_account: string;
  bank_name: string;
}

export const getAccountsByProject = async (projectId: number = 157) => {
  const response: GenericResponse<IAccount[]> = await API.get(
    `${config.API_HOST}/bank/accounts/${projectId}`
  );
  return response.data;
};

interface ISelectPayment {
  id: number;
  name: string;
}
export const getPaymentTypes = async () => {
  const response: GenericResponse<ISelectPayment[]> = await API.get(
    `${config.API_HOST}/bank/payment-types`
  );
  return response.data;
};
