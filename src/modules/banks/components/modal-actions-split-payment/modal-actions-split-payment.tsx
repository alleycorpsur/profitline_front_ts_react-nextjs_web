"use client";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Flex, Modal, Typography } from "antd";
import { Plus } from "phosphor-react";

import { formatMoney } from "@/utils/utils";

import { useMessageApi } from "@/context/MessageContext";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { DocumentButton } from "@/components/atoms/DocumentButton/DocumentButton";
import GeneralSelect from "@/components/ui/general-select";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";

import { ISingleBank } from "@/types/banks/IBanks";

import "./modal-actions-split-payment.scss";
const { Title } = Typography;

interface infoObject {
  file: File;
  fileList: File[];
}

interface ISelect {
  value: string;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRows: ISingleBank[] | undefined;
}

interface PaymentForm {
  client: ISelect | null;
  value: number;
  evidence: File | undefined;
}

const ModalActionsSplitPayment = ({ isOpen, onClose, selectedRows }: Props) => {
  const [availableMoney, setAvailableMoney] = useState(12000000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showMessage } = useMessageApi();

  const paymentInfo = {
    available: 12000000,
    total: 15000000
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isValid }
  } = useForm<{ payments: PaymentForm[] }>({
    mode: "onChange",
    defaultValues: { payments: [] }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "payments"
  });

  useEffect(() => {
    if (isOpen) {
      reset(); // Clear the form when modal opens
      append({ client: null, value: 0, evidence: undefined }); // Start with one payment
    }
  }, [isOpen, append, reset]);

  const handleValueChange = (index: number, value: string) => {
    const numericValue = parseInt(value.replace(/\./g, ""), 10) || 0;
    const currentPayments = watch("payments");
    const totalUsed = currentPayments.reduce(
      (sum, payment, idx) => sum + (idx !== index ? payment.value || 0 : 0),
      0
    );

    // Calculate the remaining available money
    const remainingMoney = paymentInfo.available - totalUsed;

    if (numericValue > remainingMoney) {
      setValue(`payments.${index}.value`, remainingMoney);
      setAvailableMoney(0);
    } else {
      setValue(`payments.${index}.value`, numericValue);
      setAvailableMoney(remainingMoney - numericValue);
      trigger(`payments.${index}.value`);
    }
  };

  const handleOnChangeDocument: any = (index: number, info: infoObject) => {
    const { file: rawFile } = info;
    if (rawFile) {
      const fileSizeInMB = rawFile.size / (1024 * 1024);
      if (fileSizeInMB > 30) {
        showMessage(
          "error",
          "El archivo es demasiado grande. Por favor, sube un archivo de menos de 30 MB."
        );
        return;
      }
      setValue(`payments.${index}.evidence`, rawFile);
      trigger(`payments.${index}.evidence`);
    }
  };

  const handleOnDeleteDocument = (index: number) => {
    setValue(`payments.${index}.evidence`, undefined);
    trigger(`payments.${index}.evidence`);
  };

  const onSubmit = async (data: { payments: PaymentForm[] }) => {
    setIsSubmitting(true);
    try {
      console.info("Pagos fraccionados: ", data);

      showMessage("success", "Cliente editado correctamente");

      onClose();
    } catch (error) {
      showMessage("error", "Error al fraccionar pagos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      className="modalActionsSplitPayment"
      width="50%"
      footer={null}
      open={isOpen}
      closable={false}
      destroyOnClose
    >
      <Title level={4} onClick={onClose}>
        Fraccionar pago
      </Title>

      <Flex justify="space-between">
        <Title style={{ fontWeight: 500 }} level={5}>
          Pago {selectedRows && selectedRows[0].id}
        </Title>
        <Flex vertical align="flex-end">
          <strong className="modalActionsSplitPayment__availAmount">
            {formatMoney(availableMoney)}
          </strong>
          <p className="modalActionsSplitPayment__totalAmount">{formatMoney(paymentInfo.total)}</p>
        </Flex>
      </Flex>

      <div className="modalActionsSplitPayment__payments">
        {fields.map((field, index) => (
          <Flex style={{ paddingBottom: "10px" }} key={field.id} vertical gap={"1rem"}>
            <Title style={{ fontWeight: 500 }} level={5}>
              Pago {selectedRows && selectedRows[0].id} - {index + 1}
            </Title>
            <Flex gap={"1rem"}>
              <Controller
                name={`payments.${index}.client`}
                control={control}
                rules={{ required: "Cliente es obligatorio" }}
                render={({ field }) => (
                  <GeneralSelect
                    errors={errors?.payments?.[index]?.client}
                    field={field}
                    title="Cliente"
                    placeholder="Ingresar cliente"
                    options={clients}
                    showSearch
                    customStyleContainer={{ width: "100%" }}
                    customStyleTitle={{ marginBottom: "4px" }}
                  />
                )}
              />

              <InputFormMoney
                titleInput="Valor"
                nameInput={`payments.${index}.value`}
                control={control}
                error={errors?.payments?.[index]?.value}
                placeholder="Valor"
                customStyle={{ width: "100%" }}
                validationRules={{
                  required: "Valor es obligatorio",
                  min: { value: 1, message: "El valor debe ser mayor a 0" }
                }}
                changeInterceptor={(numericValue) => handleValueChange(index, numericValue)}
              />
            </Flex>

            <div className="modalActionsSplitPayment__file">
              <Flex vertical>
                <p>Evidencia</p>
                <em>*Obligatorio</em>
              </Flex>

              <Controller
                name={`payments.${index}.evidence`}
                control={control}
                rules={{ required: "Evidencia es obligatoria" }}
                render={() => (
                  <>
                    <DocumentButton
                      key={watch(`payments.${index}.evidence`)?.name}
                      title={watch(`payments.${index}.evidence`)?.name}
                      handleOnChange={(info) => handleOnChangeDocument(index, info)}
                      handleOnDelete={() => handleOnDeleteDocument(index)}
                      fileName={watch(`payments.${index}.evidence`)?.name}
                      fileSize={watch(`payments.${index}.evidence`)?.size}
                    />
                  </>
                )}
              />
            </div>
          </Flex>
        ))}
      </div>

      <button
        className="modalActionsSplitPayment__addPayment"
        onClick={() => append({ client: null, value: 0, evidence: undefined })}
        disabled={availableMoney <= 0} // Disable the button if there's no more money left
      >
        <Plus />
        Agregar pago
      </button>

      <div className="modalActionsSplitPayment__footer">
        <SecondaryButton onClick={onClose} bordered={false}>
          Cancelar
        </SecondaryButton>

        <PrincipalButton
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          Asignar cliente
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalActionsSplitPayment;

const clients = [
  {
    value: "1",
    label: "Cliente 1"
  },
  {
    value: "2",
    label: "Cliente 2"
  },
  {
    value: "3",
    label: "Cliente 3"
  },
  {
    value: "4",
    label: "Cliente 4"
  },
  {
    value: "5",
    label: "Cliente 5"
  }
];
