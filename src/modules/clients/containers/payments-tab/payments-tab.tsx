import { useState } from "react";
import { Button, Flex } from "antd";
import { DotsThree, MagnifyingGlassPlus } from "phosphor-react";
import LabelCollapse from "@/components/ui/label-collapse";
import UiSearchInput from "@/components/ui/search-input";
import Collapse from "@/components/ui/collapse";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import PaymentsTable from "@/modules/clients/components/payments-table";
import { IPayment } from "@/types/payments/IPayments";

import "./payments-tab.scss";
import { ModalActionPayment } from "@/components/molecules/modals/ModalActionPayment/ModalActionPayment";

const PaymentsTab = () => {
  const [selectedRows, setSelectedRows] = useState<IPayment[] | undefined>(undefined);
  const [showPaymentDetail, setShowPaymentDetail] = useState<{
    isOpen: boolean;
    paymentId: number;
  }>({} as { isOpen: boolean; paymentId: number });
  const [search, setSearch] = useState("");
  const [isModalActionPaymentOpen, setIsModalActionPaymentOpen] = useState(false);

  return (
    <>
      <div className="paymentsTab">
        <Flex justify="space-between" className="paymentsTab__header">
          <Flex gap={"0.5rem"}>
            <UiSearchInput
              className="search"
              placeholder="Buscar"
              onChange={(event) => {
                setTimeout(() => {
                  setSearch(event.target.value);
                }, 1000);
              }}
            />
            <UiFilterDropdown />
            <Button
              className="button__actions"
              size="large"
              icon={<DotsThree size={"1.5rem"} />}
              disabled={false}
              onClick={() => setIsModalActionPaymentOpen(true)}
            >
              Generar acción
            </Button>
            <DotsDropdown />
          </Flex>

          <Button type="primary" className="identifiyPayment">
            Identificar pago
            <MagnifyingGlassPlus size={16} style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Flex>

        <Collapse
          items={mockData?.map((PaymentStatus) => ({
            key: PaymentStatus.status_id,
            label: <LabelCollapse status={PaymentStatus.status_name} color={PaymentStatus.color} />,
            children: (
              <PaymentsTable
                setShowPaymentDetail={setShowPaymentDetail}
                paymentStatusId={PaymentStatus.status_id}
                paymentsByStatus={PaymentStatus.payments}
                setSelectedRows={setSelectedRows}
              />
            )
          }))}
        />
      </div>
      <ModalActionPayment
        isOpen={isModalActionPaymentOpen}
        onClose={() => setIsModalActionPaymentOpen(false)}
      />
    </>
  );
};

export default PaymentsTab;

const mockData = [
  {
    status_id: 1,
    status_name: "Pagos disponibles",
    color: "#2fb300",
    payments: [
      {
        id: 1,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 1234563423,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 1
      },
      {
        id: 2,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 1234565235,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 1
      },
      {
        id: 3,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 123456456,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 1
      },
      {
        id: 4,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 123456859,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 1
      }
    ]
  },
  {
    status_id: 2,
    status_name: "Pagos radicados",
    color: "#FFD700",
    payments: [
      {
        id: 5,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 1234561143,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 2
      },
      {
        id: 6,
        entered: "2021-10-10",
        identified: "2021-10-10",
        reference: 1234566737,
        amount: 20000000,
        available: 10000000,
        payment_status_id: 2
      }
    ]
  }
];
