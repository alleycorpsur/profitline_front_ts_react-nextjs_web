import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { API } from "@/utils/api/api";
import { IFormGeneralDriver, IListData } from "@/types/logistics/schema";
import { FileObject } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import { GenericResponse } from "@/types/global/IGlobal";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";

export const getAllDrivers = async ({ providerId }: { providerId: number }): Promise<any[]> => {
  const response: GenericResponse<any[]> = await API.get(`/driver/provider/${providerId}`);
  if (response.success) return response.data;
  throw response;
};

export const getDriverById = async (id: string): Promise<IListData> => {
  try {
    const response: IListData = await axios.get(`${config.API_HOST}/driver/${id}`, {
      headers: {
        Accept: "application/json, text/plain, */*"
      }
    });
    return response;
  } catch (error) {
    console.log("Error get Driver: ", error);
    return error as any;
  }
};
export const createDriverForm = (
  generalData: IFormGeneralDriver,
  logo: FileObject[],
  files: DocumentCompleteType[]
) => {
  const form = new FormData();
  const body: any = generalData;

  body.logo = logo
    ? logo.map((file: any) => ({
        docReference: file.docReference,
        uid: file?.file?.uid
      }))
    : undefined;

  const expiration = files.find((f) => !f.expirationDate && f.expiry);

  if (expiration) {
    throw new Error(`El documento ${expiration.description} debe tener una fecha de vencimiento`);
  }

  body.files = files;
  form.append("body", JSON.stringify({ ...body, rh: body.rhval as any }));
  logo && form.append("logo", logo[0].file as unknown as File);

  files.forEach((file) => {
    if (file.file) {
      form.append(`file-for-${file.id}`, file.file);
    } else {
      console.warn(`File with id ${file.id} is undefined.`);
    }
  });
  return form;
};

export const updateDriver = async (
  generalData: IFormGeneralDriver,
  logo: FileObject[],
  files: DocumentCompleteType[]
): Promise<AxiosResponse<any, any>> => {
  try {
    const form = createDriverForm(generalData, logo, files);
    const response = await axios.put(`${config.API_HOST}/driver/update`, form, {
      headers: {
        Accept: "application/json, text/plain, */*"
      }
    });
    return response;
  } catch (error) {
    console.log("Error update Driver: ", error);
    return error as any;
  }
};

export const addDriver = async (
  generalData: IFormGeneralDriver,
  logo: FileObject[],
  files: DocumentCompleteType[]
): Promise<AxiosResponse<any, any>> => {
  try {
    const form = createDriverForm(generalData, logo, files);
    const response = await axios.post(`${config.API_HOST}/driver/create`, form, {
      headers: {
        "content-type": "multipart/form-data",
        Accept: "application/json, text/plain, */*"
      }
    });
    return response;
  } catch (error: any) {
    let errorMsg;
    if (error instanceof Error) {
      errorMsg = error?.message;
    } else errorMsg = "Error al crear el conductor";
    throw new Error(errorMsg);
  }
};

export const updateDriverStatus = async (
  id: string,
  status: boolean
): Promise<AxiosResponse<any, any>> => {
  const response: GenericResponse = await API.put(`/driver/update-status/${id}`, {
    status
  });
  if (response.success) return response.data;
  throw new Error(response.message || "Error al actualizar el estado del conductor");
};
