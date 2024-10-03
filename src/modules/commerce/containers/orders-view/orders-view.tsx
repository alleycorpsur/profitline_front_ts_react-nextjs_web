import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Flex, MenuProps } from "antd";

import { useAppStore } from "@/lib/store/store";
import { deleteOrders, getAllOrders } from "@/services/commerce/commerce";
import { useMessageApi } from "@/context/MessageContext";

import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import LabelCollapse from "@/components/ui/label-collapse";
import Collapse from "@/components/ui/collapse";
import OrdersViewTable from "../../components/orders-view-table/orders-view-table";
import { ModalRemove } from "@/components/molecules/modals/ModalRemove/ModalRemove";
import { OrdersGenerateActionModal } from "../../components/orders-generate-action-modal/orders-generate-action-modal";

import { IOrder } from "@/types/commerce/ICommerce";

import styles from "./orders-view.module.scss";
interface IOrdersByCategory {
  status: string;
  color: string;
  count: number;
  orders: IOrder[];
}

export const OrdersView: FC = () => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const [ordersByCategory, setOrdersByCategory] = useState<IOrdersByCategory[]>();
  const [isOpenModalRemove, setIsOpenModalRemove] = useState<boolean>(false);
  const [isGenerateActionModalOpen, setIsGenerateActionModalOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<IOrder[]>();
  const [fetchMutate, setFetchMutate] = useState<boolean>(false);

  const { showMessage } = useMessageApi();

  const fetchOrders = async () => {
    const response = await getAllOrders(projectId);
    if (response.status === 200) {
      setOrdersByCategory(response.data);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchOrders();
  }, [projectId, fetchMutate]);

  const handleDeleteOrders = async () => {
    const selectedOrdersIds = selectedRows?.map((order) => order.id);
    if (!selectedOrdersIds) return;
    await deleteOrders(selectedOrdersIds, showMessage);
    setIsOpenModalRemove(false);
    fetchOrders();
  };

  const handleisGenerateActionOpen = () => {
    if (selectedRows?.length === 0) {
      showMessage("error", "Selecciona al menos un pedido");
      return;
    }
    setIsGenerateActionModalOpen(!isGenerateActionModalOpen);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button className="buttonOutlined" onClick={() => setIsOpenModalRemove(true)}>
          Eliminar
        </Button>
      )
    },
    {
      key: "2",
      label: (
        <Button className="buttonOutlined" onClick={handleisGenerateActionOpen}>
          Generar acción
        </Button>
      )
    }
  ];

  return (
    <div className={styles.ordersView}>
      <Flex className={styles.FlexContainer} vertical>
        <Flex className={styles.header}>
          <UiSearchInput
            placeholder="Buscar"
            onChange={(event) => {
              setTimeout(() => {
                console.info(event.target.value);
              }, 1000);
            }}
          />
          <FilterDiscounts />
          <DotsDropdown items={items} />
          <Link href="/comercio/pedido" className={styles.ctaButton}>
            <PrincipalButton>Crear orden</PrincipalButton>
          </Link>
        </Flex>
        <Collapse
          items={ordersByCategory?.map((order) => ({
            key: order.status,
            label: (
              <LabelCollapse
                status={order.status}
                quantity={order.orders.length}
                color={order.color}
                removeIcons
              />
            ),
            children: (
              <OrdersViewTable
                dataSingleOrder={order.orders}
                setSelectedRows={setSelectedRows}
                orderStatus={order.status}
              />
            )
          }))}
        />
      </Flex>
      <ModalRemove
        isMassiveAction={true}
        name="pedidos"
        isOpen={isOpenModalRemove}
        onClose={() => setIsOpenModalRemove(false)}
        onRemove={handleDeleteOrders}
      />
      <OrdersGenerateActionModal
        isOpen={isGenerateActionModalOpen}
        onClose={() => setIsGenerateActionModalOpen((prev) => !prev)}
        ordersId={selectedRows?.map((order) => order.id) || []}
        setFetchMutate={setFetchMutate}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
};

export default OrdersView;
