import React, { useContext, useEffect, useState } from "react";
import { Modal, Typography, Button, Table, Flex, Radio, Spin } from "antd";
import { CaretLeft, Eye } from "phosphor-react";
import { ColumnsType } from "antd/es/table";
import styles from "./ChangeWarehouse.module.scss";
import { useAppStore } from "@/lib/store/store";
import { getInventoriesWarehouse, getWarehouseProducts } from "@/services/commerce/commerce";
import { inventoriesByWarehouseMock, warehouseProductsStockMock } from "./mocked";
import FooterButtons from "@/components/atoms/FooterButtons/FooterButtons";
const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  defaultWarehouse: number;
  //onConfirm: () => void;
  onClose: () => void;
}
export interface InventoriesByWarehouse {
  id: number;
  warehouseName: string;
  stockAvailable: boolean;
}

export interface WarehouseProductsStock {
  id: number;
  productName: string;
  orderQuantity: number;
  stock: number;
}

export const ChangeWarehouseModal: React.FC<Props> = ({
  defaultWarehouse,
  isOpen,
  onClose
  // onConfirm
}) => {
  const [view, setView] = useState<"change-warehouse" | "warehouse-detail">("change-warehouse");
  const [warehouseSelected, setWarehouseSelected] = useState<number | null>(defaultWarehouse);
  const [viewWarehouseDetails, setViewWarehouseDetails] = useState<InventoriesByWarehouse | null>(
    null
  );
  const { ID: projectId } = useAppStore((state) => state.selectedProject);

  const [loading, setLoading] = useState(false);
  const [inventoriesByWarehouse, setInventoriesByWarehouse] = useState<InventoriesByWarehouse[]>(
    []
  );
  const [warehouseProductsStock, setWarehouseProductsStock] = useState<WarehouseProductsStock[]>(
    []
  );

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      //const response = await getInventoriesWarehouse(projectId);
      // if (response.data) {
      setTimeout(() => {
        setInventoriesByWarehouse(inventoriesByWarehouseMock);
      }, 3000);
      // }
      setLoading(false);
    };
    fetchDiscounts();
  }, []);
  console.log("inventoriesByWarehouse", inventoriesByWarehouse);

  useEffect(() => {
    const fetchWarehouseStock = async () => {
      setLoading(true);
      // if (viewWarehouseDetails?.id) {
      //   const response = await getWarehouseProducts(projectId, viewWarehouseDetails?.id);
      //   // if (response.data) {
      //   setWarehouseProductsStock(warehouseProductsStockMock);
      //   // }
      // }
      setTimeout(() => {
        setWarehouseProductsStock(warehouseProductsStockMock);
      }, 3000);
      setLoading(false);
    };
    fetchWarehouseStock();
  }, [viewWarehouseDetails?.id]);

  const columns: ColumnsType<InventoriesByWarehouse> = [
    {
      title: "Bodega",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (warehouseName, record) => (
        <Flex gap={12}>
          <Radio
            checked={warehouseSelected === record.id}
            onChange={() => setWarehouseSelected(record.id)}
          />
          <Text>{warehouseName}</Text>
        </Flex>
      )
    },
    {
      title: "Inventario",
      dataIndex: "stockAvailable",
      key: "stockAvailable",
      render: (stockAvailable: number) => (
        <Text {...(stockAvailable && { type: "success" })}>
          {!!stockAvailable ? "Stock disponible" : "No hay stock"}
        </Text>
      )
    },
    {
      title: "Detalle",
      dataIndex: "pendiente",
      key: "pendiente"
    },
    {
      title: "",
      key: "buttonSee",
      dataIndex: "",

      render: (_, row) => (
        <Button
          onClick={() => {
            setView("warehouse-detail");
            setViewWarehouseDetails(row);
          }}
          icon={<Eye size={"1.3rem"} />}
        />
      )
    }
  ];
  const columnsDetails: ColumnsType<WarehouseProductsStock> = [
    {
      title: "Producto",
      dataIndex: "productName",
      key: "productName"
    },
    {
      title: "Pedido",
      dataIndex: "orderQuantity",
      key: "orderQuantity"
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number, record: WarehouseProductsStock) => (
        <Text {...(stock < record.orderQuantity && { type: "danger" })}>{stock}</Text>
      )
    }
  ];
  const onSubmit = () => {
    console.log("Form submitted with data:", warehouseSelected);
    // Here you would typically send the data to an API
    onClose();
  };

  const renderView = () => {
    switch (view) {
      case "change-warehouse":
        return <Table dataSource={inventoriesByWarehouse} columns={columns} pagination={false} />;
      case "warehouse-detail":
        return (
          <Table dataSource={warehouseProductsStock} columns={columnsDetails} pagination={false} />
        );
      default:
        return <Table dataSource={inventoriesByWarehouse} columns={columns} pagination={false} />;
    }
  };

  if (loading) return <Spin />;

  return (
    <Modal
      width={686}
      open={isOpen}
      title={
        <Flex gap={8} align="center" style={{ alignItems: "center" }}>
          <Button
            //className={styles.goBackButton}
            type="text"
            onClick={() => {
              if (view === "change-warehouse") {
                onClose();
              } else {
                setView("change-warehouse");
                setViewWarehouseDetails(null);
              }
            }}
            icon={<CaretLeft size={"1.3rem"} />}
          />
          <Title level={4} style={{ marginBottom: 0 }}>
            {view === "change-warehouse"
              ? "Cambiar bodega"
              : `Bodega ${viewWarehouseDetails?.warehouseName}`}
          </Title>
        </Flex>
      }
      footer={
        view === "change-warehouse" && (
          <FooterButtons
            titleConfirm="Guardar bodega"
            isConfirmDisabled={false}
            onClose={onClose}
            handleOk={onSubmit}
          />
        )
      }
      onCancel={onClose}
      className="agreement-detail-modal"
      closeIcon={null}
    >
      {renderView()}
    </Modal>
  );
};
