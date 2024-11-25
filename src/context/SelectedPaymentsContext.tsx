/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { IClientPayment } from "@/types/clientPayments/IClientPayments";

interface SelectedPaymentsContextType {
  selectedPayments: IClientPayment[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<IClientPayment[]>>;
  addPayment: (payment: IClientPayment) => void;
  removePayment: (paymentId: number) => void;
  clearSelectedPayments: () => void;
}

const SelectedPaymentsContext = createContext<SelectedPaymentsContextType | undefined>(undefined);

export const SelectedPaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPayments, setSelectedPayments] = useState<IClientPayment[]>([]);

  const addPayment = (payment: IClientPayment) => {
    setSelectedPayments((prev) => [...prev, payment]);
  };

  const removePayment = (paymentId: number) => {
    setSelectedPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
  };

  const clearSelectedPayments = () => {
    setSelectedPayments([]);
  };

  return (
    <SelectedPaymentsContext.Provider
      value={{
        selectedPayments,
        setSelectedPayments,
        addPayment,
        removePayment,
        clearSelectedPayments
      }}
    >
      {children}
    </SelectedPaymentsContext.Provider>
  );
};

export const useSelectedPayments = () => {
  const context = useContext(SelectedPaymentsContext);
  if (context === undefined) {
    throw new Error("useSelectedPayments must be used within a SelectedPaymentsProvider");
  }
  return context;
};
