import { Dispatch, SetStateAction, useState } from "react";
import { Button, Flex, Input, Typography } from "antd";
import { useForm } from "react-hook-form";
import {
  ArrowLineDown,
  ArrowLineUp,
  ArrowsClockwise,
  CaretLeft,
  Pencil,
  Plus
} from "phosphor-react";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import { DividerCustom } from "@/components/atoms/DividerCustom/DividerCustom";
import { ShipToProjectTable } from "@/components/molecules/tables/ShipToProjectTable/ShipToProjectTable";

import { ModalUploadDocument } from "@/components/molecules/modals/ModalUploadDocument/ModalUploadDocument";
import { ModalTimeFacturaction } from "@/components/molecules/modals/ModalTimeFacturaction/ModalTimeFacturaction";
import { ModalCreateShipTo } from "@/components/molecules/modals/ModalCreateShipTo/ModalCreateShipTo";
import { ModalStatusClient } from "@/components/molecules/modals/ModalStatusClient/ModalStatusClient";
import { ModalRemove } from "@/components/molecules/modals/ModalRemove/ModalRemove";

import "./clientprojectform.scss";

const { Title } = Typography;

export type ClientType = {
  infoClient: {
    typeOfDocument: "NIT" | "Cedula" | "Pasaporte";
    idDocument: string;
    socialReason: string;
    companyName: string;
    typeOfClient: "NIT" | "Cedula" | "Pasaporte";
    holding: "NIT" | "Cedula" | "Pasaporte";
    phone: string;
    email: string;
    city: string;
    risk: string;
    periodBilling: string;
    typeRadication: string;
    conditionPay: string;
    address: string;
  };
};

interface Props {
  isViewDetailsClient: {
    active: boolean;
    id: number;
  };
  onGoBackTable: () => void;
  setIsViewDetailsClient: Dispatch<
    SetStateAction<{
      active: boolean;
      id: number;
    }>
  >;
}
export const ClientProjectForm = ({ onGoBackTable, isViewDetailsClient }: Props) => {
  const [isCreateShipTo, setIsCreateShipTo] = useState(false);
  const [isUploadDocument, setIsUploadDocument] = useState(false);
  const [isTimeFacturaction, setIsTimeFacturaction] = useState(false);
  const [isModalStatus, setIsModalStatus] = useState({ status: false, remove: false });

  const [isEditAvailable, setIsEditAvailable] = useState(isViewDetailsClient?.active);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ClientType>({
    defaultValues: {},
    disabled: isEditAvailable
  });

  const onSubmitHandler = () => {};

  return (
    <>
      <form className="newClientProjectForm" onSubmit={handleSubmit(onSubmitHandler)}>
        <Flex vertical style={{ height: "100%" }}>
          <Flex component={"header"} className="headerNewUserProyectsForm">
            {/* -------------------left buttons------------------------ */}
            <Button
              type="text"
              size="large"
              onClick={onGoBackTable}
              className="buttonGoBack"
              icon={<CaretLeft size={"1.45rem"} />}
            >
              Ver Clientes
            </Button>
            {isViewDetailsClient?.id > 0 && (
              <Flex gap="1.5rem">
                <Button
                  size="large"
                  htmlType="button"
                  className="buttonOutlined"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalStatus({ status: true, remove: false });
                  }}
                  icon={<ArrowsClockwise size={"1.45rem"} />}
                >
                  Cambiar Estado
                </Button>
                <Button
                  size="large"
                  onClick={(e) => {
                    isEditAvailable && e.preventDefault();
                    setIsEditAvailable(false);
                  }}
                  className="buttonOutlined"
                  htmlType={!isEditAvailable ? "submit" : "button"}
                  icon={<Pencil size={"1.45rem"} />}
                >
                  Editar Usuario
                </Button>
              </Flex>
            )}
          </Flex>
          <Flex vertical component={"main"} className="mainClientForm">
            <Title level={4}>Información del usuario</Title>
            {/* -----------------------------------Informacion del Usuario--------------------------------------- */}
            <Flex component={"section"} className="generalProject">
              <InputForm
                titleInput="Tipo de Documento"
                control={control}
                nameInput="infoClient.typeOfDocument"
                error={errors.infoClient?.typeOfDocument}
              />
              <InputForm
                titleInput="No. de documento"
                control={control}
                nameInput="infoClient.idDocument"
                error={errors.infoClient?.idDocument}
              />
              <InputForm
                titleInput="Razon Social"
                control={control}
                nameInput="infoClient.socialReason"
                error={errors.infoClient?.socialReason}
              />
              <InputForm
                titleInput="Nombre de la compañía"
                control={control}
                nameInput="infoClient.socialReason"
                error={errors.infoClient?.socialReason}
              />
              <InputForm
                titleInput="Tipo de Cliente"
                control={control}
                nameInput="infoClient.typeOfClient"
                error={errors.infoClient?.typeOfClient}
              />
              <InputForm
                titleInput="Holding"
                control={control}
                nameInput="infoClient.holding"
                error={errors.infoClient?.holding}
              />
              <InputForm
                titleInput="Teléfono"
                control={control}
                nameInput="infoClient.phone"
                error={errors.infoClient?.phone}
              />
              <InputForm
                titleInput="Correo electrónico"
                control={control}
                nameInput="infoClient.email"
                error={errors.infoClient?.email}
              />
              <InputForm
                titleInput="Ciudad"
                control={control}
                nameInput="infoClient.city"
                error={errors.infoClient?.city}
              />
              <InputForm
                titleInput="Riesgo"
                control={control}
                nameInput="infoClient.risk"
                error={errors.infoClient?.risk}
              />
              <Flex vertical style={{ width: "24.5%" }} justify="center">
                <Title level={5}>Período de facturación</Title>
                <Input
                  variant="borderless"
                  className="input"
                  placeholder="Segundo miércoles del mes"
                  onClick={() => setIsTimeFacturaction(true)}
                />
              </Flex>
              <InputForm
                titleInput="Tipo de radicación"
                control={control}
                nameInput="infoClient.periodBilling"
                error={errors.infoClient?.periodBilling}
              />
              <InputForm
                titleInput="Condición de pago"
                control={control}
                nameInput="infoClient.conditionPay"
                error={errors.infoClient?.conditionPay}
              />
              <InputForm
                titleInput="Ingresar dirección"
                control={control}
                nameInput="infoClient.address"
                error={errors.infoClient?.address}
              />
            </Flex>
            {/* -----------------------------------Experiencia----------------------------------- */}
            <Title level={4}>Documentos</Title>
            <Flex vertical align="flex-start">
              <Flex wrap="wrap" gap={"1rem"} style={{ width: "100%" }}>
                {[1, 23, 45, 6, 7, 8, 9].map((document) => (
                  <DocumentButton key={document} fileName="Archivo1.pdf" fileSize="200KB" />
                ))}
              </Flex>
              <Button
                size="large"
                type="text"
                className="buttonUploadDocument"
                onClick={() => setIsUploadDocument(true)}
                icon={<Plus weight="bold" size={15} />}
              >
                Cargar Documento
              </Button>
            </Flex>
            <DividerCustom />
            <ShipToProjectTable setIsCreateShipTo={setIsCreateShipTo} />
            <DividerCustom />
            <Flex gap={"1rem"} justify="flex-end">
              <Button
                type="primary"
                className="buttonOutlined"
                size="large"
                icon={<ArrowLineDown weight="bold" size={15} />}
              >
                Descargar plantilla
              </Button>
              <Button
                type="primary"
                className="buttonOutlined"
                size="large"
                icon={<ArrowLineUp weight="bold" size={15} />}
              >
                Cargar excel
              </Button>
              <Button
                type="primary"
                className="buttonNewProject"
                size="large"
                icon={<Plus weight="bold" size={15} />}
              >
                Registrar Usuario
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
      <ModalCreateShipTo isOpen={isCreateShipTo} setIsCreateShipTo={setIsCreateShipTo} />
      <ModalUploadDocument isOpen={isUploadDocument} setIsOpenUpload={setIsUploadDocument} />
      <ModalTimeFacturaction
        isOpen={isTimeFacturaction}
        setIsTimeFacturaction={setIsTimeFacturaction}
      />
      <ModalStatusClient isOpen={isModalStatus.status} setIsStatusClient={setIsModalStatus} />
      <ModalRemove
        name="cliente"
        isOpen={isModalStatus.remove}
        onClose={() => setIsModalStatus((s) => ({ ...s, remove: false }))}
        onRemove={() => {}}
      />
    </>
  );
};
