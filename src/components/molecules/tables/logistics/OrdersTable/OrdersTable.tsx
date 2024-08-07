import { useEffect, useState } from "react";
import { Avatar, Button, Checkbox, Collapse, Flex, Spin, Table, Tabs, Typography } from "antd";
import type { TableProps } from "antd";
import { Clipboard, DotsThree, Eye, Plus, Triangle } from "phosphor-react";

import { FilterProjects } from "@/components/atoms/Filters/FilterProjects/FilterProjects";
import { useProjects } from "@/hooks/useProjects";
import { useAppStore } from "@/lib/store/store";

import "./orderstable.scss";
import UiSearchInput from "@/components/ui/search-input";
import { countries } from "@/utils/countries";
import { ITransferOrderList, TransferOrderListItems } from "@/types/logistics/schema";
import { getAllTransferOrderList } from "@/services/logistics/transfer-orders";
import Link from "next/link";
import LabelCollapse from "@/components/ui/label-collapse";

const { Text } = Typography;

export const OrdersTable = () => {
  const [selectFilters, setSelectFilters] = useState({
    country: [] as string[],
    currency: [] as string[]
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ordersId, setOrdersId] = useState<number[]>([]);
  const { loading, data } = useProjects({
    page: selectFilters.country.length !== 0 || selectFilters.currency.length !== 0 ? 1 : page,
    currencyId: selectFilters.currency,
    countryId: selectFilters.country,
    searchQuery: ""
  });

  const [transferOrderList, setTransferOrderList] = useState<ITransferOrderList[]>([]);

  useEffect(() => {
    loadTransferOrders();
  });

  const loadTransferOrders = async () => {
    if (transferOrderList.length > 0) return;
    const result = await getAllTransferOrderList();
    if (result.data.data.length > 0) {
      setTransferOrderList(result.data.data);
    }
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setOrdersId((prevOrdersId) =>
      checked ? [...prevOrdersId, id] : prevOrdersId.filter((orderId) => orderId !== id)
    );
  };

  console.log("ordersId:", ordersId);

  const columns: TableProps<TransferOrderListItems>["columns"] = [
    {
      title: "",
      key: "buttonSee",
      width: "54px",
      dataIndex: "",
      render: (_, { id }) => (
        <Checkbox
          checked={ordersId.includes(id)}
          onChange={(e) => handleCheckboxChange(id, e.target.checked)}
        />
      )
    },
    {
      title: "TO",
      dataIndex: "id",
      className: "tableTitle",
      key: "id",
      width: "54px",
      render: (text, { id }) => (
        <Link href={`/logistics/orders/details/${id}`}>
          <Text style={{ color: "blue", textDecorationLine: "underline" }}>{text}</Text>
        </Link>
      ),
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "Origen y destino",
      dataIndex: "origin",
      className: "tableTitle",
      key: "origin",
      render: (_, { start_location, end_location }) => (
        <>
          <small>
            <b>Origen&nbsp;&nbsp;&nbsp;</b>
            <Text>{start_location}</Text>
          </small>
          <br></br>
          <small>
            <b>Destino&nbsp;&nbsp;</b>
            <Text>{end_location}</Text>
          </small>
        </>
      ),
      sorter: (a, b) => a.start_location.localeCompare(b.start_location)
    },
    {
      title: "Fechas",
      dataIndex: "dates",
      className: "tableTitle",
      key: "dates",
      width: "250px",
      render: (_, { start_date, end_date }) => (
        <>
          <small>
            <Text>{start_date}</Text>
          </small>
          <br></br>
          <small>
            <Text>{end_date}</Text>
          </small>
        </>
      ),
      sorter: (a, b) => {
        if (new Date(a.start_date).getTime() === new Date(b.start_date).getTime()) {
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        }
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      }
    },
    {
      title: "Tipo de viaje",
      className: "tableTitle",
      dataIndex: "service_type",
      key: "service_type",
      width: "120px",
      sorter: (a, b) => a.service_type.localeCompare(b.service_type)
    },
    {
      title: "Tiempo transcurrido",
      key: "time",
      className: "tableTitle",
      dataIndex: "time",
      width: "200px",
      render: (text) => <Text>0 min</Text>,
      sorter: (a, b) => Number(a.time) - Number(b.time)
    },
    {
      title: "Valor",
      key: "amount",
      className: "tableTitle",
      dataIndex: "amount",
      width: "200px",
      render: (text) => <Text>$ 0.00</Text>,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "",
      key: "buttonSee",
      width: "54px",
      dataIndex: "",
      render: (_, { id }) => (
        <Button
          href={`/logistics/orders/details/${id}`}
          className="icon-detail"
          icon={<Eye size={20} />}
        />
      )
    }
  ];

  return (
    <main className="mainProjectsTable">
      <Flex justify="space-between" className="mainProjectsTable_header">
        <Flex gap={"10px"}>
          <UiSearchInput
            className="search"
            placeholder="Buscar"
            onChange={(event) => {
              setTimeout(() => {
                setSearch(event.target.value);
              }, 1000);
            }}
          />
          <FilterProjects setSelecetedProjects={setSelectFilters} height="48" />
          <Button
            className="options"
            icon={<DotsThree size={"1.5rem"} />}
            href={`transfer-request`}
            disabled={ordersId.length === 0}
          >
            Generar TR
          </Button>
        </Flex>
        <Button
          type="primary"
          className="buttonNewProject"
          size="large"
          href="/logistics/orders/new"
        >
          Crear Nuevo Viaje
          {<Plus weight="bold" size={14} />}
        </Button>
      </Flex>
      {!!loading ? (
        <Spin style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}/>
      ) : (
        <Tabs
          defaultActiveKey="0"
          items={[
            {
              label: "Solicitudes",
              key: "0",
              children: (
                <Collapse
                  className="collapsesTransferOrders"
                  defaultActiveKey={"0"}
                  items={
                    transferOrderList
                      ? Object.entries(transferOrderList).map(([key, transferOrdersState]) => ({
                          key: key,
                          label: (
                            <LabelCollapse
                              status={transferOrdersState.description}
                              quantity={transferOrdersState.trasnferorderrequests.length}
                              color={transferOrdersState.color}
                              quantityText="TO"
                              removeIcons
                            />
                          ),
                          children: (
                            <Table
                              loading={loading}
                              columns={columns as TableProps<any>["columns"]}
                              pagination={false}
                              dataSource={transferOrdersState.trasnferorderrequests}
                            />
                          )
                        }))
                      : []
                  }
                />
              )
            },
            {
              label: "En curso",
              key: "1",
              children: (
                <Table
                  loading={loading}
                  columns={columns as TableProps<any>["columns"]}
                  pagination={false}
                  dataSource={[]}
                />
              )
            },
            {
              label: "Finalizados",
              key: "2",
              children: (
                <Table
                  loading={loading}
                  columns={columns as TableProps<any>["columns"]}
                  pagination={false}
                  dataSource={[]}
                />
              )
            }
          ]}
        />
      )}
    </main>
  );
};
