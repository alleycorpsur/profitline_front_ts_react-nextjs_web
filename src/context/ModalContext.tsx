"use Client";
import React, { createContext, useContext, useState, ReactNode } from "react";

import { IInvoice } from "@/types/invoices/IInvoices";
import { FinancialDiscount } from "@/types/financialDiscounts/IFinancialDiscounts";
import InvoiceDetailModal from "@/modules/clients/containers/invoice-detail-modal";
import ModalDetailAdjustment from "@/components/molecules/modals/ModalDetailAdjustment/ModalDetailAdjustment";
import MoldalNoveltyDetail from "@/components/molecules/modals/MoldalNoveltyDetail/MoldalNoveltyDetail";
import ModalDetailPayment from "@/components/molecules/modals/ModalDetailPayment/ModalDetailPayment";

type ModalType = "invoice" | "novelty" | "adjustment" | "payment" | null;

interface InvoiceModalProps {
  invoiceId: number;
  clientId: number;
  showId: string;
  hiddenActions?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleActionInDetail?: (invoice: IInvoice) => void;
  selectInvoice?: IInvoice;
  projectId?: number;
}

interface NoveltyModalProps {
  noveltyId: number;
}

interface AdjustmentModalProps {
  clientId: number;
  selectAdjusment?: FinancialDiscount;
  projectId: number;
  legalized?: boolean;
  adjusmentId?: number;
}

interface ModalDetailPaymentProps {
  paymentId: number;
  projectId: number;
}

type ModalProps =
  | InvoiceModalProps
  | NoveltyModalProps
  | AdjustmentModalProps
  | ModalDetailPaymentProps;

interface ModalContextType {
  // eslint-disable-next-line no-unused-vars
  openModal: (type: ModalType, props: ModalProps) => void;
  closeModal: () => void;
  modalType: ModalType;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const openModal = (type: ModalType, props: ModalProps) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {children}
      {modalType === "invoice" && modalProps && (
        <InvoiceDetailModal
          isOpen={true}
          onClose={closeModal}
          {...(modalProps as InvoiceModalProps)}
        />
      )}
      {modalType === "novelty" && modalProps && (
        <MoldalNoveltyDetail
          isOpen={true}
          onClose={closeModal}
          {...(modalProps as NoveltyModalProps)}
        />
      )}
      {modalType === "adjustment" && modalProps && (
        <ModalDetailAdjustment
          isOpen={true}
          onClose={closeModal}
          {...(modalProps as AdjustmentModalProps)}
        />
      )}
      {modalType === "payment" && modalProps && (
        <ModalDetailPayment
          isOpen={true}
          onClose={closeModal}
          {...(modalProps as ModalDetailPaymentProps)}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModalDetail = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
