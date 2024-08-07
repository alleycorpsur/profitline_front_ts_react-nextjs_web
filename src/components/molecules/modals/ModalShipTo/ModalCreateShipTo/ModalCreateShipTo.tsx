import {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Flex, Input, Switch, Typography } from "antd";

import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

import { SelectRadicationTypes } from "@/components/molecules/selects/clients/SelectRadicationTypes/SelectRadicationTypes";
import { SelectPaymentConditions } from "@/components/molecules/selects/clients/SelectPaymentConditions/SelectPaymentCondition";
import { ShipToFormType } from "@/types/shipTo/IShipTo";

import "./modalcreateshipto.scss";
import { ModalAddress } from "../ModalAddress/ModalAddress";
import { ISelectType } from "@/types/clients/IClients";
import { CaretRight } from "phosphor-react";
import { ShipToContext } from "../ModalShipTo";
import { stringToBoolean } from "@/utils/utils";
const { Text, Title } = Typography;
interface Props {
  setIsShipToModalOpen: Dispatch<
    SetStateAction<{
      open: boolean;
      accounting_code: string | undefined;
    }>
  >;
  isShipToModalOpen: {
    open: boolean;
    accounting_code: string | undefined;
  };
  setCurrentView: Dispatch<SetStateAction<"main" | "businessRules">>;
  setIsBillingPeriodOpen: Dispatch<SetStateAction<boolean>>;
  getClientValues: () => {
    billingPeriod: string;
    radicationType: ISelectType;
    conditionPayment: ISelectType;
  };
}

export const ModalCreateShipTo = ({
  setIsShipToModalOpen,
  isShipToModalOpen,
  setCurrentView,
  setIsBillingPeriodOpen,
  getClientValues
}: Props) => {
  const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
  const {
    selectedShipToData,
    setSelectedShipToData,
    clientBillingPeriod,
    billingPeriod,
    setBillingPeriod
  } = useContext(ShipToContext);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<ShipToFormType>({
    mode: "onChange",
    defaultValues: {
      shipTo: {
        code: undefined,
        dependency_client: false,
        billing_period: undefined
      }
    },
    values: isShipToModalOpen.accounting_code ? selectedShipToData : undefined
  });

  const watchDependencyClient = watch("shipTo.dependency_client");

  useEffect(() => {
    // UseEffect para actualizar el valor de billingPeriod
    if (!billingPeriod) {
      return;
    }

    const formattedBillingPeriod = billingPeriod.day_flag
      ? `El dia ${billingPeriod.day} del mes`
      : `El ${billingPeriod.order} ${billingPeriod.day_of_week} del mes`;

    // Establecer el valor formateado al string de billing period
    setValue("shipTo.billing_period", formattedBillingPeriod, { shouldValidate: true });
  }, [billingPeriod, setValue]);

  useEffect(() => {
    const {
      // billingPeriod: defaultBillingPeriod,
      radicationType,
      conditionPayment
    } = getClientValues();

    if (watchDependencyClient) {
      // Set values when dependency_client is true
      setBillingPeriod(clientBillingPeriod);

      setValue("shipTo.radication_type", radicationType, {
        shouldValidate: true
      });
      setValue("shipTo.condition_payment", conditionPayment, {
        shouldValidate: true
      });
    }
  }, [watchDependencyClient, setValue]);

  const onSubmitHandler = async (
    data: ShipToFormType,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setSelectedShipToData(data);
    setCurrentView("businessRules");
  };

  return (
    <>
      {isModalAddressOpen ? (
        <ModalAddress setIsModalAddressOpen={setIsModalAddressOpen} setParentFormValue={setValue} />
      ) : (
        <form className="createShipToModal">
          <h5 className="modalTitle">
            {isShipToModalOpen.accounting_code ? "Editar ShipTo" : "Crear nuevo Ship To"}
          </h5>
          <div className="nonHereditaryInputs">
            <InputForm
              readOnly={!!isShipToModalOpen.accounting_code}
              titleInput="Código Ship To"
              control={control}
              nameInput="shipTo.code"
              error={errors.shipTo?.code}
              validationRules={{
                pattern: {
                  value: /^[^\s]*$/,
                  message: "El código no puede contener espacios en blanco"
                }
              }}
            />
            <Flex className="inputContainer" vertical>
              <Title className="inputContainer__title" level={5}>
                Ubicacion
              </Title>
              <Controller
                control={control}
                name="shipTo.address"
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      addonAfter={<CaretRight size={"16px"} />}
                      variant="borderless"
                      className="input -address"
                      placeholder="Ingresar ubicacion"
                      onClick={() => setIsModalAddressOpen(true)}
                      {...field}
                    />
                    {error && (
                      <Typography.Text className="textError">
                        La dirección es obligatoria *
                      </Typography.Text>
                    )}
                  </>
                )}
              />
            </Flex>
          </div>
          <Flex gap={".5rem"} style={{ padding: "1rem 0rem" }}>
            <Controller
              control={control}
              name="shipTo.dependency_client"
              render={({ field }) => (
                <>
                  <Switch {...field} checked={field.value} />
                  <Text>Heredar parámetros del cliente</Text>
                </>
              )}
            />
          </Flex>

          <div className="hereditaryInputs">
            <div className="inputContainer">
              <Title className="inputContainer__title" level={5}>
                Período de facturación
              </Title>
              <Controller
                disabled={watchDependencyClient}
                name="shipTo.billing_period"
                control={control}
                rules={{ required: true, minLength: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      addonAfter={<CaretRight size={"16px"} />}
                      variant="borderless"
                      className={error ? "inputError" : "input"}
                      placeholder="Segundo miércoles del mes"
                      onClick={() => setIsBillingPeriodOpen(true)}
                      {...field}
                      value={
                        billingPeriod
                          ? stringToBoolean(billingPeriod.day_flag)
                            ? `El dia ${billingPeriod.day} del mes`
                            : `El ${billingPeriod?.order} ${billingPeriod?.day_of_week} del mes`
                          : undefined
                      }
                    />
                    {error && (
                      <Typography.Text className="textError">
                        El Periodo de facturacion es obligatorio *
                      </Typography.Text>
                    )}
                  </>
                )}
              />
            </div>

            <div className="inputContainer">
              <Title className="inputContainer__title" level={5}>
                Tipo de radicación
              </Title>
              <Controller
                disabled={watchDependencyClient}
                name="shipTo.radication_type"
                control={control}
                rules={{ required: true, minLength: 1 }}
                render={({ field }) => (
                  <SelectRadicationTypes<ShipToFormType>
                    errors={errors.shipTo?.radication_type}
                    field={field}
                  />
                )}
              />
            </div>
            <div className="inputContainer">
              <Title className="inputContainer__title" level={5}>
                Condición de pago
              </Title>
              <Controller
                disabled={watchDependencyClient}
                name="shipTo.condition_payment"
                control={control}
                rules={{ required: true, minLength: 1 }}
                render={({ field }) => {
                  return (
                    <SelectPaymentConditions<ShipToFormType>
                      errors={errors.shipTo?.condition_payment}
                      field={field}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="footer">
            <Button
              className="cancelButton"
              onClick={() => setIsShipToModalOpen({ open: false, accounting_code: undefined })}
            >
              Cancelar
            </Button>
            <Button
              disabled={!isValid}
              onClick={handleSubmit(onSubmitHandler)}
              className="acceptButton"
            >
              Siguiente
            </Button>
          </div>
        </form>
      )}
    </>
  );
};
