import { Flex, Typography } from "antd";

// components
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";

import "../../../../../styles/_variables_logistics.css";

import "./createGeneralView.scss";
import { CarrierTable } from "@/components/molecules/tables/logistics/carrierTable/carrierTable";

const { Title } = Typography;

export const CreateGeneralView = () => {
  return (
    <>
      <main className="mainCreateOrder">
        <SideBar />
        <Flex vertical className="containerCreateOrder">
          <Flex className="infoHeaderOrder">
            <Flex gap={"2rem"}>
              <Title level={2} className="titleName">
                Proveedores
              </Title>
            </Flex>
            <Flex component={"navbar"} align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Flex className="orderContainer">
            <CarrierTable/>
          </Flex>
        </Flex>
      </main>
    </>
  );
};
