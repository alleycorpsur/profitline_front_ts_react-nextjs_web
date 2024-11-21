import { useEffect, useState } from "react";
import { Button, Flex, Spin } from "antd";
import { DotsThree, MagnifyingGlassPlus } from "phosphor-react";

import { useSelectedPayments } from "@/context/SelectedPaymentsContext";
import { useClientsPayments } from "@/hooks/useClientsPayments";

import LabelCollapse from "@/components/ui/label-collapse";
import UiSearchInput from "@/components/ui/search-input";
import Collapse from "@/components/ui/collapse";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import PaymentsTable from "@/modules/clients/components/payments-table";

import { ModalActionPayment } from "@/components/molecules/modals/ModalActionPayment/ModalActionPayment";

import "./payments-tab.scss";
import { useParams } from "next/navigation";
import { extractSingleParam } from "@/utils/utils";

interface PaymentProd {
  // eslint-disable-next-line no-unused-vars
  onChangeTab: (activeKey: string) => void;
}

const PaymentsTab: React.FC<PaymentProd> = ({ onChangeTab }) => {
  const { selectedPayments, setSelectedPayments } = useSelectedPayments();
  const [showPaymentDetail, setShowPaymentDetail] = useState<{
    isOpen: boolean;
    paymentId: number;
  }>({} as { isOpen: boolean; paymentId: number });
  const [search, setSearch] = useState("");
  const [isModalActionPaymentOpen, setIsModalActionPaymentOpen] = useState(false);
  const params = useParams();

  const clientIdParam = extractSingleParam(params.clientId);
  const projectIdParam = extractSingleParam(params.projectId);

  const clientId = clientIdParam ? parseInt(clientIdParam) : 0;
  const projectId = projectIdParam ? parseInt(projectIdParam) : 0;

  const { data, isLoading, error } = useClientsPayments({ projectId, clientId });
  console.log("data", data);

  useEffect(() => {
    console.log("selectedPayments", selectedPayments);
  }, [selectedPayments]);

  const onChangetabWithCloseModal = (activeKey: string) => {
    setIsModalActionPaymentOpen(false);
    onChangeTab(activeKey);
  };

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

        {isLoading ? (
          <Spin />
        ) : (
          <Collapse
            items={data?.map((PaymentStatus) => ({
              key: PaymentStatus.payments_status_id,
              label: (
                <LabelCollapse status={PaymentStatus.payments_status} color={PaymentStatus.color} />
              ),
              children: (
                <PaymentsTable
                  setShowPaymentDetail={setShowPaymentDetail}
                  paymentStatusId={PaymentStatus.payments_status_id}
                  paymentsByStatus={PaymentStatus.payments}
                  setSelectedRows={setSelectedPayments}
                />
              )
            }))}
          />
        )}
      </div>
      <ModalActionPayment
        isOpen={isModalActionPaymentOpen}
        onClose={() => setIsModalActionPaymentOpen(false)}
        onChangeTab={onChangetabWithCloseModal}
      />
    </>
  );
};

export default PaymentsTab;
