import React, { useState } from "react";
import { Button, Flex, Spin } from "antd";
import Collapse from "@/components/ui/collapse";
import LabelCollapse from "@/components/ui/label-collapse";
import UiSearchInput from "@/components/ui/search-input/search-input";
import "./apply-tab.scss";
import { SectionData } from "./tables/Types";
import InvoiceTable from "./tables/InvoiceTable";
import PaymentsTable from "./tables/PaymentsTable";
import DiscountTable from "./tables/DiscountTable";
import { Plus } from "phosphor-react";

import { useSelectedPayments } from "@/context/SelectedPaymentsContext";
import { ModalResultAppy } from "./Modals/ModalResultApply/ModalResultAppy";
import ModalAddInvoice from "./Modals/ModalAddInvoice/ModalAddInvoice";
import { ModalSelectAjustements } from "./Modals/ModalSelectAjustements/ModalSelectAjustements";

const ApplyTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //TODO this is the context that is not being used
  // const { selectedPayments } = useSelectedPayments();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [modalActionPayment, setModalActionPayment] = useState(
    {} as { isOpen: boolean; modal: number }
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd = () => {
    // Handle adding selected invoices
    setIsModalVisible(false);
  };

  const data: SectionData[] = [
    {
      statusName: "pagos",
      color: "#0085FF",
      statusId: 2,
      invoices: [
        {
          id: "175356",
          key: "1",
          payments: 175356,
          date: "06/06/2024",
          amount: 2000000,
          appliedAmount: 2000000,
          balance: 0
        },
        {
          id: "175357",
          key: "2",
          payments: 175357,
          date: "07/06/2024",
          amount: 1500000,
          appliedAmount: 1500000,
          balance: 0
        },
        {
          id: "175358",
          key: "3",
          payments: 175358,
          date: "08/06/2024",
          amount: 3000000,
          appliedAmount: 2500000,
          balance: 500000
        },
        {
          id: "175359",
          key: "4",
          payments: 175359,
          date: "09/06/2024",
          amount: 1800000,
          appliedAmount: 1800000,
          balance: 0
        }
      ],
      total: 8300000,
      count: 4
    },
    {
      statusName: "facturas",
      color: "#FF7A00",
      statusId: 1,
      invoices: [
        {
          id: "275356",
          key: "1",
          payments: 275356,
          date: "06/06/2024",
          amount: 2000000,
          appliedAmount: 2000000,
          balance: 0
        },
        {
          id: "275357",
          key: "2",
          payments: 275357,
          date: "07/06/2024",
          amount: 1500000,
          appliedAmount: 1000000,
          balance: 500000
        },
        {
          id: "275358",
          key: "3",
          payments: 275358,
          date: "08/06/2024",
          amount: 3000000,
          appliedAmount: 3000000,
          balance: 0
        },
        {
          id: "275359",
          key: "4",
          payments: 275359,
          date: "09/06/2024",
          amount: 1800000,
          appliedAmount: 1800000,
          balance: 0
        },
        {
          id: "275360",
          key: "5",
          payments: 275360,
          date: "10/06/2024",
          amount: 2500000,
          appliedAmount: 2000000,
          balance: 500000
        }
      ],
      total: 10800000,
      count: 5
    },
    {
      statusName: "ajustes",
      color: "#E53261",
      statusId: 3,
      invoices: [
        {
          id: "375356",
          key: "1",
          adjustmentId: 375356,
          adjustmentType: "descuento",
          invoices: 5,
          amount: 500000,
          appliedAmount: 500000,
          balance: 0
        },
        {
          id: "375357",
          key: "2",
          adjustmentId: 375357,
          adjustmentType: "recargo",
          invoices: 3,
          amount: 300000,
          appliedAmount: 300000,
          balance: 0
        },
        {
          id: "375358",
          key: "3",
          adjustmentId: 375358,
          adjustmentType: "descuento",
          invoices: 2,
          amount: 200000,
          appliedAmount: 150000,
          balance: 50000
        }
      ],
      total: 1000000,
      count: 3
    }
  ];

  return (
    <>
      <ModalResultAppy invoices={10800000} desconts={1000000} payments={8300000} />
      <div className="applyContainerTab">
        <Flex justify="space-between" className="accountingAdjustmentsTab__header">
          <Flex gap={"0.5rem"}>
            <UiSearchInput
              className="search"
              placeholder="Buscar"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            {/* <AccountingAdjustmentsFilter onFilterChange={setFilters} /> */}
          </Flex>
          <Button
            type="primary"
            className="availableAdjustments"
            onClick={() => console.log("click ajustes disponibles")}
          >
            Guardar
          </Button>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" style={{ height: "3rem" }}>
            <Spin />
          </Flex>
        ) : (
          <Collapse
            items={data?.map((section: SectionData) => ({
              key: section.statusId,
              label: (
                <Flex>
                  <LabelCollapse
                    status={section.statusName}
                    color={section.color}
                    total={section.total}
                    quantity={section.count}
                  />

                  <Flex
                    className="buttonActionApply"
                    onClick={() => {
                      if (section.statusName === "facturas") {
                        showModal();
                      }
                      if (section.statusName === "ajustes") {
                        setModalActionPayment(
                          modalActionPayment.isOpen
                            ? { isOpen: false, modal: 0 }
                            : { isOpen: true, modal: 0 }
                        );
                      }
                    }}
                  >
                    <Plus />
                    <h5 className="">Agregar {`${section.statusName}`}</h5>
                  </Flex>
                </Flex>
              ),
              children: (
                <div>
                  {section.statusName === "facturas" && <InvoiceTable data={section.invoices} />}
                  {section.statusName === "pagos" && <PaymentsTable data={section.invoices} />}
                  {section.statusName === "ajustes" && <DiscountTable data={section.invoices} />}
                </div>
              )
            }))}
          />
        )}
      </div>
      <ModalAddInvoice visible={isModalVisible} onCancel={handleCancel} onAdd={handleAdd} />
      <ModalSelectAjustements
        isOpen={modalActionPayment && (modalActionPayment.isOpen || modalActionPayment.modal === 0)}
        onClose={() =>
          setModalActionPayment({
            isOpen: false,
            modal: 0
          })
        }
        setModalAction={(e: number) => {
          setModalActionPayment({
            isOpen: true,
            modal: e
          });
        }}
      />
    </>
  );
};

export default ApplyTab;
