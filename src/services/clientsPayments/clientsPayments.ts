import config from "@/config";
import { IFormIdentifyPaymentModal } from "@/modules/clients/components/payments-tab/modal-identify-payment-action/modal-identify-payment-action";
import { IIdentifiedPayment } from "@/types/clientPayments/IClientPayments";
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
}

export const matchPayment = async ({ data, paymentId }: IMatchPayment) => {
  const modelData = {
    clientId: 1,
    accountId: data.account.value,
    paymentDate: data.date,
    amount: data.amount,
    userId: 1,
    evidence: data.evidence
  };

  const response: GenericResponse<IIdentifiedPayment> = await API.post(
    `${config.API_HOST}/bank/match-payment/${paymentId}`,
    modelData
  );

  return response;
};
