"use client";
import Wrapper from "@/components/organisms/wrapper/Wrapper";
import { Flex, Typography } from "antd";
import "./DiscountWrapper.scss";
import redirectModal from "@/components/molecules/modals/redirectModal/RedirectModal";
import { useAppStore } from "@/lib/store/store";
import { useEffect } from "react";

const { Title } = Typography;

export default function DiscountWrapper({ children }: { children: React.ReactNode }) {
  const { ID } = useAppStore((projects) => projects.selectProject);
  useEffect(() => {
    if (!ID) redirectModal();
  }, []);
  return (
    <Wrapper>
      <Flex vertical gap={"1.5rem"} className="WrapperChild">
        <Flex gap={"2rem"} justify="space-between" wrap="wrap">
          <Title level={2} className="titleName">
            Configuración de descuentos
          </Title>
        </Flex>
        {children}
      </Flex>
    </Wrapper>
  );
}
