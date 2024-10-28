"use client";

import Discounts from "@/components/organisms/discounts/Discounts";
import { Flex, message, Tabs, TabsProps } from "antd";
import styles from "../../components/organisms/discounts/Discounts.module.scss";
import Link from "next/link";
import ButtonHeader from "@/components/atoms/buttons/buttonHeader/ButtonHeader";
import DiscountPackages from "@/components/organisms/discounts/discount-package/DiscountPackageList";
//import useDiscount from "@/components/organisms/discounts/hooks/useDiscount";

function Page() {
  const [messageApi, messageContex] = message.useMessage();
  // const {
  //   data,

  //   handleChangeSearch,

  //   handleChangeActive,

  //   modalDelete
  // } = useDiscount({ messageApi });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Paquete de descuentos",
      children: <DiscountPackages />
    },
    {
      key: "2",
      label: "Reglas de descuentos",
      children: <Discounts />
    }
  ];
  return (
    <>
      {messageContex}

      <Flex className={styles.FlexContainer} vertical gap={20}>
        <Flex gap={20} justify="space-between" wrap="wrap">
          {/* <Flex className={styles.header} gap={"10px"}>
            <UiSearchInput placeholder="Buscar" onChange={handleChangeSearch} />
            <FilterDiscounts handleChangeActive={handleChangeActive} />
            <DropdownDiscount
              disableDelete={!data.some((item) => item.checked)}
              handleDeleteDiscount={modalDelete.handleOpen}
            />
          </Flex> */}
          <Flex vertical style={{ width: "fit-content" }}>
            <Link href="/descuentos/create/discount-rule" passHref legacyBehavior>
              <ButtonHeader>Crear descuento</ButtonHeader>
            </Link>
          </Flex>
        </Flex>
        <Flex className="tabsContainer">
          <Tabs
            style={{ width: "100%", height: "100%" }}
            defaultActiveKey="1"
            items={items}
            size="large"
          />
        </Flex>
      </Flex>
    </>
  );
}

export default Page;
