import IconButton from "@/components/atoms/IconButton/IconButton";
import { Tag } from "@/components/atoms/Tag/Tag";
import { Flex } from "antd";
import { Eye } from "phosphor-react";
import { getTagColor } from "../utils/utils";

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
    render: () => "-"
  },
  {
    title: "Vencimiento",
    dataIndex: "expiryDate",
    key: "expiryDate",
    render: () => "-"
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const color = getTagColor(status);
      return (
        <Flex>
          <Tag color={color} content={status} style={{ fontSize: 14, fontWeight: 400 }} />
        </Flex>
      );
    }
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
