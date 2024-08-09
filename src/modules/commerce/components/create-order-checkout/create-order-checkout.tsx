import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Radio, RadioChangeEvent } from "antd";
import { CaretLeft } from "phosphor-react";
import { OrderViewContext } from "../../containers/create-order/create-order";
import PrincipalButton from "@/components/atoms/buttons/principalButton/PrincipalButton";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { Controller, useForm } from "react-hook-form";
import styles from "./create-order-checkout.module.scss";
import GeneralSelect from "@/components/ui/general-select";
import AlternativeBlackButton from "@/components/atoms/buttons/alternativeBlackButton/alternativeBlackButton";
import {
  createDraft,
  createOrder,
  createOrderFromDraft,
  getAdresses
} from "@/services/commerce/commerce";
import { useAppStore } from "@/lib/store/store";
import { ICommerceAdresses, IShippingInformation } from "@/types/commerce/ICommerce";
import { useMessageApi } from "@/context/MessageContext";
import { GenericResponse } from "@/types/global/IGlobal";

interface IShippingInfoForm {
  addresses: {
    value: string;
    label: string;
  };
  city: string;
  address: string;
  email: string;
  phone: string;
  comment: string;
}

const CreateOrderCheckout: FC = ({}) => {
  const { setCheckingOut, client, confirmOrderData, shippingInfo } = useContext(OrderViewContext);
  const { ID: projectId } = useAppStore((state) => state.selectedProject);
  const { draftInfo } = useAppStore((state) => state);
  const [radioValue, setRadioValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<ICommerceAdresses[]>([]);
  const router = useRouter();
  const { showMessage } = useMessageApi();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<IShippingInfoForm>({
    mode: "onChange",
    defaultValues: shippingInfo ? shippingInfoToForm(shippingInfo) : undefined
  });
  const watchSelectAddress = watch("addresses");

  useEffect(() => {
    const selectedAddress =
      watchSelectAddress &&
      addresses.find((address) => address.address === watchSelectAddress.label);
    if (!selectedAddress) return;
    setValue("city", selectedAddress?.city);
    setValue("address", selectedAddress?.address);
    setValue("email", selectedAddress?.email);
  }, [watchSelectAddress]);

  useEffect(() => {
    const fetchAdresses = async () => {
      const response = await getAdresses(client.id);
      setAddresses(response.data);
    };
    fetchAdresses();
  }, []);

  const handleGoBack = () => {
    setCheckingOut(false);
  };

  const handleChangeRadio = (e: RadioChangeEvent) => {
    setRadioValue(parseInt(e.target.value));
  };

  const onSubmitSaveDraft = async (data: IShippingInfoForm) => {
    setLoading(true);
    router.prefetch("/comercio");
    const createOrderModelData = {
      shipping_information: {
        address: data.address,
        city: data.city,
        dispatch_address: data.address,
        email: data.email,
        phone_number: data.phone,
        comments: data.comment
      },
      order_summary: confirmOrderData
    };

    const response = (await createDraft(
      projectId,
      client.id,
      createOrderModelData,
      showMessage
    )) as GenericResponse<{ id_order: number }>;

    if (response.status === 200) {
      router.push(`/comercio`);
    }
    setLoading(false);
  };

  const onSubmitFinishOrder = async (data: IShippingInfoForm) => {
    setLoading(true);
    const createOrderModelData = {
      shipping_information: {
        address: data.address,
        city: data.city,
        dispatch_address: data.address,
        email: data.email,
        phone_number: data.phone,
        comments: data.comment
      },
      order_summary: confirmOrderData
    };

    if (!!draftInfo?.id || (!!draftInfo.client_name && draftInfo.id !== undefined)) {
      const response = (await createOrderFromDraft(
        projectId,
        client.id,
        draftInfo.id,
        createOrderModelData,
        showMessage
      )) as GenericResponse<{ id_order: number }>;

      if (response.status === 200) {
        const url = `/comercio/pedidoConfirmado/${draftInfo.id}`;
        router.prefetch(url);
        router.push(url);
      }
      setLoading(false);
      return;
    }

    const response = (await createOrder(
      projectId,
      client.id,
      createOrderModelData,
      showMessage
    )) as GenericResponse<{ id_order: number }>;
    if (response.status === 200) {
      const url = `/comercio/pedidoConfirmado/${response.data.id_order}`;
      router.prefetch(url);
      router.push(url);
    }

    setLoading(false);
  };

  return (
    <div className={styles.checkoutContainer}>
      <Button
        type="text"
        size="large"
        className={styles.buttonGoBack}
        icon={<CaretLeft size={"1.3rem"} />}
        onClick={handleGoBack}
      >
        Volver
      </Button>
      <h3 className={styles.title}>Confirma datos de envío</h3>

      <div className={styles.checkoutContainer__content}>
        <div className={styles.shippingInfo}>
          <Controller
            name="addresses"
            control={control}
            rules={{ required: true, minLength: 1 }}
            render={({ field }) => (
              <GeneralSelect
                errors={errors.addresses}
                field={field}
                title="Direcciones"
                placeholder="Seleccione una dirección"
                options={addresses?.map((address) => address.address)}
                customStyleContainer={{ gridColumn: "1 / span 2" }}
              />
            )}
          />
          <InputForm
            readOnly={true}
            titleInput="Ciudad"
            control={control}
            nameInput="city"
            error={errors.city}
          />
          <InputForm
            readOnly={true}
            titleInput="Dirección de despacho"
            control={control}
            nameInput="address"
            error={errors.address}
          />
          <InputForm
            readOnly={true}
            titleInput="Email"
            control={control}
            nameInput="email"
            error={errors.email}
          />
          <InputForm
            titleInput="Teléfono de contacto"
            control={control}
            nameInput="phone"
            error={errors.phone}
          />
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <div className={styles.textArea}>
                <p className={styles.textArea__label}>Observaciones</p>
                <textarea
                  {...field}
                  placeholder="Ingresar un comentario"
                  style={errors.comment ? { borderColor: "red" } : {}}
                />
              </div>
            )}
          />
        </div>

        <div className={styles.discounts}>
          <h4 className={styles.discounts__title}>Seleccionar descuento a aplicar</h4>
          <Radio.Group
            className={styles.radioGroup}
            onChange={handleChangeRadio}
            value={radioValue}
          >
            {mockDiscounts.map((discount) => (
              <Radio
                className={styles.radioGroup__item}
                key={discount.id}
                value={discount.id}
                disabled={!discount.isReached}
              >
                <div className={styles.radioGroup__item__label}>
                  <p>{discount.discount}</p>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </div>

        <Flex gap={"1rem"}>
          <AlternativeBlackButton
            onClick={handleSubmit(onSubmitSaveDraft)}
            fullWidth
            loading={loading}
            disabled={!!draftInfo?.id || !!draftInfo.client_name}
          >
            Guardar borrador
          </AlternativeBlackButton>
          <PrincipalButton
            onClick={handleSubmit(onSubmitFinishOrder)}
            fullWidth
            disabled={!isValid}
            loading={loading}
          >
            Finalizar pedido
          </PrincipalButton>
        </Flex>
      </div>
    </div>
  );
};

export default CreateOrderCheckout;

const mockDiscounts = [
  {
    id: 1,
    discount: "5% DCTO En las marcas Cetaphil",
    isReached: true
  },
  {
    id: 2,
    discount: "10% DCTO En las marcas Cetaphil",
    isReached: false
  },
  {
    id: 3,
    discount: "15% DCTO En las marcas Cetaphil",
    isReached: false
  },
  {
    id: 4,
    discount: "30% DCTO En las marcas Cetaphil",
    isReached: true
  }
];

const shippingInfoToForm = (shippingInfo: IShippingInformation) => {
  return {
    addresses: {
      label: shippingInfo.address,
      value: shippingInfo.address
    },
    city: shippingInfo.city,
    address: shippingInfo.address,
    email: shippingInfo.email,
    phone: shippingInfo.phone_number,
    comment: shippingInfo.comments
  };
};
