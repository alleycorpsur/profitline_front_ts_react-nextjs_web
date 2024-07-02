import styles from "./FeatByClient.module.scss";
import { Flex, Radio, Typography } from "antd";
import { InputForm } from "@/components/atoms/inputs/InputForm/InputForm";
import { UseFormReturn, useForm } from "react-hook-form";
import ProductList from "../../productList/ProductList";
import GroupClients from "../../groupClients/GroupClients";
import useDiscountFeats from "../hooks/useDiscountFeats";
import { DiscountSchema } from "../../../../resolvers/generalResolver";
import { useClientsGroups } from "@/hooks/useClientsGroups";

const { Title, Text } = Typography;

const clientDummy = [
  {
    id: 1,
    name: "Grupo 1"
  },
  {
    id: 2,
    name: "Grupo 2"
  },
  {
    id: 3,
    name: "Grupo 3"
  },
  {
    id: 4,
    name: "Grupo 4"
  }
];

type FeatByOrderProps = {
  discountType: number;
  form: UseFormReturn<DiscountSchema, any, undefined>;
  statusForm: "create" | "edit" | "review";
};

export default function FeatByCient({ form, statusForm }: FeatByOrderProps) {
  const {
    setValue,
    watch,
    control,
    formState: { errors }
  } = form;
  const { lines, onChange, isLoading, projectId } = useDiscountFeats({ setValue });
  const { data, error, loading } = useClientsGroups({
    idProject: projectId.toString(),
    noLimit: true
  });

  return (
    <Flex className={styles.principalContainer} vertical gap={20}>
      <Title level={5}>Descuento aplicable</Title>
      <Radio.Group
        onChange={onChange}
        value={watch("computation_type")}
        className={styles.radioGroup}
        disabled={statusForm === "review"}
      >
        <Radio value={1}>Descuento aplicable en porcentaje</Radio>
        <Radio value={2}>Descuento aplicable en valor fijo</Radio>
      </Radio.Group>
      <Text type="danger" hidden={!errors?.computation_type}>
        {errors?.computation_type?.message}
      </Text>
      <InputForm
        control={control}
        nameInput="discount"
        error={errors?.discount}
        placeholder="0%"
        className={styles.input}
      />
      <Title level={5}>Selecciona un grupo de clientes</Title>
      <GroupClients
        clients={data?.data}
        error={error}
        loading={loading}
        form={form}
        statusForm={statusForm}
      ></GroupClients>
      <ProductList
        lines={lines}
        loading={isLoading}
        form={form}
        statusForm={statusForm}
      ></ProductList>
    </Flex>
  );
}
