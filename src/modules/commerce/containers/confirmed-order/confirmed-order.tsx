import { FC, useEffect, useState } from "react";
import { Flex, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import ConfirmedOrderItem from "../../components/confirmed-order-item";
import { CheckCircle } from "phosphor-react";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import ConfirmedOrderShippingInfo from "../../components/confirmed-order-shipping-info";
import { extractSingleParam, formatMoney } from "@/utils/utils";

import styles from "./confirmed-order.module.scss";
import { getSingleOrder } from "@/services/commerce/commerce";
import { useAppStore } from "@/lib/store/store";
import { ISingleOrder } from "@/types/commerce/ICommerce";

export const ConfirmedOrderView: FC = () => {
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const params = useParams();
  const router = useRouter();
  const orderIdParam = extractSingleParam(params.orderId);
  const [order, setOrder] = useState<ISingleOrder>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderIdParam || !projectId) return;
    const fetchOrder = async () => {
      setLoading(true);
      const response = await getSingleOrder(projectId, parseInt(orderIdParam));
      setOrder(response?.data[0]);
      setLoading(false);
    };
    fetchOrder();
  }, [params, projectId]);

  const handleGoBack = () => {
    router.push("/comercio/");
  };
  return (
    <>
      {loading ? (
        <Spin size="large" style={{ margin: "auto" }} />
      ) : (
        <div className={styles.confirmedOrderView}>
          <div className={styles.confirmedOrderView__content}>
            <div className={styles.confirmedOrderView__content__header}>
              <p>Pedido #{order?.id}</p>
              <div className={styles.title}>
                <h2>Tu pedido ha sido solicitado</h2>
                <CheckCircle className={styles.check} size={90} weight="fill" />
              </div>
            </div>

            <div className={styles.summaryContainer}>
              <div className={styles.summaryContainer__top}>
                <Flex
                  className={styles.summaryContainer__top__header}
                  align="center"
                  justify="space-between"
                >
                  <h2 className={styles.mainTitle}>Resumen</h2>
                  <p className={styles.quantity}>SKUs: {order?.detail?.products?.length}</p>
                </Flex>

                <div className={styles.categories}>
                  {order?.detail?.products?.map((category) => (
                    <div className={styles.category} key={category.id_category}>
                      <Flex justify="space-between" align="center">
                        <p className={styles.category__header}>{category.category}</p>
                        <p className={styles.category__header}>Skus: {category.products.length}</p>
                      </Flex>
                      <div className={styles.products}>
                        {category.products.map((product) => (
                          <ConfirmedOrderItem key={product.product_sku} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.shippingData}>
                  <h2>Datos de envío</h2>
                  <ConfirmedOrderShippingInfo
                    title="Direcciones"
                    data={order?.shipping_info.address}
                    customStyles={{ gridColumn: "1 / span 2" }}
                  />
                  <ConfirmedOrderShippingInfo title="Ciudad" data={order?.shipping_info?.city} />
                  <ConfirmedOrderShippingInfo
                    title="Dirección de despacho"
                    data={order?.shipping_info?.dispatch_address}
                  />
                  <ConfirmedOrderShippingInfo title="Email" data={order?.shipping_info?.email} />
                  <ConfirmedOrderShippingInfo
                    title="Teléfono contacto"
                    data={order?.shipping_info?.phone_number}
                  />
                  <ConfirmedOrderShippingInfo
                    title="Observaciones"
                    data={order?.shipping_info?.comments}
                    customStyles={{ gridColumn: "1 / span 2" }}
                  />
                </div>

                {order?.detail.discount_id ? (
                  <div className={styles.discountsContainer}>
                    <h2 className={styles.discountsContainer__title}>Descuento aplicado</h2>
                    <div className={styles.discountsContainer__discounts}>
                      <p key={order?.detail?.discount_id}>{order?.detail?.discount_name}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.footer}>
              <Flex vertical gap={"0.25rem"}>
                <Flex justify="space-between">
                  <p>Subtotal</p>
                  <p>{formatMoney(order?.detail?.subtotal)}</p>
                </Flex>
                <Flex justify="space-between">
                  <p>IVA 19%</p>
                  <p>{formatMoney(order?.detail?.taxes)}</p>
                </Flex>
                <Flex justify="space-between">
                  <p>Descuentos</p>
                  <p>-{formatMoney(order?.detail?.discounts)}</p>
                </Flex>
                <Flex justify="space-between">
                  <strong>Total</strong>
                  <strong>{formatMoney(order?.total)}</strong>
                </Flex>
                <Flex className={styles.footer__earlyPaymentTotal} justify="space-between">
                  <p>Total con pronto pago</p>
                  <p>{formatMoney(order?.total_pronto_pago)}</p>
                </Flex>
              </Flex>
              <PrincipalButton onClick={handleGoBack}>Salir</PrincipalButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmedOrderView;
