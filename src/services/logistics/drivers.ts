import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { API } from "@/utils/api/api";
import { IDriver, IListData } from "@/types/logistics/schema";
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
    const response: IListData = await axios.get(`${config.API_HOST}/driver/driver/${id}`, {
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

export const updateDriver = async (data: IDriver): Promise<IListData> => {
  try {
    const response: IListData = await axios.put(`${config.API_HOST}/driver/update`, data, {
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

export const addDriver = async (
  data: IDriver,
  logo: FileObject[],
  files: DocumentCompleteType[]
): Promise<AxiosResponse<any, any>> => {
  try {
    const form = new FormData();
    const body: any = data;
    body.logo = logo.map((file: any) => ({
      docReference: file.docReference,
      uid: file?.file?.uid
    }));
    const expiration = files.find(f=>!f.expirationDate && f.expiry);
    if(expiration){
      throw new Error(`El documento ${expiration.description} debe tener una fecha de vencimiento`);
    }
    body.files = files
    form.append("body", JSON.stringify({...body, rh: body.rhval as any}));
    form.append("logo", logo[0].file as unknown as File);
    files.forEach((file) => {
      if (!file.file) throw new Error(`No se puedo cargar el archivo ${file.description}`);
      form.append(`file-for-${file.id}`, file.file);
    });
    const response = await axios.post(`${config.API_HOST}/driver/create`, form, {
      headers: {
        "content-type": "multipart/form-data",
        Accept: "application/json, text/plain, */*"
      }
    });
    return response;
  } catch (error) {
    console.log("Error get Driver: ", error);
    throw error as any;
  }
};
