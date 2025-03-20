"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Table, Flex, Button, Typography } from "antd";
import { InputSelect } from "@/components/atoms/inputs/InputSelect/InputSelect";
import DrawerComponent from "../components/DrawerComponent/DrawerComponent";
import { useParams, useRouter } from "next/navigation";
import { IRequirement } from "../interfaces/FormData";
import { columns } from "./columns";
import Container from "@/components/atoms/Container/Container";
import { GenerateActionButton } from "@/components/atoms/GenerateActionButton";
import { CaretLeft } from "phosphor-react";
import { ModalGenerateAction } from "../components/ModalGenerateAction";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { InputNumber } from "@/components/atoms/inputs/InputNumber/InputNumber";
import { API } from "@/utils/api/api";
import { FieldError } from "react-hook-form";
import "./form.scss";

const { Text } = Typography;

export const OPTIONS_BASE_LOCATION = [
  { value: 0, label: "Centro A" },
  { value: 1, label: "Centro B" },
  { value: 2, label: "Centro C" },
  { value: 3, label: "Centro D" }
];

export const OPTIONS_TYPE_CLIENTS = [
  { value: 1, label: "Cliente industrial" },
  { value: 2, label: "Persona natural" },
  { value: 3, label: "Cliente internacional" },
  { value: 4, label: "Empresa" }
];

export enum UserType {
  ADMIN = "admin",
  CLIENT = "client",
  APPROVER = "approver"
}

interface Props {
  userType: string;
  clientTypeId: number;
}

interface FormField {
  documentTypeId: number;
  formFieldType: "TEXT" | "SC" | "MC" | "NUMBER";
  question: string;
  description: string;
  options?: {
    opions: Array<{ label: string; value: number }>;
  };
  isRequired: number;
}

interface Document {
  id: number;
  name: string;
  templateUrl: string | null;
  documentType: string;
  description?: string;
  createdAt: string | null;
  expiryDate: string | null;
  statusName: string;
  statusColor: string;
  url: string | null;
  requirementId?: number;
  approvers?: string[];
  type?: string;
  events?: any[];
  files?: any[];
  uploadedAt?: string;
}

interface ApiResponse {
  status: number;
  message: string;
  id: number;
  name: string;
  documentNumber: number;
  documentType: number;
  documents: Document[];
  forms: Document[];
  creationForms: Array<{
    id: number;
    name: string;
    templateUrl: string | null;
    documentType: string;
    validity: string | null;
    subjectTypeId: string | null;
    subjectSubtypeId: number | null;
    documentTypeId: number;
    isMandatory: number;
    isAvailable: number;
    url: string | null;
    statusName: string;
    statusColor: string;
    statusId: string;
    fields: Array<{
      documentTypeId: number;
      formFieldType: "TEXT" | "SC" | "MC" | "NUMBER";
      question: string;
      description: string;
      options?: {
        opions: Array<{
          label: string;
          value: number;
        }>;
      };
      isRequired: number;
    }>;
  }>;
}

const SupplierForm: React.FC<Props> = ({ userType, clientTypeId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<any>({
    defaultValues: {},
    disabled: false
  });

  const params = useParams();
  const router = useRouter();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [requirementIndex, setRequirementIndex] = useState<number | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalGenerateActionVisible, setModalGenerateActionVisible] = useState(false);

  const handleOpenDrawer = () => setDrawerVisible(true);
  const handleCloseDrawer = () => setDrawerVisible(false);
  const handleCloseModal = () => setModalGenerateActionVisible(false);
  const handleOpenModal = () => setModalGenerateActionVisible(true);
  const handleGoBack = () => router.back();

  const supplierId = params?.id;

  const fetchSupplierData = async () => {
    try {
      const response = await API.get<ApiResponse>(`/subject/${supplierId}`);
      const { data } = response;
      if (data.creationForms?.[0]?.fields) {
        setFormFields(data.creationForms[0].fields);
      }
      const allDocuments = [...(data.forms || []), ...(data.documents || [])];
      setDocuments(allDocuments);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };
  useEffect(() => {
    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId]);

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const renderFormField = (field: FormField) => {
    const fieldName = field.question.toLowerCase().replace(/\s+/g, "_");

    const commonProps = {
      titleInput: field.question,
      placeholder: `Ingresar ${field.description.toLowerCase()}`,
      control: control,
      nameInput: fieldName,
      error: errors?.[fieldName] as FieldError | undefined
    };

    switch (field.formFieldType) {
      case "TEXT":
        return <InputForm key={field.question} {...commonProps} typeInput={field.formFieldType} />;
      case "NUMBER":
        return <InputNumber key={field.question} {...commonProps} />;
      case "SC":
      case "MC":
        return (
          <InputSelect
            key={field.question}
            {...commonProps}
            options={
              field.options?.opions.map((opt) => ({
                value: opt.value,
                label: opt.label
              })) || []
            }
            loading={false}
            placeholder={`Seleccionar ${field.description.toLowerCase()}`}
          />
        );
      default:
        return null;
    }
  };

  const tableColumns = columns({ handleOpenDrawer, setRequirementIndex });

  const getHeaderTitle = () => {
    switch (userType) {
      case UserType.ADMIN:
        return (
          <Flex justify="space-between" align="center">
            <Button type="text" onClick={handleGoBack} icon={<CaretLeft size={"1.3rem"} />}>
              <Text
                strong
              >{`Crear ${OPTIONS_TYPE_CLIENTS.find((option) => option.value === clientTypeId)?.label}`}</Text>
            </Button>
            <GenerateActionButton onClick={handleOpenModal} />
          </Flex>
        );
      case UserType.CLIENT:
        return <></>;
      case UserType.APPROVER:
        return (
          <Flex justify="space-between" align="center">
            <Button type="text" onClick={handleGoBack} icon={<CaretLeft size={"1.3rem"} />}>
              <Text strong>Nuevo proveedor</Text>
            </Button>
            <GenerateActionButton onClick={handleOpenModal} />
          </Flex>
        );
      default:
        return "Nuevo proveedor";
    }
  };

  return (
    <div>
      <Container style={{ gap: 24 }}>
        {getHeaderTitle()}
        <Flex vertical gap={16}>
          <h3>Información General</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">{formFields.map((field) => renderFormField(field))}</div>
          </form>
        </Flex>
        <hr style={{ border: "1px solid #DDDDDD" }} />
        <Flex vertical gap={16}>
          <h3>Documentos</h3>
          <Table dataSource={documents} columns={tableColumns} rowKey="id" pagination={false} />
        </Flex>
      </Container>
      <DrawerComponent
        requirementIndex={requirementIndex as number}
        clientTypeId={2}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        requirement={
          {
            ...documents[requirementIndex as number],
            status: documents[requirementIndex as number]?.statusName || "Pendiente",
            type: documents[requirementIndex as number]?.documentType || "document"
          } as IRequirement
        }
        updateExpirationDate={(expiryDate: string) => {
          if (requirementIndex !== null) {
            const updatedDocuments = [...documents];
            updatedDocuments[requirementIndex] = {
              ...updatedDocuments[requirementIndex],
              expiryDate: expiryDate
            };
            setDocuments(updatedDocuments);
          }
        }}
        control={control}
        errors={errors}
      />

      <ModalGenerateAction isOpen={modalGenerateActionVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default SupplierForm;
