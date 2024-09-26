import { FC, useContext, useEffect } from "react";
import { Button, Flex } from "antd";
import { CaretLeft } from "phosphor-react";

import { useAppStore } from "@/lib/store/store";
import UiSearchInput from "@/components/ui/search-input";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";
import UiTab from "@/components/ui/ui-tab";
import { OrderViewContext } from "../../containers/create-order/create-order";
import CreateOrderProduct from "../create-order-product";
import { getProductsByClient } from "@/services/commerce/commerce";

import { ISelectType } from "@/types/clients/IClients";

import styles from "./create-order-market.module.scss";
export interface selectClientForm {
  client: ISelectType;
}

const CreateOrderMarket: FC = ({}) => {
  const { ID } = useAppStore((state) => state.selectedProject);
  const { client, setClient, categories, setCategories } = useContext(OrderViewContext);

  useEffect(() => {
    const fetchProducts = async () => {
      if (client.id) {
        const response = await getProductsByClient(ID, client.id);
        if (response.data) {
          const categories = response.data.map((category) => ({
            category: category.category,
            products: category.products.map((product) => ({
              id: product.id,
              name: product.description,
              price: product.price,
              discount: undefined,
              discount_percentage: undefined,
              quantity: 0,
              image: product.image,
              category_id: product.id_category,
              SKU: product.SKU,
              stock: true
            }))
          }));

          setCategories(categories);
        }
      }
    };
    fetchProducts();
  }, [client]);

  const categoryTabs = categories.map((category) => ({
    key: category.category,
    label: category.category,
    children: (
      <div className={styles.productsGrid}>
        {category.products.map((product) => (
          <CreateOrderProduct key={product.id} product={product} categoryName={category.category} />
        ))}
      </div>
    )
  }));

  const handleGoBack = () => {
    setClient(undefined as any);
  };

  return (
    <div className={styles.marketContainer}>
      <Button
        type="text"
        size="large"
        className={styles.buttonGoBack}
        icon={<CaretLeft size={"1.3rem"} />}
        onClick={handleGoBack}
      >
        {client.name}
      </Button>
      <Flex gap={"0.5rem"}>
        <UiSearchInput
          placeholder="Buscar"
          onChange={(event) => {
            setTimeout(() => {
              console.info(event.target.value);
            }, 1000);
          }}
        />
        <FilterDiscounts />
      </Flex>
      <UiTab tabs={categoryTabs} />
    </div>
  );
};

export default CreateOrderMarket;
