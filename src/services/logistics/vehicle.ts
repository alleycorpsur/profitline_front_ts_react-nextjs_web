import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { IVehicle, IListDataVehiche, IListDataVehicheDetail } from "@/types/logistics/schema";
import { API } from "@/utils/api/api";
import { GenericResponse } from "@/types/global/IGlobal";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";
import { FileObject } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";

export const getAllVehicles = async ({ id }: { id: string }): Promise<any[]> => {
  const response: GenericResponse<any[]> = await API.get(`/vehicle/provider/${id}`);
  if (response.success) return response.data;
  else throw response;
};

export const getVehicleType = async (): Promise<IListDataVehiche> => {
  try {
    const response: AxiosResponse<IListDataVehiche> = await axios.get(
      `${config.API_HOST}/vehicle/type`,
      {
        headers: {
          Accept: "application/json, text/plain, */*"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error get vehicle vehicles: ", error);
    return error as any;
  }
};

export const getVehicleById = async (id: string): Promise<IListDataVehicheDetail> => {
  try {
    const response: AxiosResponse<IListDataVehicheDetail> = await axios.get(
      `${config.API_HOST}/vehicle/${id}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*"
        }
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log("Error get vehicle vehicles: ", error);
    return error as any;
  }
};

export const addVehicle = async (
  data: IVehicle,
  imageFiles: FileObject[],
  files: DocumentCompleteType[]
): Promise<AxiosResponse<any, any>> => {
  try {
    const form = new FormData();
    const body: any = { ...data };

    if (!imageFiles.some((file) => file.file)) {
      throw new Error("At least one image file is required.");
    }

    body.images = imageFiles.map((file: any, index) => ({
      docReference: file.docReference || `imagen${index + 1}`,
      uid: file?.file?.uid
    }));

    const expiration = files.find(f => !f.expirationDate && f.expiry);
    if (expiration) {
      throw new Error(`El documento ${expiration.description} debe tener una fecha de vencimiento`);
    }

    body.files = files;

    form.append("body", JSON.stringify(body));

    imageFiles.forEach((file: FileObject, index: number) => {
      if (file.file) {
        form.append(`image${index + 1}`, file.file);
      } else {
        console.warn(`Image ${index + 1} is undefined.`);
      }
    });

    files.forEach((file) => {
      if (file.file) {
        form.append(`file-for-${file.id}`, file.file);
      } else {
        console.warn(`File with id ${file.id} is undefined.`);
      }
    });

    const response = await axios.post(`${config.API_HOST}/vehicle/create`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json, text/plain, */*"
      }
    });
    return response;
  } catch (error) {
    console.log("Error creating vehicle: ", error);
    throw error as any;
  }
};
