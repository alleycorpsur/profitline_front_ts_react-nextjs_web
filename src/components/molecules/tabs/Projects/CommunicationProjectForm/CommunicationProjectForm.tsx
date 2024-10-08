import { Button, Flex, Radio, Spin, Typography } from "antd";
import { Controller, ControllerRenderProps, FieldError, useForm } from "react-hook-form";
import { CaretLeft } from "phosphor-react";

import styles from "./communicationProjectForm.module.scss";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ISelectedBussinessRules } from "@/types/bre/IBRE";
import { SelectZone } from "@/components/molecules/selects/SelectZone/SelectZone";
import { SelectStructure } from "@/components/molecules/selects/SelectStructure/SelectStructure";
import { SelectClientsGroup } from "@/components/molecules/selects/SelectClientsGroup/SelectClientsGroup";
import GeneralSelect from "@/components/ui/general-select";
import GeneralSearchSelect from "@/components/ui/general-search-select";
import SelectOuterTags from "@/components/ui/select-outer-tags";
import InputClickable from "@/components/ui/input-clickable";
import { ModalPeriodicity } from "@/components/molecules/modals/ModalPeriodicity/ModalPeriodicity";
import {
  ICommunicationForm,
  IPeriodicityModalForm,
  ISingleCommunication
} from "@/types/communications/ICommunications";
import { InputExpirationNoticeDays } from "@/components/atoms/inputs/InputExpirationNoticeDays/InputExpirationNoticeDays";
import { OptionType } from "@/components/ui/select-outer-tags/select-outer-tags";
import { CustomTextArea } from "@/components/atoms/CustomTextArea/CustomTextArea";
import {
  createCommunication,
  getCommunicationById,
  getForwardEvents,
  getForwardToEmails,
  getTemplateTags
} from "@/services/communications/communications";
import { useAppStore } from "@/lib/store/store";
import { capitalize, stringFromArrayOfSelect } from "@/utils/utils";
import { useMessageApi } from "@/context/MessageContext";
import dayjs from "dayjs";
import { selectDayOptions } from "@/components/atoms/SelectDay/SelectDay";

const { Title } = Typography;

interface Props {
  showCommunicationDetails: {
    communicationId: number;
    active: boolean;
  };
  setIsCreateCommunication: Dispatch<SetStateAction<boolean>>;
  onGoBackTable: () => void;
}
export const CommunicationProjectForm = ({
  onGoBackTable,
  showCommunicationDetails,
  setIsCreateCommunication
}: Props) => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [isEditAvailable] = useState(false);
  const [radioValue, setRadioValue] = useState<any>();
  const [zones, setZones] = useState([] as number[]);
  const [selectedPeriodicity, setSelectedPeriodicity] = useState<IPeriodicityModalForm>();
  const [selectedBusinessRules, setSelectedBusinessRules] = useState<ISelectedBussinessRules>(
    initDatSelectedBusinessRules
  );
  const [communicationData, setCommunicationData] = useState({
    data: {} as ISingleCommunication,
    isLoading: false
  });
  const [customFieldsError, setCustomFieldsError] = useState({
    zone: false,
    channel: false,
    frequency: false
  });
  const [assignedGroups, setAssignedGroups] = useState<number[]>([]);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [forwardToEmails, setForwardToEmails] = useState<string[]>([]);
  const { ID: projectId } = useAppStore((state) => state.selectedProject);

  const { showMessage } = useMessageApi();

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
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<ICommunicationForm>({
    values: showCommunicationDetails.active ? dataToDataForm(communicationData.data) : undefined
  });
  const watchTemplateTagsLabels = watch("template.tags")?.map((tag) => `\[${tag.label}\]`);

  useEffect(() => {
    //set values for selects
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

    // set values for communication detail
    const fetchSingleCommunication = async () => {
      if (!showCommunicationDetails.communicationId) return;
      setCommunicationData({ data: {} as ISingleCommunication, isLoading: true });
      const res = await getCommunicationById(showCommunicationDetails.communicationId);
      if (res) {
        setCommunicationData({ data: res, isLoading: false });
        setRadioValue(res.type);
        setSelectedBusinessRules({
          channels: res.rules.channel,
          lines: res.rules.line,
          sublines: res.rules.subline
        });
        setZones(res.rules.zone);
        setAssignedGroups(res.rules.groups_id);
        setSelectedPeriodicity({
          init_date: dayjs(new Date(res.date_init_frequency)).add(1, "day"),
          frequency_number: res.repeats,
          frequency: { value: capitalize(res.frequency), label: capitalize(res.frequency) },
          days: res.frequency_days.map((day) => ({
            value: capitalize(day),
            label: dayToLabel(day)
          })),
          end_date: dayjs(new Date(res.date_end_frequency)).add(1, "day")
        });
      }
    };
    fetchSingleCommunication();
  }, [showCommunicationDetails.communicationId]);

  const dayToLabel = (day: string) => {
    const dayObj = selectDayOptions.find((option) => option.value === day);
    if (!dayObj) return day;
    return dayObj.label;
  };

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

  const handleCreateCommunication = async (data: any) => {
    setLoadingRequest(true);
    if (
      zones.length === 0 ||
      selectedBusinessRules?.channels.length === 0 ||
      (selectedPeriodicity?.frequency === undefined && radioValue === "frecuencia")
    ) {
      setCustomFieldsError({
        zone: zones.length === 0,
        channel: selectedBusinessRules?.channels.length === 0,
        frequency: selectedPeriodicity?.frequency === undefined && radioValue === "frecuencia"
      });
      setLoadingRequest(false);
      return;
    }
    setCustomFieldsError({
      zone: false,
      channel: false,
      frequency: false
    });

    await createCommunication({
      data,
      selectedPeriodicity,
      zones,
      selectedBusinessRules,
      assignedGroups,
      projectId,
      showMessage
    });

    setIsCreateCommunication(false);
    setLoadingRequest(false);
  };

  useEffect(() => {
    //useEffect to clean values from otherRadioButtons when clicked
    if (radioValue === "frecuencia") {
      setValue("trigger.settings.days", undefined);
      setValue("trigger.settings.values", undefined);
      setValue("trigger.settings.subValues", undefined);
      setValue("trigger.settings.event_type", undefined);
      setValue("trigger.settings.noticeDaysEvent", undefined);
    } else if (radioValue === "evento") {
      setValue("trigger.settings.days", undefined);
      setValue("trigger.settings.values", undefined);
      setValue("trigger.settings.subValues", undefined);
      setValue("trigger.settings.noticeDaysEvent", undefined);
      setSelectedPeriodicity(undefined);
    } else if (radioValue === "accion") {
      setValue("trigger.settings.days", undefined);
      setValue("trigger.settings.event_type", undefined);
      setValue("trigger.settings.noticeDaysEvent", undefined);
      setSelectedPeriodicity(undefined);
    }
  }, [radioValue]);

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

      {communicationData.isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <div className={styles.generalInfo}>
            <InputForm
              titleInput="Nombre"
              control={control}
              nameInput="name"
              error={errors.name}
              readOnly={!showCommunicationDetails.communicationId ? false : !isEditAvailable}
            />
            <InputForm
              titleInput="Descripción"
              control={control}
              nameInput="description"
              error={errors.description}
              readOnly={!showCommunicationDetails.communicationId ? false : !isEditAvailable}
            />
          </div>

          <div
            className={styles.forwardType}
            style={errors.trigger?.type && { border: "1px dashed red" }}
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
                      disabled={!!showCommunicationDetails.communicationId && !isEditAvailable}
                    >
                      <InputClickable
                        title="Frecuencia"
                        error={customFieldsError.frequency}
                        disabled={radioValue !== "frecuencia"}
                        callBackFunction={() => setIsFrequencyModalOpen(true)}
                        customStyles={
                          customFieldsError.frequency ? { border: "1px dashed red" } : undefined
                        }
                        value={
                          selectedPeriodicity
                            ? `${selectedPeriodicity.frequency.value === "Mensual" ? `${selectedPeriodicity.frequency.value}, ${selectedPeriodicity.frequency_number} veces` : `Cada ${stringFromArrayOfSelect(selectedPeriodicity.days)}, ${selectedPeriodicity.frequency.value}`}`
                            : ""
                        }
                      />
                      <p className={styles.textError}>
                        {customFieldsError.frequency && `La Frecuencia es obligatoria *`}
                      </p>
                    </Radio>
                  </div>

                  <div className={styles.radioGroup__event}>
                    <div className={styles.radioGroup__event__left}>
                      <Radio
                        checked={radioValue === "evento"}
                        onChange={() => handleChangeRadio("evento", field)}
                        name="test"
                        className={styles.radioGroup__event__radio}
                        value={"evento"}
                        disabled={!!showCommunicationDetails.communicationId && !isEditAvailable}
                      />
                      <Controller
                        disabled={
                          radioValue !== "evento" ||
                          (!isEditAvailable && !!showCommunicationDetails.communicationId)
                        }
                        name="trigger.settings.event_type"
                        control={control}
                        rules={{ required: radioValue === "evento" }}
                        render={({ field }) => (
                          <GeneralSelect
                            errors={errors.trigger?.settings?.event_type}
                            field={field}
                            title="Tipo de evento"
                            placeholder="Seleccionar tipo de evento"
                            options={events}
                            titleAbsolute
                          />
                        )}
                      />
                    </div>
                    {radioValue === "evento" && (
                      <Controller
                        name="trigger.settings.noticeDaysEvent"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <InputExpirationNoticeDays
                            nameInput="trigger.settings.noticeDaysEvent"
                            setValue={setValue}
                            error={errors.trigger?.settings?.noticeDaysEvent}
                            field={field}
                            event_days_before={communicationData.data.event_days_before}
                            disabled={
                              !isEditAvailable && !!showCommunicationDetails.communicationId
                            }
                          />
                        )}
                      />
                    )}
                  </div>

                  <div className={styles.radioGroup__actions}>
                    <div className={styles.radioGroup__actions__left}>
                      <Radio
                        className={styles.radioGroup__actions__radio}
                        checked={radioValue === "accion"}
                        onChange={() => handleChangeRadio("accion", field)}
                        value={"accion"}
                        disabled={!!showCommunicationDetails.communicationId && !isEditAvailable}
                      />
                      <Controller
                        disabled={radioValue !== "accion" && !isEditAvailable}
                        name="trigger.settings.values"
                        control={control}
                        rules={{ required: radioValue === "accion" }}
                        render={({ field }) => (
                          <SelectOuterTags
                            title="Tipo de acción"
                            placeholder="Seleccionar tipo de acción"
                            options={actionsOptions}
                            errors={errors.trigger?.settings?.values}
                            field={field}
                            titleAbsolute
                          />
                        )}
                      />
                    </div>

                    <Controller
                      disabled={radioValue !== "accion" && !isEditAvailable}
                      name="trigger.settings.subValues"
                      control={control}
                      rules={{ required: radioValue === "accion" }}
                      render={({ field }) => (
                        <SelectOuterTags
                          title="Subtipo de acción"
                          placeholder="Seleccionar subtipo de acción"
                          options={subActionsOptions}
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
            <Flex
              vertical
              style={
                customFieldsError.zone
                  ? { border: "1px dashed red", borderRadius: "4px" }
                  : undefined
              }
            >
              <SelectZone
                zones={zones}
                setZones={setZones}
                disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
              />
              <p className={styles.textError}>
                {customFieldsError.zone && `La Zona es obligatoria *`}
              </p>
            </Flex>
            <Flex
              vertical
              style={
                customFieldsError.channel
                  ? { border: "1px dashed red", borderRadius: "4px" }
                  : undefined
              }
            >
              <SelectStructure
                selectedBusinessRules={selectedBusinessRules}
                setSelectedBusinessRules={setSelectedBusinessRules}
                disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
              />
              <p className={styles.textError}>
                {customFieldsError.channel && `Las Reglas de negocio  son obligatorias *`}
              </p>
            </Flex>
            <SelectClientsGroup
              assignedGroups={assignedGroups}
              setAssignedGroups={setAssignedGroups}
              disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
            />
          </div>

          <div className={styles.communicationTemplate}>
            <Title className={styles.communicationTemplate__title} level={5}>
              Plantilla comunicado
            </Title>
            <Controller
              name="template.via"
              control={control}
              disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
              rules={{ required: true }}
              render={({ field }) => (
                <GeneralSelect
                  errors={errors.template?.via}
                  field={field}
                  title="Via"
                  placeholder="Seleccionar via"
                  options={viasSelectOption}
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
                  suffixIcon={null}
                  disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
                />
              )}
            />
            <Controller
              name="template.copy_to"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <GeneralSearchSelect
                  errors={errors.template?.copy_to}
                  field={field}
                  title="Copia"
                  placeholder="Copia a"
                  options={forwardToEmails}
                  suffixIcon={null}
                  disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
                />
              )}
            />

            <Flex gap={"1rem"} align="flex-start">
              <Controller
                name="template.tags"
                control={control}
                rules={{ required: false }}
                disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
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
                readOnly={!isEditAvailable && !!showCommunicationDetails.communicationId}
              />
            </Flex>
            <Controller
              name="template.message"
              control={control}
              rules={{ required: true }}
              disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
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
                    disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
                  />
                </div>
              )}
            />
            <Controller
              name="template.files"
              control={control}
              rules={{ required: true }}
              disabled={!isEditAvailable && !!showCommunicationDetails.communicationId}
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

          {!showCommunicationDetails.active && (
            <Flex justify="end">
              <PrincipalButton
                loading={loadingRequest}
                onClick={handleSubmit(handleCreateCommunication)}
              >
                Crear comunicación
              </PrincipalButton>
            </Flex>
          )}
        </>
      )}

      <ModalPeriodicity
        isOpen={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        selectedPeriodicity={selectedPeriodicity}
        setSelectedPeriodicity={setSelectedPeriodicity}
        isEditAvailable={isEditAvailable}
        showCommunicationDetails={showCommunicationDetails}
      />
    </main>
  );
};

const actionsOptions = [
  "Novedad",
  "Aplicación de pago",
  "Generación nota crédito",
  "Cambio estado de factura"
];

const subActionsOptions = [
  "Error en facturación",
  "Diferencia en precios",
  "Devolución",
  "No radicado"
];
const viasSelectOption = ["Email", "SMS", "WhatsApp"];

const mockAttachments = ["PDF Estado de cuenta", "Excel cartera", "PDF Factura"];

const initDatSelectedBusinessRules: ISelectedBussinessRules = {
  channels: [],
  lines: [],
  sublines: []
};

const dataToDataForm = (data: ISingleCommunication): ICommunicationForm => {
  return {
    name: data.COMUNICATION_NAME,
    description: data.reason,
    trigger: {
      type: data.type,
      settings: {
        days: ["test"],
        values: undefined,
        subValues: undefined,
        event_type: data.EVENT_TYPE ? { value: data.EVENT_TYPE, label: data.EVENT_TYPE } : undefined
      }
    },
    template: {
      via: { value: data.via, label: data.via },
      send_to: data.send_to?.map((mail) => ({ value: mail, label: mail })),
      copy_to: data.copy_to?.map((mail) => ({ value: mail, label: mail })),
      tags: data.tags?.map((tag) => ({ value: tag, label: tag })),
      time: data.updated_at,
      message: data.BODY,
      title: data.TITLE,
      subject: data.TEMPLATE_SUBJECT,
      files: []
    }
  };
};
