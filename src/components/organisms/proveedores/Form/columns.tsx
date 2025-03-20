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
    dataIndex: "uploadDate",
    key: "uploadDate",
    render: (_: string, record: any) => {
      if (record.uploadedAt) {
        return record.uploadedAt;
      }
      return "-";
    }
  },
  {
    title: "Vencimiento",
    dataIndex: "validity",
    key: "validity",
    render: (_: string, record: any) => {
      if (record.validity) {
        return record.validity;
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
