import React, { useEffect, useState } from "react";
import { Button, Flex, Modal, Spin, Table, TableProps } from "antd";
import { PencilLine, Plus, Trash } from "phosphor-react";
import { useForm } from "react-hook-form";

import { useAppStore } from "@/lib/store/store";

import useScreenHeight from "@/components/hooks/useScreenHeight";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";

import { IApplyTabRecord } from "@/types/applyTabClients/IApplyTabClients";

import "./modalEditRow.scss";

interface IApplicationTabRow {
  id: number;
  adjustment: string;
  amount: number;
}

interface IFormValues {
  adjustments: IApplicationTabRow[];
}
interface IModalEditRowProps {
  visible: boolean;
  onCancel: () => void;
  row?: IApplyTabRecord;
  editing_type?: "invoice" | "payment" | "discount";
}

const ModalEditRow: React.FC<IModalEditRowProps> = ({ visible, onCancel, row, editing_type }) => {
  const height = useScreenHeight();
  const formatMoney = useAppStore((state) => state.formatMoney);
  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<IFormValues>();

  useEffect(() => {
    return () => {
      setIsEditing(false);
      reset();
    };
  }, [visible]);

  const isLoading = false;
  const columns: TableProps<IApplicationTabRow>["columns"] = [
    {
      title: "Ajuste",
      dataIndex: "adjustment",
      key: "adjustment",
      render: (adjustment) => <p>{adjustment}</p>,
      width: "50%"
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const,
      render: (amount, _record, index) => {
        if (isEditing) {
          return (
            <Flex className="amountColumn" justify="center" align="center">
              <InputFormMoney
                defaultValue={amount}
                hiddenTitle
                nameInput={`adjustments.${index}.amount`}
                control={control}
                error={
                  errors?.adjustments?.[index]?.amount && {
                    type: "required",
                    message: "Campo requerido"
                  }
                }
                customStyle={{ width: "80%", textAlign: "center" }}
                validationRules={{
                  pattern: {
                    value: /^-?[0-9]+$/,
                    message: "Solo se permiten números"
                  }
                }}
              />

              <Button className="delete-btn" type="text">
                <Trash size={14} />
              </Button>
            </Flex>
          );
        } else {
          return <p>{formatMoney(amount)}</p>;
        }
      }
    }
  ];

  const handleEdit = () => {
    if (isEditing) {
      reset();
    }
    setIsEditing((prev) => !prev);
  };

  // Function to determine the title based on editing_type and row data
  const getModalTitle = (type: IModalEditRowProps["editing_type"], rowData?: IApplyTabRecord) => {
    let title = "";
    let id = "";

    switch (type) {
      case "invoice":
        title = "Factura";
        id = rowData?.id_erp?.toString() || "N/A";
        break;
      case "payment":
        title = "Pago";
        id = rowData?.payment_id?.toString() || "N/A";
        break;
      case "discount":
        title = "Ajuste";
        id = rowData?.financial_discount_id?.toString() || "N/A";
        break;
      default:
        title = "Factura";
        id = "N/A";
    }
    return `${title} ${id}`;
  };

  const handleSaveChanges = (adjustmentsData: IFormValues) => {
    // Merge form input (amount) with original row data (id and adjustment name)
    const formattedData = row?.adjustments?.map((adjustment, index) => ({
      id: adjustment.adjustment_id,
      adjustment: adjustment.description,
      amount: adjustmentsData.adjustments[index]?.amount
    }));

    console.info("Final Adjustments Data:", formattedData);
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={650} className="modalEditRow">
      <div className="header">
        <h2>{getModalTitle(editing_type, row)}</h2>
        <Button
          className="header__editBtn"
          onClick={handleEdit}
          icon={<PencilLine size={20} weight="light" />}
        >
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
      </div>

      {isLoading ? (
        <Flex justify="center" style={{ width: "100%", margin: "2rem 0" }}>
          <Spin />
        </Flex>
      ) : (
        <Table
          className="EditRowTable"
          columns={columns}
          dataSource={row?.adjustments?.map((adjustment) => {
            return {
              id: adjustment.adjustment_id,
              adjustment: adjustment.description,
              amount: adjustment.amount
            };
          })}
          pagination={false}
          rowClassName="TestRow"
          bordered
          scroll={{ y: height - 400, x: 100 }}
        />
      )}
      <div className="create-adjustment">
        <button className="create-adjustment-btn">
          <Plus size={20} />
          Agregar ajuste
        </button>
      </div>

      <div className="modal-footer">
        <SecondaryButton fullWidth onClick={onCancel}>
          Cancelar
        </SecondaryButton>
        <PrincipalButton disabled={!isEditing} fullWidth onClick={handleSubmit(handleSaveChanges)}>
          Guardar cambios
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalEditRow;
