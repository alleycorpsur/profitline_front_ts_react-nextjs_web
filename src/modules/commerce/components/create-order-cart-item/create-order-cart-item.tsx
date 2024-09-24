import { FC } from "react";
import Image from "next/image";
import { formatMoney } from "@/utils/utils";

import { Minus, Plus, Trash } from "phosphor-react";

import styles from "./create-order-cart-item.module.scss";
import { Button, Flex } from "antd";
import { useHandleProductsItems } from "../../hooks/create-order/handle-products-items.hook";
import { ISelectedProduct } from "@/types/commerce/ICommerce";
export interface CreateOrderItemProps {
  product: ISelectedProduct;
  categoryName: string;
}

const CreateOrderItem: FC<CreateOrderItemProps> = ({ product, categoryName }) => {
  const {
    alreadySelectedProduct,
    handleDecrementQuantity,
    handleIncrementQuantity,
    handleChangeQuantity
  } = useHandleProductsItems(product, categoryName);

  return (
    <div className={styles.cartItemCard}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.imageContainer__img}
          src={product.image}
          alt="product image"
          width={100}
          height={100}
        />
      </div>
      <h4 className={styles.name}>
        {product.name}
        {!product.stock && <span className={styles.noStock}> No hay stock</span>}
      </h4>

      <div className={styles.price}>
        {product.discount ? (
          <>
            <h5 className={styles.oldPrice}>{formatMoney(product.price)}</h5>
            <Flex gap={4} align="baseline">
              <h5 className={styles.price__amount}>{formatMoney(product.discount)}</h5>
              <p className={styles.discountPercentage}>-%{product.discount_percentage}</p>
            </Flex>
          </>
        ) : (
          <h5 className={styles.price}>{formatMoney(product.price)}</h5>
        )}
      </div>

      <div className={styles.quantityFooter}>
        <Button
          className={styles.buttonChangeQuantity}
          onClick={() => handleDecrementQuantity(product.id)}
        >
          {alreadySelectedProduct?.quantity === 1 ? (
            <Trash size={14} weight="bold" />
          ) : (
            <Minus size={14} weight="bold" />
          )}
        </Button>
        <input
          key={alreadySelectedProduct ? alreadySelectedProduct.quantity : "default"}
          type="number"
          className={styles.quantityInput}
          defaultValue={alreadySelectedProduct ? alreadySelectedProduct.quantity : undefined}
          onBlur={(e) => handleChangeQuantity(e, product.id, product.category_id)}
        />
        <Button
          className={styles.buttonChangeQuantity}
          onClick={() => handleIncrementQuantity(product.id)}
        >
          <Plus size={14} weight="bold" />
        </Button>
      </div>
    </div>
  );
};

export default CreateOrderItem;
