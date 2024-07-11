import { FileObject } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import { IBillingPeriodForm } from "@/types/billingPeriod/IBillingPeriod";
import { IDriver, IFormDriver } from "@/types/logistics/schema";
import { IFormProject } from "@/types/projects/IFormProject";
import { IProject } from "@/types/projects/IProject";
import { formatDateBars } from "@/utils/utils";
import Title from "antd/es/typography/Title";
import { SetStateAction } from "react";
import { UseFormReset, UseFormSetValue } from "react-hook-form";

export interface DriverFormTabProps {
  idProjectForm?: string;
  data?: IDriver[];
  disabled?: boolean;
  onEditProject?: () => void;
  onSubmitForm?: (data: any) => void;
  onActiveProject?: () => void;
  onDesactivateProject?: () => void;
  statusForm: "create" | "edit" | "review";
}

export const dataToProjectFormData = (data: IDriver): IFormDriver => {
  console.log(data.birth_date)
  return {
    general: {
      id: data.id,
      phone: data.phone,
      email: data.email,
      document_type: data.document_type,
      document: data.document,
      license: data.license,
      license_category: data.license_category,
      license_expiration: data.license_expiration,
      name: data.name,
      last_name: data.last_name,
      emergency_number: data.emergency_number,
      emergency_contact: data.emergency_contact,
      active: data.active,
      created_at: data.created_at,
      created_by: data.created_by,
      company: data.company,
      rh: data.rh,
      glasses: data.glasses,
      birth_date: data.birth_date,
    }
  };
};

export const _onSubmit = (
  data: any,
  setloading: (value: SetStateAction<boolean>) => void,
  setImageError: (value: SetStateAction<boolean>) => void,
  imageFile: FileObject[] | undefined,
  files: FileObject[] | undefined,
  onSubmitForm: (data: any) => void,
  reset: UseFormReset<IFormDriver>
) => {
  setloading(true);
  try {
    if (!imageFile) return setImageError(true);
    setImageError(false);
    onSubmitForm({ ...data, logo: imageFile, files });
    reset(data);
    setloading(false);
  } catch (error) {
    console.warn({ error });
    setloading(false);
  }
};

export const effectFunction = (
  generalDSOCurrentlyYear: string,
  setValue: UseFormSetValue<IFormProject>,
  billingPeriod: IBillingPeriodForm | undefined
) => {
  if (generalDSOCurrentlyYear === "Sí") {
    setValue("general.DSO_days", undefined);
  }
  if (billingPeriod) setValue("general.billing_period", JSON.stringify(billingPeriod));
};

export const validationButtonText = (statusForm: "create" | "edit" | "review") => {
  switch (statusForm) {
    case "create":
      return "Crear nuevo conductor";
    case "edit":
      return "Guardar Cambios";
    case "review":
      return "Editar conductor";
  }
};

export const TitleFormTab = (title: string, level: 1 | 2 | 5 | 3 | 4 | undefined) => {
  return (
    <Title className="title" level={level}>
      {title}
    </Title>
  );
};