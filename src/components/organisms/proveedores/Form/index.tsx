"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Table, Flex, Button, Typography } from "antd";
import { InputSelect } from "@/components/atoms/inputs/InputSelect/InputSelect";
import DrawerComponent from "../components/DrawerComponent/DrawerComponent";
import { useParams, useRouter } from "next/navigation";
import { IRequirement, RequirementType, Status, SupplierFormValues } from "../interfaces/FormData";
import { columns } from "./columns";
import { mockedSupplierFormValues } from "./mocked";
import Container from "@/components/atoms/Container/Container";
import { GenerateActionButton } from "@/components/atoms/GenerateActionButton";
import { CaretLeft } from "phosphor-react";
import { ModalGenerateAction } from "../components/ModalGenerateAction";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

const { Text } = Typography;

export const OPTIONS_BASE_LOCATION = [
  { value: 0, label: "Centro A" },
  { value: 1, label: "Centro B" },
  { value: 2, label: "Centro C" },
  { value: 3, label: "Centro D" }
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
export const OPTIONS_TYPE_CLIENTS = [
  { value: 1, label: "Cliente industrial" },
  { value: 2, label: "Persona natural" },
  { value: 3, label: "Cliente internacional" },
  { value: 4, label: "Empresa" }
];
const SupplierForm: React.FC<Props> = ({ userType, clientTypeId }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<SupplierFormValues>({
    defaultValues: {
      companyName: "",
      documentNumber: "",
      documentType: "",
      legalRepresentative: "",
      supplierType: "",
      country: "",
      department: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      economicActivity: "",
      requirements: []
    },
    disabled: false
    // resolver: yupResolver(validationSchema)
  });
  const { fields, append, update } = useFieldArray({
    control,
    name: "requirements"
  });

  const params = useParams();
  const router = useRouter();
  // Simula la API que devuelve los requerimientos según clientTypeId
  React.useEffect(() => {
    // Llamar a la API para obtener los requerimientos según clientTypeId
    const fetchRequirements = async () => {
      const apiRequirements: IRequirement[] = [
        {
          id: 1,
          requirementId: 1,
          name: "Requirement 1",
          description: "First requirement description",
          validity: "2025-12-31",
          approvers: ["Manager"],
          type: RequirementType.document,
          status: Status.Pendiente,
          events: [],
          files: [],
          uploadedAt: ""
        },
        {
          id: 2,
          requirementId: 2,
          name: "Requirement 2",
          description: "Second requirement description",
          validity: "2026-01-01",
          approvers: ["Supervisor"],
          type: RequirementType.form,
          status: Status.Vigente,
          events: [],
          files: [],
          uploadedAt: ""
        }
      ];
      apiRequirements.forEach((req) => append(req));
    };

    fetchRequirements();
  }, [clientTypeId, append]);

  const handleGoBack = () => {
    router.back();
  };

  const supplierId = params?.id;
  //const userType = params?.type;
  console.log(params);
  const [requirementIndex, setRequirementIndex] = useState<number | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalGenerateActionVisible, setModalGenerateActionVisible] = useState(false);

  const handleOpenDrawer = () => setDrawerVisible(true);
  const handleCloseDrawer = () => setDrawerVisible(false);
  const handleCloseModal = () => setModalGenerateActionVisible(false);
  const handleOpenModal = () => setModalGenerateActionVisible(true);

  const tableColumns = columns({ handleOpenDrawer, setRequirementIndex });

  const fetchSupplierData = async () => {
    try {
      //const response = await axios.get(`/api/suppliers/${id}`);
      const supplierData = mockedSupplierFormValues;
      reset(supplierData); // Llenar el formulario con los datos obtenidos
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierData(); // Cargar datos si `supplierId` está definido
    }
  }, [supplierId]);

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  // const addFile = (index: number, file: File) => {
  //   update(index, { files: [...fields[index].files, file] });
  // };
  // const removeFile = (index: number, file: File) => {
  //   update(index, { files: fields[index].files.filter((f) => f !== file) });
  // };

  console.log("fields", fields);
  // const requirements = watch("requirements");
  //console.log(requirements);
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              <InputForm
                titleInput="Razón social"
                placeholder="Ingresar razón social"
                control={control}
                nameInput="companyName"
                error={errors?.companyName ?? undefined}
              />
              <InputForm
                titleInput="No. de documento"
                placeholder="Ingresar no. de documento"
                control={control}
                nameInput="documentNumber"
                error={errors?.documentNumber}
              />
              <InputSelect
                titleInput="Tipo de documento"
                nameInput="documentType"
                control={control}
                error={errors?.documentType}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar tipo de documento"
              />
              <InputForm
                titleInput="Nombre de representante legal"
                placeholder="Ingresar nombre"
                control={control}
                nameInput="legalRepresentative"
                error={errors?.legalRepresentative}
              />
              <InputSelect
                titleInput="Tipo de proveedor"
                nameInput="supplierType"
                control={control}
                error={errors?.supplierType}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar tipo de empresa"
              />
              <InputSelect
                titleInput="País"
                nameInput="country"
                control={control}
                error={errors?.country}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar país"
              />
              <InputSelect
                titleInput="Departamento"
                nameInput="department"
                control={control}
                error={errors?.department}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar departamento"
              />
              <InputSelect
                titleInput="Ciudad"
                nameInput="city"
                control={control}
                error={errors?.city}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar ciudad"
              />
              <InputForm
                titleInput="Dirección de entrega"
                placeholder="Ingresar dirección"
                control={control}
                nameInput="address"
                error={errors?.address}
              />
              <InputForm
                titleInput="Teléfono"
                placeholder="Ingresar teléfono"
                control={control}
                nameInput="phone"
                error={errors?.phone}
              />
              <InputForm
                titleInput="Correo electrónico"
                placeholder="Ingresar correo electrónico"
                control={control}
                nameInput="email"
                error={errors?.email}
              />
              <InputSelect
                titleInput="Actividad económica"
                nameInput="economicActivity"
                control={control}
                error={errors?.economicActivity}
                options={OPTIONS_BASE_LOCATION}
                loading={false}
                placeholder="Seleccionar actividad económica"
              />
            </div>
          </form>
        </Flex>
        <hr style={{ border: "1px solid #DDDDDD" }} />
        <Flex vertical gap={16}>
          <h3>Documentos</h3>
          <Table dataSource={fields} columns={tableColumns} rowKey="id" pagination={false} />
        </Flex>
      </Container>
      <DrawerComponent
        requirementIndex={requirementIndex as number}
        clientTypeId={2}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        requirement={
          fields[requirementIndex as number] ?? null // Obtenemos el requerimiento seleccionado
        }
        updateExpirationDate={(expirationDate: string) => {
          if (requirementIndex !== undefined) {
            update(requirementIndex as number, {
              ...fields[requirementIndex as number],
              expirationDate
            }); // Actualiza el requerimiento en el formulario
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
