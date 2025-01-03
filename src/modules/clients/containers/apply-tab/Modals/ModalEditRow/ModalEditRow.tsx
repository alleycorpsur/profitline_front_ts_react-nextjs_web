import React from "react";
import { Flex, Modal, Spin, Table } from "antd";
import { Plus } from "phosphor-react";

import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";

import "./modalEditRow.scss";
import { formatMoney } from "@/utils/utils";
import { InputFormMoney } from "@/components/atoms/inputs/InputFormMoney/InputFormMoney";
import { useForm } from "react-hook-form";

interface IApplicationTabRow {
  id: number;
  adjustment: string;
  amount: number;
  date: string;
}

interface ModalEditRowProps {
  visible: boolean;
  onCancel: () => void;
}

const ModalEditRow: React.FC<ModalEditRowProps> = ({ visible, onCancel }) => {
  const {
    control,
    formState: { errors }
  } = useForm<IApplicationTabRow>();

  const isLoading = false;
  const columns = [
    {
      title: "Ajuste",
      dataIndex: "adjustment",
      key: "adjustment",
      render: (adjustment: string) => <p>{adjustment}</p>,
      width: "50%"
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const,
      render: () => (
        <InputFormMoney
          nameInput="amount"
          control={control}
          error={errors.amount}
          typeInput="number"
          customStyle={{ width: "100%" }}
        />
      )
    }
  ];

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={650} className="modalEditRow">
      <div onClick={onCancel} className="header">
        <h2>Factura 123456</h2>
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
        <PrincipalButton fullWidth onClick={() => 0}>
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
    adjustment: "Ajuste 1",
    amount: 1000,
    date: "2021-10-10"
  }
];
