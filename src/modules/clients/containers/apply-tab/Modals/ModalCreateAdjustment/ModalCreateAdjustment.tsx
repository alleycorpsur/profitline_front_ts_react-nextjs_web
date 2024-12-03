import React, { useState } from "react";
import { Modal, Button, Form, Input, Spin } from "antd";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { CaretLeft } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import GeneralSelect from "@/components/ui/general-select";

interface ISelect {
  value: string;
  label: string;
}

interface IAdjustment {
  motive: ISelect;
  detail: string;
  amount: number;
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
    setValue,
    watch,
    trigger,
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

  const isLoading = false;

  return (
    <>
      <Modal open={isOpen} onOk={onOk} onCancel={onCancel}>
        <div onClick={onCancel} className="header">
          <CaretLeft size={24} onClick={onCancel} />
          <h2>Crear ajuste</h2>
        </div>

        <div>
          {fields.map((field, index) => (
            <Controller
              key={field.id}
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
          ))}
        </div>

        <div className="modal-footer">
          <SecondaryButton fullWidth onClick={onCancel}>
            Cancelar
          </SecondaryButton>

          <PrincipalButton fullWidth>Crear ajuste</PrincipalButton>
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
