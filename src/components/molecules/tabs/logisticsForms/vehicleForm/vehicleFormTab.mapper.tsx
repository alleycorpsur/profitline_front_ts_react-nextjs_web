import { IVehicle, VihicleDetail, IFormVehicle, ICertificates } from "@/types/logistics/schema";
import { MessageInstance } from "antd/es/message/interface";
import Title from "antd/es/typography/Title";
import { SetStateAction } from "react";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";

export interface VehicleFormTabProps {
  idVehicleForm?: string;
  data?: VehicleData;
  disabled?: boolean;
  onEditVehicle?: () => void;
  onSubmitForm?: (data: any) => void;
  onActiveVehicle?: () => void;
  onDesactivateVehicle?: () => void;
  statusForm: "create" | "edit" | "review";
  params: {
    id: string;
    vehicleId: string;
  };
}

export type VehicleData = IVehicle & { licence?: string } & { documents?: ICertificates[] };

export interface FileObject {
  file: File;
  docReference?: string;
}

export const normalizeVehicleData = (data: any): any => {
  console.log(data);
  if (!data) return {};
  // Extract images and documents
  const images = data.images.map((image: any) => image.url_archive);
  const documents = data.documents.map((doc: any) => ({
    file: {
      name: doc.url_archive.split("/").pop(),
      url: doc.url_archive
    }
  }));

  return {
    general: {
      id: data.id.toString(),
      id_carrier: data.id_carrier.toString(),
      id_vehicle_type: data.id_vehicle_type.toString(),
      vehicle_type: "", // Add logic to fetch vehicle type if necessary
      plate_number: data.plate_number,
      brand: data.brand,
      line: data.line,
      model: data.model,
      year: data.year,
      color: data.color,
      country: data.country.toString(),
      aditional_info: data.aditional_info,
      gps_link: data.gps_link,
      gps_user: data.gps_user,
      gps_password: data.gps_password,
      active: data.active,
      created_at: new Date(data.created_at),
      created_by: data.created_by,
      modified_at: new Date(data.modified_at),
      modified_by: data.modified_by,
      company: "", // Add logic to fetch company name if necessary
      image1: images[0],
      image2: images[1],
      image3: images[2],
      image4: images[3],
      image5: images[4],
      IS_ACTIVE: data.active
    },
    image1: images[0] ? [{ file: new File([images[0]], images[0].split("/").pop()) }] : undefined,
    image2: images[1] ? [{ file: new File([images[1]], images[1].split("/").pop()) }] : undefined,
    image3: images[2] ? [{ file: new File([images[2]], images[2].split("/").pop()) }] : undefined,
    image4: images[3] ? [{ file: new File([images[3]], images[3].split("/").pop()) }] : undefined,
    image5: images[4] ? [{ file: new File([images[4]], images[4].split("/").pop()) }] : undefined,
    files: documents,
    IS_ACTIVE: data.active
  };
};

export const _onSubmitVehicle = (
  data: any,
  setloading: (value: SetStateAction<boolean>) => void,
  setImageError: (value: SetStateAction<boolean>) => void,
  imageFiles: { docReference: string; file: File }[],
  selectedFiles: DocumentCompleteType[],
  onSubmitForm: (data: any) => void,
  reset: UseFormReset<IFormVehicle>
) => {
  setloading(true);
  try {
    setImageError(false);
    onSubmitForm({...data, images: imageFiles, files: selectedFiles});
    reset(data);
    setloading(false);
  } catch (error) {
    console.warn({ error });
    setloading(false);
  }
};

export const validationButtonText = (statusForm: "create" | "edit" | "review") => {
  switch (statusForm) {
    case "create":
      return "Crear nuevo vehiculo";
    case "edit":
      return "Guardar Cambios";
    case "review":
      return "Editar vehiculo";
  }
};

export const TitleFormTab = (title: string, level: 1 | 2 | 5 | 3 | 4 | undefined) => {
  return (
    <Title className="title" level={level}>
      {title}
    </Title>
  );
};
