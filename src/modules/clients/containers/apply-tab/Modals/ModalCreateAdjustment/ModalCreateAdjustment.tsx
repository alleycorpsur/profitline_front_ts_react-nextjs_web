import React, { useEffect } from "react";
import { Modal } from "antd";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { CaretLeft, Plus } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import GeneralSelect from "@/components/ui/general-select";

import "./modalCreateAdjustment.scss";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";

interface ISelect {
  value: string;
  label: string;
}

interface IAdjustment {
  motive?: ISelect;
  detail?: string;
  amount?: number;
}
interface ModalCreateAdjustmentProps {
  onCancel: () => void;
  onOk: () => void;
  isOpen: boolean;
}

const ModalCreateAdjustment: React.FC<ModalCreateAdjustmentProps> = ({
  isOpen,
  onCancel,
  onOk
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<{ adjustments: IAdjustment[] }>({
    mode: "onChange",
    defaultValues: { adjustments: [] }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "adjustments"
  });

  useEffect(() => {
    if (isOpen) {
      reset(); // Clear the form when modal opens
      append({ motive: undefined, detail: undefined, amount: undefined });
    }
  }, [isOpen, append, reset]);

  const onSubmit = (data: { adjustments: IAdjustment[] }) => {
    console.log("ajustes: ", data);
  };

  return (
    <>
      <Modal
        className="modalCreateAdjustment"
        width={"60%"}
        open={isOpen}
        onOk={onOk}
        closeIcon={false}
        onCancel={onCancel}
        footer={null}
      >
        <div onClick={onCancel} className="header">
          <CaretLeft size={24} onClick={onCancel} />
          <h2>Crear ajuste</h2>
        </div>

        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="modalCreateAdjustment__adjustment">
              <Controller
                name={`adjustments.${index}.motive`}
                control={control}
                rules={{ required: "Cliente es obligatorio" }}
                render={({ field }) => (
                  <GeneralSelect
                    errors={errors?.adjustments?.[index]?.motive}
                    field={field}
                    title="Cliente"
                    placeholder="Ingresar cliente"
                    options={mockInputs}
                    showSearch
                    customStyleContainer={{ width: "100%" }}
                    customStyleTitle={{ marginBottom: "4px" }}
                  />
                )}
              />

              <InputForm
                titleInput="Detalle"
                control={control}
                nameInput={`adjustments.${index}.detail`}
                error={errors?.adjustments?.[index]?.detail}
              />

              <InputFormMoney
                titleInput="Valor"
                nameInput={`adjustments.${index}.amount`}
                control={control}
                error={errors?.adjustments?.[index]?.amount}
                placeholder="Valor"
                customStyle={{ width: "100%" }}
                validationRules={{
                  required: "Valor es obligatorio",
                  min: { value: 1, message: "El valor debe ser mayor a 0" }
                }}
              />
            </div>
          ))}
        </div>

        <button
          className="modalCreateAdjustment__addAdjustment"
          onClick={() => append({ motive: undefined, detail: undefined, amount: undefined })}
        >
          <Plus />
          Agregar pago
        </button>

        <div className="modal-footer">
          <SecondaryButton fullWidth onClick={onCancel}>
            Cancelar
          </SecondaryButton>

          <PrincipalButton disabled={!isValid} onClick={handleSubmit(onSubmit)} fullWidth>
            Crear ajuste
          </PrincipalButton>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateAdjustment;

const mockInputs = [
  { value: "1", label: "Cliente 1" },
  { value: "2", label: "Cliente 2" }
];
