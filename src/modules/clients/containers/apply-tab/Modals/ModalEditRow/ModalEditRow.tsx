import React, { use, useEffect, useState } from "react";
import { Button, Flex, Modal, Spin, Table, TableProps } from "antd";
import { PencilLine, Plus, Trash } from "phosphor-react";
import { useForm } from "react-hook-form";

import { formatMoney } from "@/utils/utils";

import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";

import "./modalEditRow.scss";

interface IApplicationTabRow {
  id: number;
  adjustment: string;
  amount: number;
  date: string;
}

interface IFormValues {
  adjustments: IApplicationTabRow[];
}
interface ModalEditRowProps {
  visible: boolean;
  onCancel: () => void;
}

const ModalEditRow: React.FC<ModalEditRowProps> = ({ visible, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<IFormValues>({
    defaultValues: {
      adjustments: mockData
    }
  });

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
                error={errors?.adjustments?.[index]?.amount}
                typeInput="number"
                customStyle={{ width: "80%", textAlign: "center" }}
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

  const handleSaveChanges = (adjustmentsData: IFormValues) => {
    console.info("Save changes", adjustmentsData);
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={650} className="modalEditRow">
      <div className="header">
        <h2>Factura 123456</h2>
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
          dataSource={mockData}
          pagination={false}
          rowClassName="TestRow"
          bordered
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
        <PrincipalButton fullWidth onClick={handleSubmit(handleSaveChanges)}>
          Guardar cambios
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalEditRow;

const mockData = [
  {
    id: 1,
    adjustment: "Factura",
    amount: 1230,
    date: "2021-10-10"
  },
  {
    id: 2,
    adjustment: "Retefuente",
    amount: 4000,
    date: "2021-10-10"
  }
];
