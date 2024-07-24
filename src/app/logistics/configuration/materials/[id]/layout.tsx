"use client";

import { Flex, Typography, Row, Col, Tabs, TabsProps } from "antd";
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";
import { usePathname, useRouter } from "next/navigation";
import "./provider.scss";
import "@/styles/_variables_logistics.css";

interface Props {
  children?: React.ReactNode;
  params: {
    id: string;
  };
}

const { Title } = Typography;

const ProviderInfoView = ({ children, params }: Props) => {
  const router = useRouter();
  const path = usePathname();

  const getDefaultValue = () => {
    if (path.includes("driver")) {
      return "driver";
    }
    if (path.includes("vehicle")) {
      return "vehicle";
    }
    return "";
  };

  const onChange = (key: string) => {
    router.push(`/logistics/providers/${params.id}/${key}`);
  };
  const items: TabsProps["items"] = [
    {
      key: "",
      label: "General",
      children: <></>
    },
    {
      key: "vehicle",
      label: "Vehiculo",
      children: <></>
    },
    {
      key: "driver",
      label: "Conductor",
      children: <></>
    }
  ];

  return (
    <main className="mainCreateOrder">
      <SideBar />
      <Flex vertical className="containerCreateOrder">
        <Flex className="infoHeaderOrder">
          <Flex gap={"2rem"}>
            <Title level={2} className="titleName">
              Proveedores
            </Title>
          </Flex>
          <Flex align="center" justify="space-between">
            <NavRightSection />
          </Flex>
        </Flex>
        {/* ------------Main Info Order-------------- */}
        <Flex className="orderContainer">
          <Row style={{ width: "100%" }}>
            <Col span={24}>
              <Tabs defaultActiveKey={getDefaultValue()} items={items} onChange={onChange}></Tabs>
            </Col>
            {children}
          </Row>
        </Flex>
      </Flex>
    </main>
  );
};

export default ProviderInfoView;
