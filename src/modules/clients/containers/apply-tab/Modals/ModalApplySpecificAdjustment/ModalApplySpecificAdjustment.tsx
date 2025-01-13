import React, { useState } from "react";
import { Modal, Table, InputNumber } from "antd";
import { ColumnsType } from "antd/es/table";
import { CaretLeft, CopySimple } from "phosphor-react";

import { IFinancialDiscount } from "@/hooks/useAcountingAdjustment";
import { formatMoney } from "@/utils/utils";

import UiTabs from "@/components/ui/ui-tabs";
import ItemApplyModal from "@/components/atoms/ItemsApplyModal/ItemsApplyModal";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";

import "./modalApplySpecificAdjustment.scss";

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

      // set the new value to the current adjustment
      let newValue = prev[index];
      if (valueApplied > previousValue) {
        // If the new value is greater than the previous value, decrease the adjustment
        newValue = prev[index] - (valueApplied - previousValue);
      } else if (valueApplied < previousValue) {
        // If the new value is less, increase the adjustment
        newValue = prev[index] + (previousValue - valueApplied);
      }

      // Ensure the new value doesn't go below zero
      newValue = Math.max(0, newValue);

      return prev.map((value, i) => (i === index ? newValue : value));
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
            new_balance: invoice.new_balance - difference
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
          formatter={(value) => {
            if (!value) return ""; // Prevent formatting null/undefined values
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format properly for thousands separators
          }}
          parser={(value) => Number(value?.replace(/\./g, "") || 0)}
          onBlur={(event) => {
            console.log("target", event.target.value);
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

      <Table dataSource={currentInvoices} columns={columns} pagination={false} rowKey="id" />

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
    current_value: 1000000,
    new_balance: 1000000
  },
  {
    id: 2,
    id_erp: "123457",
    current_value: 2000000,
    new_balance: 2000000
  },
  {
    id: 3,
    id_erp: "123458",
    current_value: 300000,
    new_balance: 300000
  }
];
