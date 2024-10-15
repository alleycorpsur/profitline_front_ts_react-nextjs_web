"use client";

import ClientDetails from "@/modules/clients/containers/client-details";
import { MessageProvider } from "@/context/MessageContext";
import { SelectedPaymentsProvider } from "@/context/SelectedPaymentsContext";

function ClientDetailPage() {
  return (
    <SelectedPaymentsProvider>
      <MessageProvider>
        <ClientDetails />
      </MessageProvider>
    </SelectedPaymentsProvider>
  );
}

export default ClientDetailPage;
