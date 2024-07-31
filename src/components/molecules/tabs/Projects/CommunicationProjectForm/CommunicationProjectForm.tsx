import { Button, Flex, Radio, Typography } from "antd";
import { Controller, ControllerRenderProps, FieldError, useForm } from "react-hook-form";
import { CaretLeft } from "phosphor-react";

import styles from "./communicationProjectForm.module.scss";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { useEffect, useState } from "react";
import { ISelectedBussinessRules } from "@/types/bre/IBRE";
import { SelectZone } from "@/components/molecules/selects/SelectZone/SelectZone";
import { SelectStructure } from "@/components/molecules/selects/SelectStructure/SelectStructure";
import { SelectClientsGroup } from "@/components/molecules/selects/SelectClientsGroup/SelectClientsGroup";
import GeneralSelect from "@/components/ui/general-select";
import GeneralSearchSelect from "@/components/ui/general-search-select";
import SelectOuterTags from "@/components/ui/select-outer-tags";
import InputClickable from "@/components/ui/input-clickable";
import { ModalPeriodicity } from "@/components/molecules/modals/ModalPeriodicity/ModalPeriodicity";
import { ICommunicationForm, IPeriodicityModalForm } from "@/types/communications/ICommunications";
import { InputExpirationNoticeDays } from "@/components/atoms/inputs/InputExpirationNoticeDays/InputExpirationNoticeDays";
import { OptionType } from "@/components/ui/select-outer-tags/select-outer-tags";
import { CustomTextArea } from "@/components/atoms/CustomTextArea/CustomTextArea";
import {
  getForwardEvents,
  getForwardToEmails,
  getTemplateTags
} from "@/services/communications/communications";

const { Title } = Typography;

interface Props {
  showCommunicationDetails: {
    communicationId: number;
    active: boolean;
  };
  onGoBackTable: () => void;
}
export const CommunicationProjectForm = ({ onGoBackTable }: Props) => {
  const [radioValue, setRadioValue] = useState<any>();
  const [zones, setZones] = useState([] as number[]);
  const [selectedPeriodicity, setSelectedPeriodicity] = useState<IPeriodicityModalForm>(
    {} as IPeriodicityModalForm
  );
  const [selectedBusinessRules, setSelectedBusinessRules] = useState<ISelectedBussinessRules>(
    initDatSelectedBusinessRules
  );
  const [frequencyError, setFrequencyError] = useState(false);
  const [assignedGroups, setAssignedGroups] = useState([] as any[]);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [forwardToEmails, setForwardToEmails] = useState<string[]>([]);

  const handleChangeRadio = (
    value: any,
    field: ControllerRenderProps<ICommunicationForm, "trigger.type">
  ) => {
    setRadioValue(value);
    field.onChange(value);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues
  } = useForm<ICommunicationForm>({});
  const watchEventType = watch("trigger.settings.eventType");
  const watchTemplateTagsLabels = watch("template.tags")?.map((tag) => `\[${tag.label}\]`);

  useEffect(() => {
    const fecthEvents = async () => {
      const events = await getForwardEvents();
      setEvents(events);
    };
    fecthEvents();
    const fetchTemplateTags = async () => {
      const tags = await getTemplateTags();
      setTemplateTags(tags);
    };
    fetchTemplateTags();
    const fetchEmails = async () => {
      const emails = await getForwardToEmails();
      setForwardToEmails(emails);
    };
    fetchEmails();
  }, []);

  const handleAddTagToBody = (value: OptionType[], deletedValue: OptionType[]) => {
    const valueBody = getValues("template.message");

    if (deletedValue.length > 0) {
      const deletedTag = deletedValue[0].label;
      setValue("template.message", valueBody.replace(`[${deletedTag}]`, ""));
      return;
    }

    const lastAddedTag = value.length > 0 ? value[value.length - 1] : undefined;

    setValue("template.message", `${valueBody ? valueBody : ""}[${lastAddedTag?.label}]`);
  };

  const handleCreateCommunication = (data: any) => {
    console.log(data);
    console.log("zonas:", zones, selectedBusinessRules, "grupos:", assignedGroups);
    console.log("periodicidad:", selectedPeriodicity);
  };

  return (
    <main className={styles.communicationProjectForm}>
      <Flex>
        <Button
          className={styles.goBackButton}
          type="text"
          size="large"
          onClick={onGoBackTable}
          icon={<CaretLeft size={"1.45rem"} />}
        >
          Información de la comunicación
        </Button>
      </Flex>
      <div className={styles.generalInfo}>
        <InputForm titleInput="Nombre" control={control} nameInput="name" error={errors.name} />
        <InputForm
          titleInput="Descripción"
          control={control}
          nameInput="descripcion"
          error={errors.descripcion}
        />
      </div>

      <div
        className={styles.forwardType}
        style={errors.trigger?.type && { border: "1px dotted red" }}
      >
        <Title className={styles.forwardType__title} level={5}>
          Tipo de envio
        </Title>

        <Controller
          name="trigger.type"
          control={control}
          rules={{
            validate: (value) => {
              if (!value) {
                return "Seleccione al menos 1 tipo de envio *";
              }
              return true;
            }
          }}
          render={({ field }) => (
            <div className={styles.radioGroup}>
              <div className={styles.radioGroup__frequency}>
                <Radio
                  checked={radioValue === "frecuencia"}
                  onChange={() => handleChangeRadio("frecuencia", field)}
                  className={styles.radioGroup__frequency__radio}
                  value={"frecuencia"}
                >
                  <InputClickable
                    title="Frecuencia"
                    error={frequencyError}
                    disabled={radioValue !== "frecuencia"}
                    callBackFunction={() => setIsFrequencyModalOpen(true)}
                    value={selectedPeriodicity?.frequency?.label}
                  />
                </Radio>
              </div>

              <div className={styles.radioGroup__event}>
                <Radio
                  checked={radioValue === "evento"}
                  onChange={() => handleChangeRadio("evento", field)}
                  name="test"
                  className={styles.radioGroup__event__radio}
                  value={"evento"}
                >
                  <Controller
                    disabled={radioValue !== "evento"}
                    name="trigger.settings.eventType"
                    control={control}
                    rules={{ required: radioValue === "evento" }}
                    render={({ field }) => (
                      <GeneralSelect
                        errors={errors.trigger?.settings?.eventType}
                        field={field}
                        title="Tipo de evento"
                        placeholder="Seleccionar tipo de evento"
                        options={events}
                        titleAbsolute
                      />
                    )}
                  />
                </Radio>
                {watchEventType?.value?.startsWith("Vencimiento") && (
                  <InputExpirationNoticeDays
                    nameInput="trigger.settings.noticeDaysEvent"
                    setValue={setValue}
                    control={control}
                    error={errors.trigger?.settings?.noticeDaysEvent}
                    validationRules={{ required: true }}
                  />
                )}
              </div>

              <div className={styles.radioGroup__actions}>
                <Radio
                  className={styles.radioGroup__actions__radio}
                  checked={radioValue === "accion"}
                  onChange={() => handleChangeRadio("accion", field)}
                  value={"accion"}
                >
                  <Controller
                    disabled={radioValue !== "accion"}
                    name="trigger.settings.values"
                    control={control}
                    rules={{ required: radioValue === "accion" }}
                    render={({ field }) => (
                      <SelectOuterTags
                        title="Tipo de acción"
                        placeholder="Seleccionar tipo de acción"
                        options={mockAttachments}
                        errors={errors.trigger?.settings?.values}
                        field={field}
                        titleAbsolute
                      />
                    )}
                  />
                </Radio>
                <Controller
                  disabled={radioValue !== "accion"}
                  name="trigger.settings.subValues"
                  control={control}
                  rules={{ required: radioValue === "accion" }}
                  render={({ field }) => (
                    <SelectOuterTags
                      title="Subtipo de acción"
                      placeholder="Seleccionar subtipo de acción"
                      options={mockAttachments}
                      errors={errors.trigger?.settings?.subValues}
                      field={field}
                      titleAbsolute
                    />
                  )}
                />
              </div>
              {errors.trigger?.type && (
                <p className={styles.radioGroup__error}>
                  {(errors.trigger.type as FieldError).message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className={styles.businessRules}>
        <Title className={styles.businessRules__title} level={5}>
          Reglas de negocio
        </Title>
        <SelectZone zones={zones} setZones={setZones} />
        <SelectStructure
          selectedBusinessRules={selectedBusinessRules}
          setSelectedBusinessRules={setSelectedBusinessRules}
          disabled={false}
        />
        <SelectClientsGroup assignedGroups={assignedGroups} setAssignedGroups={setAssignedGroups} />
      </div>

      <div className={styles.communicationTemplate}>
        <Title className={styles.communicationTemplate__title} level={5}>
          Plantilla comunicado
        </Title>
        <Controller
          name="template.via"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <GeneralSelect
              errors={errors.template?.via}
              field={field}
              title="Via"
              placeholder="Seleccionar via"
              options={mockVias}
              customStyleContainer={{ width: "25%", paddingRight: "0.25rem" }}
            />
          )}
        />
        <Controller
          name="template.send_to"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <GeneralSearchSelect
              errors={errors.template?.send_to}
              field={field}
              title="Para"
              placeholder="Enviar a"
              options={forwardToEmails}
            />
          )}
        />
        <Controller
          name="template.copy_to"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <GeneralSearchSelect
              errors={errors.template?.copy_to}
              field={field}
              title="Copia"
              placeholder="Copia a"
              options={forwardToEmails}
            />
          )}
        />

        <Flex gap={"1rem"} align="flex-start">
          <Controller
            name="template.tags"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectOuterTags
                title="Tags"
                placeholder="Seleccionar tag"
                options={templateTags}
                errors={errors.template?.tags}
                field={field}
                customStyleContainer={{ width: "25%" }}
                hiddenTags
                addedOnchangeBehaviour={handleAddTagToBody}
              />
            )}
          />
          <InputForm
            customStyle={{ width: "75%" }}
            titleInput="Asunto"
            control={control}
            nameInput="template.subject"
            error={errors.template?.subject}
          />
        </Flex>
        <Controller
          name="template.message"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className={styles.textArea}>
              <p className={styles.textArea__label}>Cuerpo</p>
              <CustomTextArea
                {...field}
                onChange={field.onChange}
                placeholder="Ingresar cuerpo del correo"
                customStyles={errors.template?.message ? { borderColor: "red" } : {}}
                value={field.value}
                highlightWords={watchTemplateTagsLabels}
              />
            </div>
          )}
        />
        <Controller
          name="template.files"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectOuterTags
              title="Adjunto"
              placeholder="Seleccionar adjunto"
              options={mockAttachments}
              errors={errors.template?.files}
              field={field}
              customStyleContainer={{ marginTop: "1rem" }}
              titleAbsolute
            />
          )}
        />
      </div>

      <Flex justify="end">
        <PrincipalButton
          // disabled={!isValid}
          onClick={handleSubmit(handleCreateCommunication)}
        >
          Crear comunicación
        </PrincipalButton>
      </Flex>
      <ModalPeriodicity
        isOpen={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        setSelectedPeriodicity={setSelectedPeriodicity}
      />
    </main>
  );
};

const mockVias = [
  { id: 1, value: 1, label: "Email" },
  { id: 2, value: 2, label: "SMS" },
  { id: 3, value: 3, label: "WhatsApp" }
];

const mockAttachments = [
  { id: 1, value: 1, label: "PDF Estado de cuenta" },
  { id: 2, value: 2, label: "Excel cartera" },
  { id: 3, value: 3, label: "PDF Factura" }
];

const mockForward = [
  { value: 1, label: "Santiago Pachon" },
  { value: 2, label: "Miguel Martinez" },
  { value: 3, label: "Felipe Angarita" },
  { value: 4, label: "Juan Perez" },
  { value: 5, label: "Carlos Sanchez" },
  { value: 6, label: "Jhon Doe" },
  { value: 7, label: "Maria Perez" },
  { value: 8, label: "Laura Martinez" },
  { value: 9, label: "Sara Perez" },
  { value: 10, label: "Camila Sanchez" }
];

const initDatSelectedBusinessRules: ISelectedBussinessRules = {
  channels: [],
  lines: [],
  sublines: []
};