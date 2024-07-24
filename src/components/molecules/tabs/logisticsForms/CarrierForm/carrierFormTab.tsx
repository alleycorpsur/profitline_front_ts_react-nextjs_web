import { useEffect, useRef, useState } from "react";
import { Button, Col, ColorPicker, Flex, Form, Input, message, Modal, Row, Select, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ArrowsClockwise, CaretLeft, CaretRight, Pencil, PlusCircle } from "phosphor-react";

// component
import { ModalChangeStatus } from "@/components/molecules/modals/ModalChangeStatus/ModalChangeStatus";
import { UploadImg } from "@/components/atoms/UploadImg/UploadImg";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import "./carrierformtab.scss";
import {
  _onSubmit,
  dataToProjectFormData,
  validationButtonText,
  CarrierFormTabProps
} from "./carrierFormTab.mapper";
import { ICarrier, IFormCarrier, IFormDriver } from "@/types/logistics/schema";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";
import { SelectDocument } from "@/components/molecules/logistics/SelectDocument/SelectDocument";
import { bloodTypes, SelectRh } from "@/components/molecules/logistics/SelectRh/SelectRh";
import { glasses, SelectGlasses } from "@/components/molecules/logistics/SelectGlasses/SelectGlasses";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import { licences, SelectLCategory } from "@/components/molecules/logistics/SelectLicenceCategory/SelectLicenceCategory";
import useSWR from "swr";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";
import { CertificateType, DocumentCompleteType } from "@/types/logistics/certificate/certificate";
import ModalDocuments from "@/components/molecules/modals/ModalDocuments/ModalDocuments";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

export const CarrierFormTab = ({
  onEditProject = () => {},
  onSubmitForm = () => {},
  statusForm = "review",
  data = [],
  onActiveProject = () => {},
  onDesactivateProject = () => {}
}: CarrierFormTabProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data: documentsType, isLoading: isLoadingDocuments } = useSWR(
    "0",
    getDocumentsByEntityType
  );
  const [selectedFiles, setSelectedFiles] = useState<DocumentCompleteType[]>([]);

  const [imageFile, setImageFile] = useState<any | undefined>(undefined);
  const [loading, setloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultValues = statusForm === "create" ? {} : dataToProjectFormData(data[0]);
  const {
    watch,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<IFormCarrier>({
    defaultValues,
    disabled: statusForm === "review"
  });

   /*archivos*/
   interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<FileObject[] | any[]>([]);

  useEffect(() => {
    if (Array.isArray(documentsType)) {
      if (data[0]?.documents?.length) {
        const fileSelected =
          documentsType
            ?.filter((f) => data[0].documents?.find((d) => d.id_document_type === f.id))
            .map((f) => ({
              ...f,
              file: undefined,
              link: data[0].documents?.find((d) => d.id_document_type === f.id)?.url_archive,
              expirationDate: dayjs(
                data[0].documents?.find((d) => d.id_document_type === f.id)?.expiration_date
              )
            })) || [];
        setSelectedFiles(fileSelected);
      }
    }
  }, [files, documentsType]);


  useEffect(()=>{
    console.log(files)
  }, [files])
  

  const onSubmit = (data: any) => {
    data.general.license_categorie = licences.data.find((item) => item.id === data.general.license_category)?.value;
    data.general.rh = bloodTypes.data.find((item) => item.id === data.general.rh)?.value;
    _onSubmit(
      data,
      setloading,
      setImageError,
      imageFile ? [{ docReference: "imagen", file: imageFile }] : undefined,
      files,
      onSubmitForm,
      reset
    );
  };
  return (
    <>
      <Form className="mainProyectsForm">
        <Flex component={"header"} className="headerProyectsForm">
          <Button
            type="text"
            size="large"
            href="/logistics/providers/all"
            className="buttonGoBack"
            icon={<CaretLeft size={"1.45rem"} />}
          >
            Ver Proveedores
          </Button>
        </Flex>
        <Flex component={"main"} flex="1" vertical>
          <Row>
            <Col span={5}>
              {/* ------------Photo Driver-------------- */}
              <UploadImg
                disabled={statusForm === "review"}
                imgDefault={watch("general.photo") || "https://cdn.icon-icons.com/icons2/1622/PNG/512/3741756-bussiness-ecommerce-marketplace-onlinestore-store-user_108907.png"}
                setImgFile={setImageFile}
                uploadInstructionsText="*Sube la foto del logo"
              />
              {imageError && <Text className="textError">{"foto del conductor es obligatorio *"}</Text>}
            </Col>
            <Col span={19}>
              <Title className="title" level={4}>
                Informacion General
              </Title>
              <Flex component={"section"} className="generalProject" justify="flex-start">
                <InputForm
                  titleInput="Nit"
                  nameInput="general.nit"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Nombre"
                  nameInput="general.description"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Tipo de proveedor"
                  nameInput="general.carrier_type"
                  control={control}
                  error={undefined}
                />
                 <InputForm
                  titleInput="Razon social"
                  nameInput="general.description"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Correo de facturacion"
                  nameInput="general.description"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Correo de Comunicacion"
                  nameInput="general.carrier_type"
                  control={control}
                  error={undefined}
                />
                </Flex>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
            </Col>
          </Row>
          {/* -----------------------------------General--------------------------------------- */}

          {/* -----------------------------------Contact----------------------------------- */}
          <Title className="title" level={4}>
            Datos de Contacto
          </Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombres y apellidos"
              nameInput="general.description"
              control={control}
              error={errors?.general?.description}
            />
            <InputForm
              typeInput="tel"
              titleInput="Telefono"
              nameInput="general.description"
              control={control}
              error={errors?.general?.description}
              validationRules={{
                pattern: {
                  value: /^\+?\d+$/,
                  message: "Solo se permiten números y un signo '+' al comienzo"
                }
              }}
            />
          </Flex>
          <label className="locationLabels" style={{ display: 'flex', marginTop: '2rem' }}>
            <text>Documentos</text>
          </label>
          <Row className="mainUploadDocuments">
            {selectedFiles.map((file) => (
              // eslint-disable-next-line react/jsx-key
              <Col span={12} style={{ padding: "15px" }} key={`file-${file.id}`}>
                <UploadDocumentButton
                  key={file.id}
                  title={file.description}
                  isMandatory={!file.optional}
                  aditionalData={file.id}
                  setFiles={() => {}}
                  files={file.file}
                  disabled
                >
                  {file?.link ? (
                    <UploadDocumentChild
                      linkFile={file.link}
                      nameFile={file.link.split("-").pop() || ""}
                      onDelete={() => {}}
                      showTrash={false}
                    />
                  ) : undefined}
                </UploadDocumentButton>
              </Col>
            ))}
          </Row>
          {/* -----------------------------------Project Config----------------------------------- */}

          <Flex className="buttonNewProject">
            {["edit", "create"].includes(statusForm) && (
              <Button
                disabled={!isDirty}
                className={`button ${isDirty ? "active" : ""}`}
                style={{ display: "flex" }}
                htmlType={"submit"}
                onClick={handleSubmit(onSubmit)}
              >
                {validationButtonText(statusForm)}
              </Button>
            )}
          </Flex>
        </Flex>
      </Form>
      <ModalChangeStatus
        isActiveStatus={true}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onActive={onActiveProject}
        onDesactivate={onDesactivateProject}
      />
    </>
  );
};
