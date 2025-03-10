import config from "@/config";
import { API } from "@/utils/api/api";

import {
  IFormIdentifyPaymentModal,
  IIdentifiedPayment
} from "@/types/clientPayments/IClientPayments";
import { GenericResponse } from "@/types/global/IGlobal";

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

interface IIdentifyPaymentProp {
  accountId: string;
  paymentDate: string;
  amount: number;
}

export const identifyPayment = async ({ accountId, paymentDate, amount }: IIdentifyPaymentProp) => {
  try {
    const response: GenericResponse<IIdentifiedPayment> = await API.get(
      `${config.API_HOST}/bank/identify-payment?accountId=${accountId}&paymentDate=${paymentDate}&amount=${amount}`
    );

    if (response.status === 200) {
      return response;
    } else {
      // This is when return a 204 status code
      // And no response is received
      return 0;
    }
  } catch (error) {
    console.error("Error in identifyPayment:", error);
    throw error;
  }
};

interface IMatchPayment {
  data: IFormIdentifyPaymentModal;
  paymentId: number;
  clientId: string;
}

export const matchPayment = async ({ data, paymentId, clientId }: IMatchPayment) => {
  const modelData = {
    clientId,
    accountId: data.account?.value,
    paymentDate: data.date?.format("YYYY-MM-DD"),
    amount: data.amount,
    evidence: data.evidence
  };

  const formData = new FormData();
  for (const key in modelData) {
    formData.append(key, modelData[key as keyof typeof modelData] as any);
  }

  try {
    const response: GenericResponse<any> = await API.post(
      `${config.API_HOST}/bank/match-payment/${paymentId}`,
      formData
    );

    return response;
  } catch (error) {
    console.error("Error in matchPayment:", error);
    throw error;
  }
};
