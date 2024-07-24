import { GenericResponse } from "@/types/global/IGlobal";
import { CertificateType } from "@/types/logistics/certificate/certificate";
import { API } from "@/utils/api/api";

export const getDocumentsByEntityType = async (
  entityType: string = "1"
): Promise<CertificateType[]> => {
  try {
    const response: GenericResponse<CertificateType[]> = await API.get(
      `/certificate/documentsentity/${entityType}`
    );
    return response.data;
  } catch (error) {
    console.log("Error get Certificates: ", error);
    return error as any;
  }
};
