import { FC } from "react";
import Image from "next/image";

import { formatMoney } from "@/utils/utils";
import SecondaryButton from "@/components/atoms/buttons/secondaryButton/SecondaryButton";
import { Minus, Plus } from "phosphor-react";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";

import styles from "./create-order-product.module.scss";
import { useHandleProductsItems } from "../../hooks/create-order/handle-products-items.hook";
import { Flex } from "antd";
import { ISelectedProduct } from "@/types/commerce/ICommerce";

export interface CreateOrderProductProps {
  product: ISelectedProduct;
  categoryName: string;
}

const CreateOrderProduct: FC<CreateOrderProductProps> = ({ product, categoryName }) => {
  const {
    alreadySelectedProduct,
    handleAddToCart,
    handleDecrementQuantity,
    handleIncrementQuantity,
    handleChangeQuantity
  } = useHandleProductsItems(product, categoryName);

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.imageContainer__img}
          src={product.image}
          alt="product image"
          width={100}
          height={100}
        />
      </div>

      <hr className={styles.separator} />
      <h4 className={styles.name}>
        {product.name}
        {!product.stock && <span className={styles.noStock}> No hay stock</span>}
      </h4>
      <div className={styles.price}>
        {product.discount ? (
          <>
            <h5 className={styles.oldPrice}>{formatMoney(product.price)}</h5>
            <Flex gap={4}>
              <h5 className={styles.price__amount}>{formatMoney(product.discount)}</h5>
              <p className={styles.discountPercentage}>-%{product.discount_percentage}</p>
            </Flex>
          </>
        ) : (
          <h5 className={styles.price__amount}>{formatMoney(product.price)}</h5>
        )}
      </div>
      {alreadySelectedProduct ? (
        <div className={styles.quantityFooter}>
          <PrincipalButton
            customStyles={{ padding: "0.5rem" }}
            onClick={() => handleDecrementQuantity(product.id)}
          >
            <Minus size={20} />
          </PrincipalButton>
          <input
            key={alreadySelectedProduct ? alreadySelectedProduct.quantity : "default"}
            type="number"
            className={styles.quantityInput}
            defaultValue={alreadySelectedProduct ? alreadySelectedProduct.quantity : undefined}
            onBlur={(e) => handleChangeQuantity(e, product.id, product.category_id)}
          />
          <PrincipalButton
            customStyles={{ padding: "0.5rem" }}
            onClick={() => handleIncrementQuantity(product.id)}
          >
            <Plus size={20} />
          </PrincipalButton>
        </div>
      ) : (
        <div className={styles.footer}>
          <SecondaryButton
            customStyles={{ width: "100%" }}
            bordered
            onClick={() => handleAddToCart(product)}
          >
            Agregar <Plus size={20} />
          </SecondaryButton>
        </div>
      )}
    </div>
  );
};

export default CreateOrderProduct;
