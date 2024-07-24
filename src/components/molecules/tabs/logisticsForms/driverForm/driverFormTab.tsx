import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  ColorPicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { ArrowsClockwise, CaretLeft, CaretRight, Pencil, Plus, PlusCircle } from "phosphor-react";

// components
import { SelectCountries } from "@/components/molecules/selects/SelectCountries/SelectCountries";
import { SelectCurrencies } from "@/components/molecules/selects/SelectCurrencies/SelectCurrencies";
import { ModalChangeStatus } from "@/components/molecules/modals/ModalChangeStatus/ModalChangeStatus";
import { IFormProject } from "@/types/projects/IFormProject";
import { UploadImg } from "@/components/atoms/UploadImg/UploadImg";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import "./driverformtab.scss";
import { IBillingPeriodForm } from "@/types/billingPeriod/IBillingPeriod";
import {
  _onSubmit,
  dataToProjectFormData,
  validationButtonText,
  DriverFormTabProps,
  DriverData
} from "./driverFormTab.mapper";
import { IDriver, IFormDriver, VehicleType } from "@/types/logistics/schema";
import { InputDateForm } from "@/components/atoms/inputs/InputDate/InputDateForm";
import { SelectDocument } from "@/components/molecules/logistics/SelectDocument/SelectDocument";
import { bloodTypes, SelectRh } from "@/components/molecules/logistics/SelectRh/SelectRh";
import {
  glasses,
  SelectGlasses
} from "@/components/molecules/logistics/SelectGlasses/SelectGlasses";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import {
  licences,
  SelectLCategory
} from "@/components/molecules/logistics/SelectLicenceCategory/SelectLicenceCategory";
import useSWR from "swr";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";
import { CertificateType, DocumentCompleteType } from "@/types/logistics/certificate/certificate";
import ModalDocuments from "@/components/molecules/modals/ModalDocuments/ModalDocuments";
import { getVehicleType } from "@/services/logistics/vehicle";
import Link from "next/link";
import dayjs from "dayjs";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";

const { Title, Text } = Typography;

export const DriverFormTab = ({
  onEditProject = () => {},
  onSubmitForm = () => {},
  statusForm = "review",
  data = [] as DriverData[],
  onActiveProject = () => {},
  onDesactivateProject = () => {},
  params
}: DriverFormTabProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDocuments, setIsOpenModalDocuments] = useState(false);
  const { data: documentsType, isLoading: isLoadingDocuments } = useSWR(
    "2",
    getDocumentsByEntityType
  );

  const { data: vehiclesTypesData, isLoading: loadingVicles } = useSWR(
    "/vehicle/type",
    getVehicleType
  );

  const [imageFile, setImageFile] = useState<any | undefined>(undefined);
  const [loading, setloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<DocumentCompleteType[]>([]);

  const defaultValues = statusForm === "create" ? {} : dataToProjectFormData(data[0]);
  const {
    watch,
    setValue,
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<IFormDriver>({
    defaultValues,
    disabled: statusForm === "review"
  });

  /*archivos*/
  interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<(FileObject & { aditionalData?: any })[]>([]);

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
        console.log(fileSelected);
        setSelectedFiles(fileSelected);
      } else {
        const fileSelected = documentsType
          ?.filter(
            (f) => !f?.optional || selectedFiles?.find((f2) => f2.id === f.id)
          )
          ?.map((f) => ({
            ...f,
            file: files.find((f2) => f2.aditionalData === f.id)?.file,
            expirationDate: selectedFiles.find((f2) => f2.id === f.id)?.expirationDate
          }));
        console.log(fileSelected);
        if (fileSelected?.length) {
          setSelectedFiles([...fileSelected]);
        } else {
          setSelectedFiles([]);
        }
      }
    }
  }, [files, documentsType]);

  const convertToSelectOptions = (vehicleTypes: VehicleType[]) => {
    if (!Array.isArray(vehicleTypes)) return [];
    return vehicleTypes?.map((vehicleType) => ({
      label: vehicleType.description,
      value: vehicleType.id.toString()
    }));
  };

  const handleChangeExpirationDate = (index: number, value: any) => {
    setSelectedFiles((prevState: any[]) => {
      const updatedFiles = [...prevState];
      updatedFiles[index].expirationDate = value;
      return updatedFiles;
    });
  };

  const handleChange = (value: string[]) => {
    const sf = documentsType?.filter((file) => value.includes(file.id.toString()));
    if (sf) {
      setSelectedFiles((prevState) => {
        return sf.map((file) => ({
          ...file,
          file: prevState.find((f) => f.id === file.id)?.file,
          expirationDate: prevState.find((f) => f.id === file.id)?.expirationDate
        }));
      });
    }
  };

  const onSubmit = (data: any) => {
    data.general.license_categorie = licences.data.find(
      (item) => item.id === data.general.license_category
    )?.value;
    data.general.rhval = bloodTypes.data.find((item) => item.id === data.general.rh)?.value;
    _onSubmit(
      data,
      setloading,
      setImageError,
      imageFile ? [{ docReference: "imagen", file: imageFile }] : undefined,
      selectedFiles,
      onSubmitForm,
      reset
    );
  };
  return (
    <>
      <Form className="mainProyectsForm">
        <Flex component={"header"} className="headerProyectsForm">
          <Link href={`/logistics/providers/${params.id}/driver`} passHref>
            <Button
              type="text"
              size="large"
              className="buttonGoBack"
              icon={<CaretLeft size={"1.45rem"} />}
            >
              Ver Conductores
            </Button>
          </Link>
          <Flex gap={"1rem"}>
            {(statusForm === "review" || statusForm === "edit") && (
              <Button
                className="buttons"
                htmlType="button"
                disabled={statusForm === "review"}  
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenModal(true);
                }}
              >
                Cambiar Estado
                <ArrowsClockwise size={"1.2rem"} />
              </Button>
            )}
            {statusForm === "review" ? (
              <Button
                className="buttons -edit"
                htmlType="button"
                disabled={statusForm === "review"} 
                onClick={(e) => {
                  e.preventDefault();
                  onEditProject();
                }}
              >
                {validationButtonText(statusForm)}
                <Pencil size={"1.2rem"} />
              </Button>
            ) : (
              ""
            )}
          </Flex>
        </Flex>
        <Flex component={"main"} flex="1" vertical>
          <Row>
            <Col span={5}>
              {/* ------------Photo Driver-------------- */}
              <UploadImg
                disabled={statusForm === "review"}
                imgDefault={
                  watch("general.photo") ||
                  "https://cdn.icon-icons.com/icons2/1622/PNG/512/3741756-bussiness-ecommerce-marketplace-onlinestore-store-user_108907.png"
                }
                setImgFile={setImageFile}
                uploadInstructionsText={"*Sube la foto del conductor"}
              />
              {imageError && (
                <Text className="textError">{"foto del conductor es obligatorio *"}</Text>
              )}
            </Col>
            <Col span={19}>
              <Title className="title" level={4}>
                Informacion General
              </Title>
              <Flex component={"section"} className="generalProject" justify="flex-start">
                <InputForm
                  titleInput="Nombres"
                  nameInput="general.name"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Apellidos"
                  nameInput="general.last_name"
                  control={control}
                  error={undefined}
                />
                <Flex vertical className="containerInput">
                  <Title className="title" level={5}>
                    Tipo de Sangre
                  </Title>
                  <Controller
                    name="general.rh"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <SelectRh errors={errors} field={field} />}
                  />
                </Flex>
                <Flex vertical className="containerInput">
                  <InputDateForm
                    titleInput="Fecha de nacimiento"
                    nameInput="general.birth_date"
                    placeholder="Seleccionar fecha de nacimiento"
                    disabled={statusForm === "review"}  
                    control={control}
                    error={undefined}
                  />
                </Flex>
                <Flex vertical className="containerInput">
                  <Title className="title" level={5}>
                    Tipo de documento
                  </Title>
                  <Controller
                    name="general.document_type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <SelectDocument errors={errors} field={field} />}
                  />
                </Flex>
                <InputForm
                  titleInput="Numero de documento"
                  nameInput="general.document"
                  control={control}
                  error={undefined}
                />
                <InputForm
                  titleInput="Telefono"
                  nameInput="general.phone"
                  control={control}
                  error={errors?.general?.phone}
                />
                <InputForm
                  titleInput="Correo"
                  nameInput="general.email"
                  control={control}
                  error={errors?.general?.email}
                />
                <Flex vertical className="containerInput">
                  <Title className="title" level={5}>
                    Usas lentes
                  </Title>
                  <Controller
                    name="general.glasses"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <SelectGlasses errors={errors.general?.glasses} field={field} />
                    )}
                  />
                </Flex>
              </Flex>
            </Col>
          </Row>
          <Row>
            <Col span={5}></Col>
            <Col span={19}>
              <Title className="title" level={4}>
                Datos de la licencia
              </Title>
              <Flex component={"section"} className="generalProject" justify="flex-start">
                <InputForm
                  titleInput="Licencia"
                  nameInput="general.license"
                  control={control}
                  error={errors?.general?.license}
                />
                <Flex vertical className="containerInput">
                  <Title className="title" level={5}>
                    Categoria
                  </Title>
                  <Controller
                    name="general.license_category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <SelectLCategory errors={errors?.general?.license_category} field={field} />
                    )}
                  />
                </Flex>
                <Flex vertical className="containerInput">
                  <InputDateForm
                    titleInput="Fecha de expiración"
                    nameInput="general.license_expiration"
                    placeholder="Seleccionar fecha de expiración"
                    control={control}
                    disabled={statusForm === "review"}  
                    validationRules={{ required: true }}
                    error={errors?.general?.license_expiration}
                  />
                </Flex>
              </Flex>
            </Col>
          </Row>
          {/* -----------------------------------General--------------------------------------- */}

          <Title className="title" level={4}>
            Vehiculos
          </Title>
          <Row style={{ width: "100%" }}>
            <Col span={24}>
              <Flex component={"section"} className="containerInput" style={{ width: "100%" }}>
                <Row style={{ width: "100%" }}>
                  <Col span={8}>
                    <label className="input-form-title">
                      Vehículos que está autorizados a manejar
                    </label>
                  </Col>
                  <Col span={16}>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "50%" }}
                      placeholder="Seleccione vehiculos"
                      loading={loadingVicles}
                      disabled={statusForm === "review"}  
                      defaultValue={getValues("general.vehicle_type")?.map((i: any) =>
                        i.id_vehicle_type?.toString()
                      )}
                      onChange={(value) => setValue("general.vehicle_type", value.map(Number))}
                      options={convertToSelectOptions((vehiclesTypesData?.data as any) || [])}
                    />
                  </Col>
                </Row>
              </Flex>
            </Col>
          </Row>

          {/* -----------------------------------Contact----------------------------------- */}
          <Title className="title" level={4}>
            Datos de Contacto
          </Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombres y apellidos"
              nameInput="general.emergency_contact"
              control={control}
              error={errors?.general?.emergency_contact}
            />
            <InputForm
              typeInput="tel"
              titleInput="Telefono"
              nameInput="general.emergency_number"
              control={control}
              error={errors?.general?.emergency_number}
              validationRules={{
                pattern: {
                  value: /^\+?\d+$/,
                  message: "Solo se permiten números y un signo '+' al comienzo"
                }
              }}
            />
          </Flex>
          <label className="locationLabels" style={{ display: "flex", marginTop: "2rem" }}>
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
          <Row>
            <Col span={24} className="text-right">
              <ModalDocuments
                isOpen={isOpenModalDocuments}
                mockFiles={selectedFiles}
                setFiles={setFiles}
                documentsType={documentsType}
                isLoadingDocuments={isLoadingDocuments}
                onClose={() => setIsOpenModalDocuments(false)}
                handleChange={handleChange}
                handleChangeExpirationDate={handleChangeExpirationDate}
              />
              <Row>
                {statusForm === "create" && (
                  <Flex justify="flex-end" style={{ width: "100%", margin: "1rem" }}>
                    <Button type="text" onClick={() => setIsOpenModalDocuments(true)}>
                      <Plus />
                      &nbsp;<Text>Cargar documentos</Text>
                    </Button>
                  </Flex>
                )}
              </Row>
            </Col>
          </Row>

          {/* -----------------------------------Project Config----------------------------------- */}

          <Flex className="buttonNewProject">
            {["edit", "create"].includes(statusForm) && (
              <Button
                className={`button ${true ? "active" : ""}`}
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
