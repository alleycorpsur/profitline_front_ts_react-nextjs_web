"use client";
import React, { useState } from "react";
import { Tabs, Table, Space, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IThirdPartiesData } from "../interfaces/ThirdPartiesData";
import Container from "@/components/atoms/Container/Container";
import UiSearchInput from "@/components/ui/search-input";
import { FilterClients } from "@/components/atoms/Filters/FilterClients/FilterClients";
import { Tag } from "@/components/atoms/Tag/Tag";
import { Circle, DotsThreeVertical, Eye } from "@phosphor-icons/react";
import { GenerateActionButton } from "@/components/atoms/GenerateActionButton";
import IconButton from "@/components/atoms/IconButton/IconButton";
import { ModalGenerateAction } from "../components/ModalGenerateAction";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/api/api";

enum TabsEnum {
  Clients = "clients",
  Providers = "providers"
}
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ThirdPartiesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Clients);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const router = useRouter();

  const closeModal = () => {
    setModalOpen(false);
  };
  const openModal = () => {
    setModalOpen(true);
  };
  const { data, error, isLoading } = useSWR(
    `/subject/${activeTab}?page=${currentPage}&limit=${pageSize}`,
    fetcher
  );

  const handleTabChange = (key: TabsEnum) => {
    setActiveTab(key);
    setSearchText(""); // Reiniciar el texto de búsqueda al cambiar de pestaña
    setCurrentPage(1);
  };
  const columns: ColumnsType<IThirdPartiesData> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Tipo",
      dataIndex: "subtypeName",
      key: "subtypeName"
    },
    {
      title: "Fecha creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt)
    },
    // {
    //   title: "Vencimiento",
    //   dataIndex: "expirationDate",
    //   key: "expirationDate"
    // },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <Flex>
            <Tag
              icon={<Circle color={status.color} weight="fill" size={6} />}
              style={{
                border: `${status.color} 1px solid`,
                fontSize: 14,
                fontWeight: 400
              }}
              content={status.name}
            />
          </Flex>
        );
      }
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space>
          <IconButton
            style={{ backgroundColor: "#F7F7F7" }}
            icon={<DotsThreeVertical size={20} />}
          />
          <IconButton
            style={{ backgroundColor: "#F7F7F7" }}
            icon={<Eye size={20} />}
            onClick={() => router.push(`/proveedores/${record.id}`)}
          />
        </Space>
      )
    }
  ];

  return (
    <Container style={{ gap: "1.5rem" }}>
      <Tabs
        defaultActiveKey="clients"
        onChange={(key: string) => handleTabChange(key as TabsEnum)}
        size="large"
        style={{
          fontSize: 16,
          fontWeight: 700
        }}
      >
        <Tabs.TabPane tab="Clientes" key={TabsEnum.Clients} />
        <Tabs.TabPane tab="Proveedores" key={TabsEnum.Providers} />
      </Tabs>
      <Flex gap={8}>
        <UiSearchInput
          placeholder="Buscar clientes"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FilterClients setFilterClients={() => {}} />
        <GenerateActionButton onClick={openModal} />
      </Flex>
      <Table columns={columns} dataSource={data?.data} loading={isLoading} />
      <ModalGenerateAction isOpen={isModalOpen} onClose={closeModal} />
    </Container>
  );
};

export default ThirdPartiesView;
