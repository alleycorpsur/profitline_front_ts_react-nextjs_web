import React from "react";
import { Modal, Button } from "antd";
import { Wallet } from "phosphor-react";
import "./modalNextConcilation.scss";
import { InfoConcilation } from "@/types/concilation/concilation";

interface Props {
  visible: boolean;
  onClose: () => void;
  changeView: () => void;
  invoices?: InfoConcilation;
}

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const ModalNextConcilation = ({ visible, onClose, changeView, invoices }: Props) => {
  const percentage = calculatePercentage(invoices);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={"48%"}
      className="modal-next-concilation"
    >
      <div className="modal-content">
        <div className="icon-wrapper">
          <Wallet size={22} />
        </div>
        <h2>¡Cartera conciliada!</h2>
        <h3>El <span className="semi-bold">{percentage.toFixed(2)}%</span> de la cartera fue conciliada</h3>
        {invoices && (
          <>
            <label className="text_conciliation">
              Factura conciliadas: <span className="semi-bold">{formatNumber(invoices.reconciled_invoices.invoices.length)}</span>
            </label>
            <label className="text_conciliation">
              Facturas con diferencia de precios:{" "}
              <span className="semi-bold">{formatNumber(invoices.invoices_with_differences.invoices.length)}</span>
            </label>
            <label className="text_conciliation">
              Facturas no cargadas: <span className="semi-bold">{formatNumber(invoices.invoices_not_found?.invoices?.length || 0)}</span>
            </label>
          </>
        )}

        <div className="button-row">
          <Button
            className="button__action__text button__action__text__white"
            type="primary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className=" button__action__text  button__action__text__green"
            onClick={changeView}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const calculatePercentage = (invoices: InfoConcilation | undefined) => {
  const totalInvoices =
    (invoices?.reconciled_invoices.invoices.length ?? 0) +
    (invoices?.invoices_not_found.invoices.length ?? 0) +
    (invoices?.invoices_with_differences.invoices.length ?? 0);
  const reconciledInvoices = invoices?.reconciled_invoices.invoices.length ?? 0;
  return (reconciledInvoices / totalInvoices) * 100;
};
