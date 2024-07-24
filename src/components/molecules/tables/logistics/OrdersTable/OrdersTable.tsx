import { useEffect, useState } from "react";
import { Avatar, Button, Checkbox, Flex, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { Clipboard, DotsThree, Eye, Plus, Triangle } from "phosphor-react";

import { FilterProjects } from "@/components/atoms/Filters/FilterProjects/FilterProjects";
import { useProjects } from "@/hooks/useProjects";
import { useAppStore } from "@/lib/store/store";


import "./orderstable.scss";
import UiSearchInput from "@/components/ui/search-input";
import { countries } from "@/utils/countries";
import { ITransferOrderList } from "@/types/logistics/schema";
import { getAllTransferOrderList } from "@/services/logistics/transfer-orders";

const { Text } = Typography;

export const OrdersTable = () => {
  const [selectFilters, setSelectFilters] = useState({
    country: [] as string[],
    currency: [] as string[]
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { loading, data } = useProjects({
    page: selectFilters.country.length !== 0 || selectFilters.currency.length !== 0 ? 1 : page,
    currencyId: selectFilters.currency,
    countryId: selectFilters.country,
    searchQuery:''
  });

  const onChangePage = (pagePagination: number) => {
    setPage(pagePagination);
  };

  const [transferOrderList, setTransferOrderList] = useState<ITransferOrderList[]>([]);

  useEffect(() => {
    loadTransferOrders();
  });

  const loadTransferOrders = async () => {
    if(transferOrderList.length >0 ) return;
    const result = await getAllTransferOrderList();
    if(result.data.data.length > 0){
      //console.log(result.data.data);    

      setTransferOrderList(result.data.data);

    }
  };

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
          <FilterProjects setSelecetedProjects={setSelectFilters} />
          <Button className="options" icon={<DotsThree size={"1.5rem"} />} />
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
      <Table
        loading={loading}
        scroll={{ y: "61dvh", x: undefined }}
        columns={columns as TableProps<any>["columns"]}
        pagination={{
          pageSize: 25,
          total: data.pagination.totalRows,
          onChange: onChangePage,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return <Triangle size={".75rem"} weight="fill" className="prev" />;
            } else if (type === "next") {
              return <Triangle size={".75rem"} weight="fill" className="next" />;
            } else if (type === "page") {
              return <Flex className="pagination">{page}</Flex>;
            }
            return originalElement;
          }
        }}
        dataSource={transferOrderList}
      />
    </main>
  );
};

const columns: TableProps<ITransferOrderList>["columns"] = [
  {
    title: "",
    key: "buttonSee",
    width: "54px",
    dataIndex: "",
    render: (_, { id }) => (
      <Checkbox value={{id}} ></Checkbox>    
    )
  },
  {
    title: "TO",
    dataIndex: "id",
    className: "tableTitle",
    key: "id",
    width: "54px",
  },
  {
    title: "Origen y destino",
    dataIndex: "origin",
    className: "tableTitle",
    key: "origin",
    render: (_,{start_location,end_location}) => <>
      <small><b>Origen&nbsp;&nbsp;&nbsp;</b><Text>{start_location}</Text></small><br></br>
      <small><b>Destino&nbsp;&nbsp;</b><Text>{end_location}</Text></small>
    </>
  },
  {
    title: "Fechas",
    dataIndex: "dates",
    className: "tableTitle",
    key: "dates",
    width: "250px",
    render: (_,{start_date,end_date}) => <>
      <small><Text>{start_date}</Text></small><br></br>
      <small><Text>{end_date}</Text></small>
    </>
  },
  {
    title: "Tipo de viaje",
    className: "tableTitle",
    dataIndex: "service_type",
    key: "service_type",
    width: "120px",
  },
  {
    title: "Tiempo transcurrido",
    key: "time",
    className: "tableTitle",
    dataIndex: "time",
    width: "200px",
    render: (text) => <Text>0 min</Text>
  },
  {
    title: "Valor",
    key: "amount",
    className: "tableTitle",
    dataIndex: "amount",
    width: "200px",
    render: (text) => <Text>$ 0.00</Text>
  },
  {
    title: "",
    key: "buttonSee",
    width: "54px",
    dataIndex: "",
    render: (_, { id }) => (
      <Button href={`/logistics/orders/details/${id}`} className="icon-detail" icon={<Eye size={20} />} />
    )
  }
];
