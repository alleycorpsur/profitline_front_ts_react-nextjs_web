/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { IPayment } from "@/types/payments/IPayments";

interface SelectedPaymentsContextType {
  selectedPayments: IPayment[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<IPayment[]>>;
  addPayment: (payment: IPayment) => void;
  removePayment: (paymentId: number) => void;
  clearSelectedPayments: () => void;
}

const SelectedPaymentsContext = createContext<SelectedPaymentsContextType | undefined>(undefined);

export const SelectedPaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPayments, setSelectedPayments] = useState<IPayment[]>([]);

  const addPayment = (payment: IPayment) => {
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
