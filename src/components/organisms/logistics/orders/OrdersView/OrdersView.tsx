"use client";
import { Flex, Typography } from "antd";

import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";
import { OrdersTable } from "@/components/molecules/tables/logistics/OrdersTable/OrdersTable";

import "./orders.scss";

const { Title } = Typography;

export const OrdersView = () => {
  return (
    <main className="mainProject">
      <SideBar />
      <Flex vertical className="contentProject">
        <Flex justify="space-between" align="center">
          <Flex gap={"1rem"} align="center">
            <Title level={2} className="titleName">
              Ordenes
            </Title>
          </Flex>
          <NavRightSection />
        </Flex>
        <OrdersTable />
      </Flex>
    </main>
  );
};
