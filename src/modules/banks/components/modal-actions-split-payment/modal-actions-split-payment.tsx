"use client";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Flex, Modal, Typography } from "antd";
import { Plus } from "phosphor-react";

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

  console.log("selectedRows", selectedRows);

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
        <Title level={5}>Pago {selectedRows && selectedRows[0].id}</Title>
        <Flex vertical>
          <strong>{paymentInfo.available}</strong>
          <p>{paymentInfo.total}</p>
        </Flex>
      </Flex>

      {fields.map((field, index) => (
        <Flex key={field.id} vertical gap={"1rem"}>
          <Flex gap={"1rem"}>
            <Controller
              name={`payments.${index}.client`}
              control={control}
              rules={{ required: true }}
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
              typeInput="number"
              customStyle={{ width: "100%" }}
            />
          </Flex>

          <div className="modalActionsSplitPayment__file">
            <Flex vertical>
              <p>Evidencia</p>
              <em>*Obligatorio</em>
            </Flex>
            <DocumentButton
              key={watch(`payments.${index}.evidence`)?.name}
              title={watch(`payments.${index}.evidence`)?.name}
              handleOnChange={(info) => handleOnChangeDocument(index, info)}
              handleOnDelete={() => handleOnDeleteDocument(index)}
              fileName={watch(`payments.${index}.evidence`)?.name}
              fileSize={watch(`payments.${index}.evidence`)?.size}
            />
          </div>
        </Flex>
      ))}
      <SecondaryButton
        icon={<Plus />}
        onClick={() => append({ client: null, value: 0, evidence: undefined })}
      >
        Agregar pago
      </SecondaryButton>

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
