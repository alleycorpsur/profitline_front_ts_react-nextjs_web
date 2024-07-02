import { useEffect, useState } from "react";
import { Spin, TableProps, Button, Col, Flex, Row, Table, Typography } from "antd";
import {
  CalendarBlank,
  CalendarX,
  DotsThree,
  Eye,
  Money,
  Calendar,
  Receipt,
  XCircle,
  MagnifyingGlassMinus
} from "phosphor-react";

import { useProjects } from "@/hooks/useProjects";

import "./ClientsViewTable.scss";
import CardsClients from "../../../molecules/modals/CardsClients/CardsClients";
import { usePortfolios } from "@/hooks/usePortfolios";
import { IClientsPortfolio } from "@/types/clients/IViewClientsTable";
import { formatMoney } from "@/utils/utils";
import { useAppStore } from "@/lib/store/store";
import redirectModal from "@/components/molecules/modals/redirectModal/RedirectModal";

const { Text } = Typography;

export const ClientsViewTable = () => {
  const { ID } = useAppStore((projects) => projects.selectProject);
  useEffect(() => {
    if (!ID) redirectModal();
  }, []);

  const { data: clients } = usePortfolios();

  const [selectFilters] = useState({
    country: [] as string[],
    currency: [] as string[]
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, data } = useProjects({
    page: selectFilters.country.length !== 0 || selectFilters.currency.length !== 0 ? 1 : page,
    currencyId: selectFilters.currency,
    countryId: selectFilters.country,
    searchQuery: ""
  });

  const onChangePage = (pagePagination: number) => {
    setPage(pagePagination);
  };

  const columns: TableProps<IClientsPortfolio>["columns"] = [
    {
      title: "Nombre",
      dataIndex: "client_name",
      key: "client_name",
      render: (_, row: IClientsPortfolio) => (
        <a href={`/clientes/detail/${row.client_id}/project/${row.project_id}`}>
          <Text className="text">{row.client_name}</Text>
        </a>
      )
    },
    {
      align: "right",
      title: "Cartera",
      dataIndex: "total_portfolio",
      key: "total_portfolio",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      align: "right",
      title: "Vencida",
      dataIndex: "past_due_ammount",
      key: "past_due_ammount",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      align: "right",
      title: "Presupuesto",
      key: "budget_ammount",
      dataIndex: "budget_ammount",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      align: "right",
      title: "R. Aplicado",
      key: "applied_payments_ammount",
      dataIndex: "applied_payments_ammount",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      align: "center",
      width: 103,
      title: "Ejecutado",
      key: "executed_percentage",
      dataIndex: "executed_percentage",
      render: (text) => <Text>{text} %</Text>
    },
    {
      align: "right",
      title: "PNA",
      key: "unapplied_payments_ammount",
      dataIndex: "unapplied_payments_ammount",
      render: (text) => <Text>{formatMoney(text)}</Text>
    },
    {
      align: "right",
      title: "Saldos",
      key: "total_balances",
      dataIndex: "total_balances",
      render: (text) => <Text>{text}</Text>
    },
    {
      title: "Holding",
      key: "holding_name",
      dataIndex: "holding_name",
      render: (text) => <Text className="text">{text}</Text>
    },
    {
      title: "",
      key: "buttonSee",
      width: 64,
      dataIndex: "",
      render: (_, row: IClientsPortfolio) => (
        <Button
          href={`/clientes/detail/${row.client_id}/project/${row.project_id}`}
          onClick={() => setIsLoading(true)}
          className="buttonSeeProject"
          icon={isLoading ? <Spin /> : <Eye size={"1.3rem"} />}
        />
      )
    }
  ];

  return (
    <main className="mainClientsTable">
      <Flex justify="space-between" className="mainClientsTable_header">
        <Flex gap={"10px"}>
          <Button size="large" icon={<DotsThree size={"1.5rem"} />} />
        </Flex>
      </Flex>
      <Row gutter={8}>
        <Col span={21} className="cards">
          <Row gutter={8}>
            <Col span={4}>
              <CardsClients
                title={"Total cartera"}
                total={clients?.grandTotal.total_wallet || 0}
                icon={<Money />}
              />
            </Col>
            <Col span={4}>
              <CardsClients
                title={"C. vencida"}
                total={clients?.grandTotal.total_past_due || 0}
                icon={<CalendarX />}
              />
            </Col>
            <Col span={4}>
              <CardsClients
                title={"Presupuesto"}
                total={clients?.grandTotal.total_budget || 0}
                icon={<CalendarBlank />}
              />
            </Col>
            <Col span={4}>
              <CardsClients
                title={"R. aplicado"}
                total={clients?.grandTotal.applied_payments_ammount || 0}
                icon={<Receipt />}
              />
            </Col>
            <Col span={4}>
              <CardsClients
                title={"Pagos no ap."}
                total={clients?.grandTotal.unapplied_payments_ammount || 0}
                icon={<XCircle />}
              />
            </Col>
            <Col span={4}>
              <CardsClients
                title={"Pagos no id."}
                total={clients?.grandTotal.unidentified_payment_ammount || 0}
                icon={<MagnifyingGlassMinus />}
              />
            </Col>
          </Row>
        </Col>
        <Col span={3}>
          <CardsClients title={"DSO"} total={clients?.grandTotal.dso || 0} icon={<Calendar />} />
        </Col>
      </Row>
      <Table
        loading={loading}
        scroll={{ y: "61dvh", x: undefined }}
        columns={columns as TableProps<any>["columns"]}
        pagination={{
          pageSize: 25,
          total: data.pagination.totalRows,
          onChange: onChangePage
        }}
        dataSource={clients?.clientsPortfolio.map((data) => ({ ...data, key: data.client_id }))}
      />
    </main>
  );
};
