"use client";
import React, { useState, useEffect } from "react";
import { Tabs, Table, Space, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ThirdPartiesData } from "../interfaces/ThirdPartiesData";
import { clientsData, providersData } from "./mocked";
import Container from "@/components/atoms/Container/Container";
import UiSearchInput from "@/components/ui/search-input";
import { FilterClients } from "@/components/atoms/Filters/FilterClients/FilterClients";
import { Tag } from "@/components/atoms/Tag/Tag";
import { Circle, DotsThreeVertical, Eye } from "@phosphor-icons/react";
import { GenerateActionButton } from "@/components/atoms/GenerateActionButton";
import IconButton from "@/components/atoms/IconButton/IconButton";
import { ModalGenerateAction } from "../components/ModalGenerateAction";
import { useRouter } from "next/navigation";

enum TabsEnum {
  Clients = "clients",
  Providers = "providers"
}
const ThirdPartiesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Clients);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ThirdPartiesData[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const closeModal = () => {
    setModalOpen(false);
  };
  const openModal = () => {
    setModalOpen(true);
  };
  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      //const response = await axios.get(`/api/${tab}`);
      if (tab === "clients") {
        setData(clientsData);
      } else {
        setData(providersData);
      }
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleTabChange = (key: TabsEnum) => {
    setActiveTab(key);
    setSearchText(""); // Reiniciar el texto de búsqueda al cambiar de pestaña
  };

  const columns: ColumnsType<ThirdPartiesData> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Fecha creación",
      dataIndex: "creationDate",
      key: "creationDate"
    },
    {
      title: "Vencimiento",
      dataIndex: "expirationDate",
      key: "expirationDate"
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Actualizado":
            color = "#17CC07";
            break;
          case "Pendiente":
            color = "#FF6F00";
            break;
          case "Nuevo":
            color = "#16A9FB";
            break;
          case "Inactivo":
            color = "#DDDDDD";
            break;
          default:
            color = "default";
        }
        return (
          <Flex>
            <Tag
              icon={<Circle color={color} weight="fill" size={6} />}
              style={{
                border: `${color} 1px solid`,
                fontSize: 14,
                fontWeight: 400
              }}
              content={status}
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
      <Table
        columns={columns}
        dataSource={data.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        loading={loading}
        rowSelection={{}}
      />
      <ModalGenerateAction isOpen={isModalOpen} onClose={closeModal} />
    </Container>
  );
};

export default ThirdPartiesView;
