import { useEffect, useState } from "react";
import { Button, Flex, message, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { DotsThree, Eye, Triangle } from "phosphor-react";
import "./carrierTable.scss";
import UiSearchInput from "@/components/ui/search-input";
import { ICarrier } from "@/types/logistics/schema";
import { getAllCarriers } from "@/services/logistics/carrier";
import useSWR from "swr";

const { Text } = Typography;

export const CarrierTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [datasource, setDatasource] = useState<any[]>([]);

  const { data: drivers, isLoading } = useSWR({}, getAllCarriers, {
    onError: (error: any) => {
      console.error(error);
      message.error(error.message);
    },
    refreshInterval: 30000,
  });

  const onChangePage = (pagePagination: number) => {
    setPage(pagePagination);
  };

  useEffect(() => {
    const data = drivers
      ?.filter((element: any) => {
        if (!search) return true;
        return (
          element.description.toLowerCase().includes(search.toLowerCase()) ||
          element.nit.toLowerCase().includes(search.toLowerCase())
        );
      })
      .map((element: any) => ({
        id: element.id,
        nit: element.nit,
        name: element.description,
        type: element.carrier_type,
        vehicle: element.vehicles,
        drivers: element.drivers,
        status: element.active,
      })) || [];
    setDatasource(data);
  }, [drivers, search]);

  const columns: TableProps<ICarrier>["columns"] = [
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Vehiculos",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Conductores",
      dataIndex: "drivers",
      key: "drivers",
    },
    {
      title: "Estado",
      key: "status",
      className: "tableTitle",
      width: "130px",
      dataIndex: "status",
      render: (_, { status }) => (
        <Flex>
          <Flex
            align="center"
            className={status ? "statusContainerActive" : "statusContainerInactive"}
          >
            <div className={status ? "statusActive" : "statusInactive"} />
            <Text>{status ? "Activo" : "Inactivo"}</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "",
      key: "buttonSee",
      width: "54px",
      dataIndex: "",
      render: (_, { id }) => (
        <Button
          href={`/logistics/providers/${id}`}
          className="icon-detail"
          icon={<Eye size={20} />}
        />
      ),
    },
  ];

  return (
    <div className="mainCarrierTable">
      <Flex justify="space-between" className="mainCarrierTable_header">
        <Flex gap={"10px"}>
          <UiSearchInput
            className="search"
            placeholder="Buscar"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <Button
            className="options"
            href="/logistics/providers/provider"
            icon={<DotsThree size={"1.5rem"} />}
          />
        </Flex>
      </Flex>
      <Table
        scroll={{ y: "61dvh", x: undefined }}
        columns={columns as TableProps<any>["columns"]}
        loading={isLoading}
        pagination={{
          pageSize: 25,
          onChange: onChangePage,
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return <Triangle size={".75rem"} weight="fill" className="prev" />;
            } else if (type === "next") {
              return <Triangle size={".75rem"} weight="fill" className="next" />;
            } else if (type === "page") {
              return <Flex className="pagination">{page}</Flex>;
            }
            return originalElement;
          },
        }}
        dataSource={datasource}
      />
    </div>
  );
};
