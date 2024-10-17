import { GenericResponse } from "@/types/global/IGlobal";
import { API } from "@/utils/api/api";
import { ISingleBank } from "@/types/banks/IBanks";

export const getPaymentDetail = async (payment_id: number) => {
  try {
    const response: GenericResponse<ISingleBank[]> = await API.get(
      `/bank/get-payment-detail?payment_id=${payment_id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener el detalle del pago:", error);
    return [];
  }
};
