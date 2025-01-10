import React, { useState, Dispatch, SetStateAction } from "react";
import { Modal, Table, InputNumber, Button } from "antd";
import { ColumnsType } from "antd/es/table";

import { IFinancialDiscount } from "@/hooks/useAcountingAdjustment";

import UiTabs from "@/components/ui/ui-tabs";
import ItemApplyModal from "@/components/atoms/ItemsApplyModal/ItemsApplyModal";

import "./modalApplySpecificAdjustment.scss";
import loading from "@/app/banco/loading";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import { CaretLeft, CopySimple } from "phosphor-react";
import { formatMoney } from "@/utils/utils";

interface Props {
  open: boolean;
  onCancel: () => void;
  selectedAdjustments: IFinancialDiscount[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICurrentInvoice {
  id: number;
  id_erp?: string;
  current_value: number;
  new_balance: number;
}

const ModalApplySpecificAdjustment = ({
  open,
  onCancel,
  selectedAdjustments,
  setIsOpen
}: Props) => {
  const [selectTab, setSelectTab] = useState(0);
  const [currentInvoices, setCurrentInvoices] = useState<ICurrentInvoice[]>(mockInvoices);
  const [currentAdjustment, setCurrentAdjustment] = useState<number[]>(
    selectedAdjustments.map((note) => note.current_value)
  );
  console.log("selectedAdjustments", selectedAdjustments);
  const [applyValues, setApplyValues] = useState<{
    [key: string]: {
      balanceToApply: number;
      idAdjustment: number;
    }[];
  }>({});

  const handleValueChange = (valueApplied: number, index: number, record: ICurrentInvoice) => {
    setCurrentAdjustment((prev) => {
      const previousValue =
        applyValues[record.id]?.find(
          (apply) => apply.idAdjustment === selectedAdjustments[index].id
        )?.balanceToApply ?? 0;

      let newValue: number;
      if (record.new_balance < valueApplied) {
        newValue = prev[index] - record.new_balance;
      } else {
        newValue = prev[index] + previousValue - valueApplied;
      }
      return prev.map((value, i) => (i === index ? Math.max(0, newValue) : value));
    });
  };

  const handleApplyValueChange = (value: number | null, record: ICurrentInvoice) => {
    const previousValue =
      applyValues[record.id]?.find(
        (apply) => apply.idAdjustment === selectedAdjustments[selectTab].id
      )?.balanceToApply ?? 0;
    if (value && value > currentAdjustment[selectTab] && previousValue <= 0) {
      value = 0;
    }
    if (value && value > selectedAdjustments[selectTab].current_value) {
      value = 0;
    }
    if (value && value > previousValue && value > currentAdjustment[selectTab] + previousValue) {
      value = previousValue;
    }
    const maxApplicableValue = Math.min(value ?? 0, record.new_balance + previousValue);

    setApplyValues((prev) => ({
      ...prev,
      [record.id]: [
        ...(prev[record.id] ?? []).filter(
          (apply) => apply.idAdjustment !== selectedAdjustments[selectTab].id
        ),
        { balanceToApply: maxApplicableValue, idAdjustment: selectedAdjustments[selectTab].id }
      ]
    }));

    setCurrentInvoices((prev) => {
      return prev.map((invoice) => {
        if (invoice.id === record.id) {
          const difference = maxApplicableValue - previousValue;
          return {
            ...invoice,
            newBalance: invoice.new_balance - difference
          };
        }
        return invoice;
      });
    });
    handleValueChange(value ?? 0, selectTab, record);
  };

  const handleApplyAdjustment = () => {
    console.log(selectedAdjustments);
    const data = selectedAdjustments.map((note, index) => ({
      id: note.id,
      valueApplied: currentAdjustment[index]
    }));
    console.log(data);
    // onApply(data);
  };

  const handlePasteInvoices = async () => {
    try {
      const text = await navigator.clipboard.readText();

      console.info(text);
    } catch (err) {
      console.error("Error pasting invoices:", err);
    }
  };

  const columns: ColumnsType<ICurrentInvoice> = [
    {
      title: "ID Factura",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Pendiente",
      dataIndex: "current_value",
      key: "current_value",
      align: "right",
      render: (val) => `${formatMoney(val)}`
    },
    {
      title: "Saldo nuevo",
      dataIndex: "new_balance",
      key: "new_balance",
      align: "right",
      render: (val) => `${formatMoney(val)}`
    },
    {
      title: "Valor a aplicar",
      key: "applyValue",
      className: "column__apply__value",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={selectedAdjustments[selectTab]?.current_value + 1}
          value={
            applyValues[record.id]?.find(
              (apply) => apply.idAdjustment === selectedAdjustments[selectTab]?.id
            )?.balanceToApply
          }
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          onBlur={(event) => {
            const rawValue = event.target.value.replace(/\./g, "");
            const parsedValue = parseFloat(rawValue);
            handleApplyValueChange(isNaN(parsedValue) ? 0 : parsedValue, record);
          }}
          className="button__number__adjustment"
        />
      )
    }
  ];

  return (
    <Modal
      className="modalApplySpecificAdjustment"
      width={680}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div onClick={onCancel} className="header">
        <CaretLeft size={24} onClick={onCancel} />
        <h2>Aplicar ajuste</h2>
      </div>
      <h2 className="modal-subtitle">Define el monto a aplicar a cada factura</h2>
      {selectedAdjustments.length > 1 && (
        <UiTabs
          tabs={selectedAdjustments.map((row) => row.id.toString())}
          onTabClick={(index) => setSelectTab(index)}
          initialTabIndex={selectTab}
          className="scrollableTabs"
        />
      )}
      <ItemApplyModal
        type={1}
        item={
          selectedAdjustments.length > 1
            ? {
                ...selectedAdjustments[selectTab],
                intialAmount: selectedAdjustments[selectTab].initial_value
              }
            : { ...selectedAdjustments[0], intialAmount: selectedAdjustments[0].initial_value }
        }
        availableValue={currentAdjustment[selectTab]}
      />

      <div className="excel-button-container" onClick={handlePasteInvoices}>
        <CopySimple size={18} />
        Pegar desde excel
      </div>

      <Table dataSource={mockInvoices} columns={columns} pagination={false} rowKey="id" />

      <div className="modal-footer">
        <SecondaryButton fullWidth onClick={onCancel}>
          Cancelar
        </SecondaryButton>
        <PrincipalButton fullWidth onClick={handleApplyAdjustment} loading={false}>
          Agregar
        </PrincipalButton>
      </div>
    </Modal>
  );
};

export default ModalApplySpecificAdjustment;

const mockInvoices = [
  {
    id: 1,
    id_erp: "123456",
    current_value: 1000,
    new_balance: 1000
  },
  {
    id: 2,
    id_erp: "123457",
    current_value: 2000,
    new_balance: 2000
  },
  {
    id: 3,
    id_erp: "123458",
    current_value: 3000,
    new_balance: 3000
  }
];
