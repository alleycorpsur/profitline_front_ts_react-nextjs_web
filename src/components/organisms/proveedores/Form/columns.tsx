import IconButton from "@/components/atoms/IconButton/IconButton";
import { Tag } from "@/components/atoms/Tag/Tag";
import { Flex } from "antd";
import { Eye } from "phosphor-react";

export const columns = ({ handleOpenDrawer, setRequirementIndex }: any) => [
  { title: "Nombre", dataIndex: "name", key: "name" },
  {
    title: "Descripción",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Fecha cargue",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_: string, record: any) => {
      if (record.createdAt) {
        return record.createdAt;
      }
      return "-";
    }
  },
  {
    title: "Vencimiento",
    dataIndex: "expiryDate",
    key: "expiryDate",
    render: (_: string, record: any) => {
      if (record.expiryDate) {
        return record.expiryDate;
      }
      return "-";
    }
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render: (_: string, record: any) => (
      <Flex>
        <Tag
          color={record.statusColor}
          content={record.statusName}
          style={{ fontSize: 14, fontWeight: 400 }}
        />
      </Flex>
    )
  },
  {
    title: "",
    dataIndex: "seeMore",
    key: "seeMore",
    render: (_: any, record: any, index: number) => (
      <IconButton
        onClick={() => {
          setRequirementIndex(index);
          handleOpenDrawer();
        }}
        icon={<Eye size={"1.3rem"} />}
        style={{ backgroundColor: "#F4F4F4" }}
      />
    )
  }
];
