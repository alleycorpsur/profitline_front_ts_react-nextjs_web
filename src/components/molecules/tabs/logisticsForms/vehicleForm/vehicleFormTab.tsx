import { useEffect, useState } from "react";
import { Button, Col, Flex, Row, Switch, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ArrowsClockwise, CaretLeft, Pencil, Plus } from "phosphor-react";
import { message } from "antd";

// components
import { ModalChangeStatus } from "@/components/molecules/modals/ModalChangeStatus/ModalChangeStatus";
import { UploadImg } from "@/components/atoms/UploadImg/UploadImg";

//interfaces
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import {
  normalizeVehicleData,
  validationButtonText,
  VehicleData,
  VehicleFormTabProps
} from "./vehicleFormTab.mapper";

import "./vehicleformtab.scss";
import { IFormVehicle, VehicleType } from "@/types/logistics/schema";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";
import useSWR from "swr";
import { SelectVehicleType } from "@/components/molecules/logistics/SelectVehicleType/SelectVehicleType";
import ModalDocuments from "@/components/molecules/modals/ModalDocuments/ModalDocuments";
import { addVehicle, getVehicleType } from "@/services/logistics/vehicle";
import { CertificateType, DocumentCompleteType } from "@/types/logistics/certificate/certificate";
import { DocumentButtonAction } from "@/components/atoms/DocumentButtonAction/DocumentButtonAction";
import { UploadDocumentButton } from "@/components/atoms/UploadDocumentButton/UploadDocumentButton";
import UploadDocumentChild from "@/components/atoms/UploadDocumentChild/UploadDocumentChild";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";

const { Title, Text } = Typography;

type ImageKeys =
  | "general.image1"
  | "general.image2"
  | "general.image3"
  | "general.image4"
  | "general.image5";
interface ImageState {
  file: File | undefined;
}

export const VehicleFormTab = ({
  data,
  onEditVehicle = () => {},
  onSubmitForm = () => {},
  statusForm = "review",
  onActiveVehicle = () => {},
  onDesactivateVehicle = () => {},
  params
}: VehicleFormTabProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenModalDocuments, setIsOpenModalDocuments] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [hasGPS, setHasGPS] = useState(true);


  const { data: documentsType, isLoading: isLoadingDocuments } = useSWR(
    "1",
    getDocumentsByEntityType
  );
  const { data: vehiclesTypesData, isLoading: loadingVicles } = useSWR(
    "/vehicle/type",
    getVehicleType
  );

  const [images, setImages] = useState<ImageState[]>(
    Array(5).fill({ file: undefined, error: false })
  );


  const defaultValues = statusForm === "create" ? {} : normalizeVehicleData(data as any);
  const {
    watch,
    control,
    handleSubmit,
    resetField,
    getValues,
    trigger,
    formState: { errors, isValid }
  } = useForm<IFormVehicle>({
    defaultValues,
    disabled: statusForm === "review",
    mode: 'onChange' 
  });
  const { push } = useRouter();

  const isFormCompleted = () => {
    return isValid && images.some(img=>img.file)
  }

  useEffect(() => {
    if (!hasGPS) {
      resetField('general.gps_user', { defaultValue: undefined });
      resetField('general.gps_password', { defaultValue: undefined });
      resetField('general.gps_link', { defaultValue: undefined });
    }
    trigger(['general.gps_user', 'general.gps_password', 'general.gps_link']);
  }, [hasGPS, resetField, trigger]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  /*archivos*/
  interface FileObject {
    docReference: string;
    file: File | undefined;
  }
  const [files, setFiles] = useState<FileObject[] | any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<DocumentCompleteType[]>([]);

  
  useEffect(() => {
    if (Array.isArray(documentsType)) {
      console.log(data);
      if (data?.documents?.length) {
        const fileSelected =
          documentsType
            ?.filter((f) => data.documents?.find((d) => d.id_document_type === f.id))
            .map((f) => ({
              ...f,
              file: undefined,
              link: data.documents?.find((d) => d.id_document_type === f.id)?.url_archive,
              expirationDate: dayjs(
                data.documents?.find((d) => d.id_document_type === f.id)?.expiration_date
              )
            })) || [];
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
        if (fileSelected?.length) {
          setSelectedFiles([...fileSelected]);
        } else {
          setSelectedFiles([]);
        }
      }
    }
  }, [files, documentsType]);

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



  const onSubmit = async (data: any) => {
    const hasImage = images.some((image) => image.file);
    if (!hasImage){
      setImageError(true);
      return;
    } 

    const imageFiles = images
      .map((image, index) =>
        image.file ? { docReference: `imagen${index + 1}`, file: image.file } : undefined
      )
      .filter(Boolean) as { docReference: string; file: File }[];

    const vehicleData: any = {
      ...data.general,
      id_carrier: Number(params.id) || 14
    };

    try {
      const response = await addVehicle(vehicleData, imageFiles, selectedFiles);
      console.log("Vehicle created successfully:", response.data);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "El vehículo fue creado exitosamente."
        });
        push(`/logistics/providers/${params.id}/vehicle`);
      }
      // Optionally reset the form and images after successful submission
      setImages(Array(5).fill({ file: undefined }));
      setImageError(false);
      push(`/logistics/providers/${params.id}/vehicle`);
    } catch (error) {
      if (error instanceof Error) {
        messageApi.open({
          type: "error",
          content: error.message
        });
      } else {
        message.open({
          type: "error",
          content: "Oops, hubo un error por favor intenta más tarde."
        });
      }
    }
  };

  const getImageKey = (index: number): ImageKeys => {
    return `general.image${index}` as ImageKeys;
  };

  const convertToSelectOptions = (vehicleTypes: VehicleType[]) => {
    return vehicleTypes?.map((vehicleType) => ({
      label: vehicleType.description,
      value: vehicleType.id.toString()
    }));
  };

  return (
    <>
      {contextHolder}
      <form className="vehiclesFormTab" onSubmit={handleSubmit(onSubmit)}>
        <Flex component={"header"} className="headerProyectsForm">
            <Link href={`/logistics/providers/${params.id}/vehicle`} passHref>
              <Button
                type="text"
                size="large"
                className="buttonGoBack"
                icon={<CaretLeft size={"1.45rem"} />}
              >
                Ver Vehiculos
              </Button>
            </Link>
              <Flex gap={"1rem"}>
              {(statusForm === "review") && (
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
                    onEditVehicle();
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
        <Flex component={"main"} flex="3" vertical>
          <Row>
            <Col span={6}>
              <Title className="title" level={4}>
                Fotos de vehículo
              </Title>
              {/* ------------Image Project-------------- */}
              <Row>
                <Col span={24} className="colfoto">
                  <UploadImg
                    disabled={statusForm === "review"}
                    imgDefault={watch("general.image1")}
                    setImgFile={(file) => {
                      setImages((prev) =>
                        prev.map((img, index) => (index === 0 ? { ...img, file } : img))
                      );
                      if (file) {
                        setImageError(false);
                      }
                    }}
                  />
                  {imageError && (
                    <Text className="textError">{"Al menos 1 imagen debe ser cargada *"}</Text>
                  )}
                </Col>
                </Row>
                <Row gutter={16}>
                {images.slice(1).map((image, index) => (
                  <Col xs={24} sm={12} lg={6} className="colfotomin" key={index + 1}>
                    <UploadImg
                      disabled={statusForm === "review"}
                      imgDefault={getValues(getImageKey(index + 1))}
                      setImgFile={(file) => {
                        setImages((prev) =>
                          prev.map((img, imgIndex) =>
                            imgIndex === index + 1 ? { ...img, file } : img
                          )
                        );
                        if (file) {
                          setImageError(false);
                        }
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={18}>
              <Title className="title" level={4}>
                Informacion General
              </Title>
              <Flex component={"section"} className="generalProject" justify="flex-start">
                <Flex vertical className="containerInput">
                  <Title className="title" level={5}>
                    Tipo de Vehiculo
                  </Title>
                  <Controller
                    name="general.id_vehicle_type"
                    control={control}
                    disabled={statusForm === "review"} 
                    rules={{ required: true }}
                    render={({ field }) => (
                      <SelectVehicleType
                        errors={errors}
                        field={field}
                        options={convertToSelectOptions((vehiclesTypesData?.data as any) || [])}
                        loading={loadingVicles}
                      />
                    )}
                  />
                  <Text className="textError">
                    {errors?.general?.vehicle_type && "Tipo es obligatorio *"}
                  </Text>
                </Flex>
                <InputForm
                  titleInput="Placa"
                  nameInput="general.plate_number"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors.general?.plate_number}
                />
                <InputForm
                  titleInput="Marca"
                  nameInput="general.brand"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors?.general?.brand}
                />
                <InputForm
                  titleInput="Modelo"
                  nameInput="general.model"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors?.general?.model}
                />
                <InputForm
                  titleInput="Linea"
                  nameInput="general.line"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors.general?.line}
                />
                <InputForm
                  titleInput="Año"
                  nameInput="general.year"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={undefined}
                  // error={errors.general?.year}
                />
                <InputForm
                  titleInput="Color"
                  nameInput="general.color"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors.general?.color}
                />
                <InputForm
                  titleInput="Ciudad"
                  nameInput="general.country"
                  control={control}
                  disabled={statusForm === "review"}  
                  error={errors.general?.country}
                />
              </Flex>
              <Flex
                component={"section"}
                className="generalProject"
                justify="flex-start"
                style={{ marginTop: "2rem" }}
              >
                <Switch
                  disabled={statusForm === 'review'}
                  checked={hasGPS}
                  onChange={()=>setHasGPS(!hasGPS)}
                />
                <h5 className="ant-typography input-form-title">&nbsp;&nbsp;Equipado por GPS</h5>
              </Flex>
              <Flex
                component={"section"}
                className="generalProject"
                justify="flex-start"
                style={{ marginTop: "2rem" }}
              >
                <InputForm
                  titleInput="Usuario"
                  nameInput="general.gps_user"
                  control={control}
                  disabled={statusForm === "review" || !hasGPS} 
                  error={errors.general?.gps_user}
                />
                <InputForm
                  titleInput="Contraseña"
                  nameInput="general.gps_password"
                  control={control}
                  disabled={statusForm === "review" || !hasGPS} 
                  error={errors.general?.gps_password }
                />
                <InputForm
                  titleInput="Link"
                  nameInput="general.gps_link"
                  control={control}
                  disabled={statusForm === "review"|| !hasGPS} 
                  error={errors.general?.gps_link }
                />
              </Flex>
            </Col>
            <Col span={24}>
              <Title className="title" level={4}>
                Informacion Adicional
              </Title>
              <InputForm
                placeholder="Escribir información adicional"
                titleInput=""
                nameInput="general.aditional_info"
                control={control}
                validationRules={{required: false}}
                disabled={statusForm === "review"} 
                error={errors.general?.aditional_info}
              />
            </Col>
            <Col span={24}>
            <label className="locationLabels" style={{ display: "flex", marginTop: "2rem" }}>
              <text>Documentos</text>
            </label>
            </Col>
            <Col span={24}>
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
            </Col>
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
                disabled={!isFormCompleted()}
                className={`button ${isFormCompleted() ? "active" : ""}`}
                style={{ display: "flex" }}
                htmlType={"submit"}
                onClick={handleSubmit(onSubmit)}
              >
                {validationButtonText(statusForm)}
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
      <ModalChangeStatus
        isActiveStatus={true}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onActive={onActiveVehicle}
        onDesactivate={onDesactivateVehicle}
      />
    </>
  );
};
