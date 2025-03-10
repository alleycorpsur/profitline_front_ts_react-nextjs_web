import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Modal, Table } from "antd";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CaretLeft, CopySimple, Plus } from "phosphor-react";

import { useAppStore } from "@/lib/store/store";
import { useFinancialDiscountMotives } from "@/hooks/useFinancialDiscountMotives";
import { useAcountingAdjustment } from "@/hooks/useAcountingAdjustment";
import { extractSingleParam } from "@/utils/utils";
import { useMessageApi } from "@/context/MessageContext";

import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import GeneralSelect from "@/components/ui/general-select";

import "./modalCreateAdjustmentByInvoice.scss";

interface ISelect {
  value: string;
  label: string;
}

interface IAdjustment {
  adjustment?: ISelect;
}

interface IColumn {
  title: string;
  dataIndex: string;
  key: string;
}

interface ModalCreateAdjustmentByInvoiceProps {
  // eslint-disable-next-line no-unused-vars
  onCancel: (created?: Boolean) => void;
  isOpen: boolean;
}

const ModalCreateAdjustmentByInvoice: React.FC<ModalCreateAdjustmentByInvoiceProps> = ({
  isOpen,
  onCancel
}) => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const params = useParams();
  const clientId = Number(extractSingleParam(params.clientId)) || 0;
  const { showMessage } = useMessageApi();
  const { mutate } = useAcountingAdjustment(clientId.toString(), projectId.toString(), 2);
  const { data: motives } = useFinancialDiscountMotives();

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(0); // Estado para forzar la actualización
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch
  } = useForm<{ adjustments: IAdjustment[] }>({
    mode: "onChange",
    defaultValues: { adjustments: [] }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "adjustments"
  });

  const adjustments = watch("adjustments");

  useEffect(() => {
    if (isOpen) {
      reset();
      append({ adjustment: undefined });
    }
  }, [isOpen, append, reset]);

  useEffect(() => {
    const dynamicColumns = adjustments
      .filter((adj) => adj.adjustment)
      .map((adj) => ({
        title: adj.adjustment?.label || "",
        dataIndex: adj.adjustment?.label.split(" ").join("_") || "",
        key: adj.adjustment?.value || ""
      }));

    setColumns([
      {
        title: "Invoice",
        dataIndex: "invoice",
        key: "invoice"
      },
      ...dynamicColumns
    ]);
  }, [adjustments, updateFlag]);

  useEffect(() => {
    if (isOpen) {
      reset(); // Clear the form when modal opens
      append({ adjustment: undefined });
    }
  }, [isOpen, append, reset]);

  const onSubmit = async (data: { adjustments: IAdjustment[] }) => {
    setLoadingCreate(true);
    const adjustments = data.adjustments.map((adjustment) => ({
      adjustment: parseInt(adjustment?.adjustment?.value || "0")
    }));
    try {
      console.info("adjustments", adjustments);
      showMessage("success", "Ajuste(s) creado correctamente");
      mutate();
      onCancel(true);
    } catch (error) {
      showMessage("error", "Error al crear el ajuste(s)");
    }
    setLoadingCreate(false);
  };

  const handlePasteInvoices = async () => {
    try {
      const text = await navigator.clipboard.readText();

      const rows = text.split("\n").map((row) => row.trim());
      const vals = rows.map((row) => row.split("\t").map((val) => val.trim()));

      const data = vals.map((val) => {
        const obj: { [key: string]: string } = {};
        columns.forEach((col, index) => {
          obj[col.dataIndex] = val[index] || "";
        });
        return obj;
      });

      setDataSource(data);
    } catch (err) {
      console.error("Error pasting invoices:", err);
      showMessage("error", "Error al pegar facturas. Por favor, inténtelo de nuevo.");
    }
  };

  const handleSelectChange = () => {
    setUpdateFlag((prev) => prev + 1); // Forzar la actualización
  };
  return (
    <>
      <Modal
        className="modalCreateAdjustmentByInvoice"
        width={"60%"}
        open={isOpen}
        closeIcon={false}
        onCancel={() => onCancel()}
        footer={null}
      >
        <div onClick={() => onCancel()} className="header">
          <CaretLeft size={24} />
          <h2>Crear ajuste</h2>
        </div>

        <div className="modalCreateAdjustmentByInvoice__allAdjustments">
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              name={`adjustments.${index}.adjustment`}
              control={control}
              rules={{ required: "Tipo de ajuste es obligatorio" }}
              render={({ field }) => (
                <GeneralSelect
                  errors={errors?.adjustments?.[index]?.adjustment}
                  field={{
                    ...field, // Mantén todas las propiedades del field
                    onChange: (selectedOption) => {
                      field.onChange(selectedOption); // Llama al onChange original
                      handleSelectChange(); // Llama a tu función adicional
                    }
                  }}
                  title="Tipo de ajuste"
                  placeholder="Seleccionar tipo de ajuste"
                  options={
                    motives?.map((motive) => ({ value: motive.id, label: motive.name })) || []
                  }
                  showSearch
                  customStyleContainer={{ width: "100%" }}
                  customStyleTitle={{ marginBottom: "4px" }}
                />
              )}
            />
          ))}
        </div>

        <button
          className="modalCreateAdjustmentByInvoice__addAdjustment"
          onClick={() => append({ adjustment: undefined })}
        >
          <Plus />
          Agregar otro ajuste
        </button>

        <div className="pasteInvoices" onClick={handlePasteInvoices}>
          <CopySimple size={20} />
          Pegar desde excel
        </div>

        <Table
          className="AdjustmentsTable"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />

        <div className="modal-footer">
          <SecondaryButton fullWidth onClick={() => onCancel()}>
            Cancelar
          </SecondaryButton>

          <PrincipalButton
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
            fullWidth
            loading={loadingCreate}
          >
            Procesar
          </PrincipalButton>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateAdjustmentByInvoice;
