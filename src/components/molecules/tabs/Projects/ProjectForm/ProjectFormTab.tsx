import { useState } from "react";
import { Button, ColorPicker, Flex, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ArrowsClockwise, CaretLeft, Pencil } from "phosphor-react";

// components
import { SelectCountries } from "@/components/molecules/selects/SelectCountries/SelectCountries";
import { SelectCurrencies } from "@/components/molecules/selects/SelectCurrencies/SelectCurrencies";
import { ModalChangeStatus } from "@/components/molecules/modals/ModalChangeStatus/ModalChangeStatus";
import { IUpdateFormProject } from "@/types/projects/IUpdateFormProject";
import { UploadImg } from "@/components/atoms/UploadImg/UploadImg";

//interfaces
import { ICreatePayload } from "@/types/projects/IProjects";
import { IProject } from "@/types/projects/IProject";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import "./projectformtab.scss";

const { Title, Text } = Typography;

interface Props {
  idProjectForm?: string;
  data?: IProject;
  // eslint-disable-next-line no-unused-vars
  onEditProject?: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitForm?: (data: ICreatePayload) => void;
  onActiveProject?: () => void;
  onDesactivateProject?: () => void;
  statusForm: "create" | "edit" | "review";
}
export type ProyectType = {
  general: {
    name: string;
    nit: string;
    currencies: string[];
    country: string[];
    address: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  personalization: {
    color: any;
  };
};
export const ProjectFormTab = ({
  onEditProject = () => {},
  onSubmitForm = () => {},
  statusForm = "review",
  data = {} as IProject,
  onActiveProject = () => {},
  onDesactivateProject = () => {}
}: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [imageFile, setImageFile] = useState(data.LOGO);
  const [imageError, setImageError] = useState(false);
  const defaultValues = statusForm === "create" ? {} : dataToProjectFormData(data);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IUpdateFormProject>({
    defaultValues,
    disabled: statusForm === "review"
  });

  const validationButtonText =
    statusForm === "create"
      ? "Crear Proyecto"
      : statusForm === "edit"
        ? "Guardar Cambios"
        : " Editar Proyecto";

  const onSubmit = (data: any) => {
    if (!imageFile) return setImageError(true);
    setImageError(false);
    onSubmitForm({ ...data, logo: imageFile });
  };

  return (
    <>
      <form className="mainProyectsForm" onSubmit={handleSubmit(onSubmit)}>
        <Flex component={"header"} className="headerProyectsForm">
          <Button
            type="text"
            size="large"
            href="/"
            className="buttonGoBack"
            icon={<CaretLeft size={"1.45rem"} />}
          >
            Ver Proyectos
          </Button>
          <Flex gap={"1rem"}>
            {statusForm === "review" && (
              <Button
                style={{ display: "flex" }}
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenModal(true);
                }}
                icon={<ArrowsClockwise size={"1.45rem"} />}
              >
                Cambiar Estado
              </Button>
            )}
            {statusForm === "review" ? (
              <Button
                style={{ display: "flex" }}
                htmlType="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEditProject();
                }}
                icon={<Pencil size={"1.45rem"} />}
              >
                {validationButtonText}
              </Button>
            ) : (
              <Button
                style={{ display: "flex" }}
                htmlType={"submit"}
                icon={<Pencil size={"1.45rem"} />}
              >
                {validationButtonText}
              </Button>
            )}
          </Flex>
        </Flex>
        <Flex component={"main"} vertical>
          {/* ------------Image Project-------------- */}
          <UploadImg
            disabled={statusForm === "review"}
            imgDefault={data.LOGO}
            setImgFile={setImageFile}
          />
          {imageError && <Text className="textError">{"Logo del proyecto es obligatorio *"}</Text>}
          {/* -----------------------------------General--------------------------------------- */}
          <Title level={4}>Informacion General</Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombre del Proyecto"
              nameInput="general.name"
              control={control}
              error={errors.general?.name}
            />
            <InputForm
              titleInput="NIT"
              nameInput="general.nit"
              control={control}
              error={errors.general?.nit}
            />
            <Flex vertical className="containerInput">
              <Title level={5}>Divisas</Title>
              <Controller
                name="general.currencies"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <SelectCurrencies errors={errors} field={field} />}
              />
              <Text className="textError">
                {errors?.general?.currencies && "Divisa es obligatorio *"}
              </Text>
            </Flex>
            <Flex vertical className="containerInput">
              <Title level={5}>Pais</Title>
              <Controller
                name="general.country"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <SelectCountries errors={errors} field={field} />}
              />
              <Text className="textError">
                {errors?.general?.country && "Pais es obligatorio *"}
              </Text>
            </Flex>
            <InputForm
              titleInput="Direccion"
              nameInput="general.address"
              control={control}
              error={errors.general?.address}
            />
          </Flex>
          {/* -----------------------------------Contact----------------------------------- */}
          <Title level={4}>Informacion de Contacto</Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <InputForm
              titleInput="Nombre"
              nameInput="contact.name"
              control={control}
              error={errors.contact?.name}
            />
            {/* <Flex vertical className="containerInput">
            <Title level={5}>Posicion</Title>
            <Controller
              name="contact.position"
              rules={{ required: true, maxLength: 123 }}
              control={control}
              render={({ field }) => (
                <Input
                  className="input"
                  variant="borderless"
                  placeholder="Posicion"
                  {...field}
                />
              )}
            />
            <Text className='textError'>{errors?.contact?.position && 'Posicion es obligatorio *'}</Text>
          </Flex> */}
            <InputForm
              typeInput="email"
              titleInput="Correo"
              nameInput="contact.email"
              control={control}
              error={errors.contact?.email}
            />
            <InputForm
              typeInput="tel"
              titleInput="Telefono"
              nameInput="contact.phone"
              control={control}
              error={errors.contact?.phone}
            />
          </Flex>
          {/* -----------------------------------Project Config----------------------------------- */}
          <Title level={4}>Personalizer Proyecto</Title>
          <Flex component={"section"} className="generalProject" justify="flex-start">
            <Flex vertical className="containerInput">
              <Title level={5}>Color Personalizado</Title>
              <Controller
                name="personalization.color"
                rules={{ required: true, maxLength: 123 }}
                control={control}
                render={({ field }) => (
                  <ColorPicker format="rgb" size="large" showText {...field} />
                )}
              />
              <Text className="textError">
                {errors?.personalization?.color && "Color Personalizado es obligatorio *"}
              </Text>
            </Flex>
            {/* <Flex vertical className="containerInput">
            <Title level={5}>Descripcion</Title>
            <Controller
              name="personalization.description"
              control={control}
              rules={{ required: true, maxLength: 123 }}
              render={({ field }) => (
                <TextArea
                  rows={2}
                  className="input"
                  variant="borderless"
                  placeholder="Ingresar Descripcion"
                  {...field}
                />
              )}
            />
          </Flex> */}
          </Flex>
        </Flex>
      </form>
      <ModalChangeStatus
        isActiveStatus={data?.IS_ACTIVE!}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onActive={onActiveProject}
        onDesactivate={onDesactivateProject}
      />
    </>
  );
};
const dataToProjectFormData = (data: IProject) => {
  const currenciesFormated = data?.CURRENCY?.map(
    (currency) => `${currency.id}-${currency.CURRENCY_NAME ?? currency.currency_name}`
  );

  return {
    general: {
      name: data.PROJECT_DESCRIPTION,
      nit: data.NIT,
      currencies: currenciesFormated,
      country: `${data.COUNTRY_ID}-${data.COUNTRY_NAME}`,
      address: data.ADDRESS
    },
    contact: {
      name: data.CONTACT,
      position: "",
      email: data.EMAIL,
      phone: data.PHONE
    },
    personalization: {
      color: data.RGB_CONFIG
    }
  };
};
