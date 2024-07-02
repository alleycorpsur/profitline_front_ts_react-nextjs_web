import { Cascader } from "antd";
import "../filterCascader.scss";

type Props = {
  handleChangeActive: (
    // eslint-disable-next-line no-unused-vars
    filter: {
      label: string;
      value: number;
    }[]
  ) => void;
};

export default function FilterDiscounts({ handleChangeActive }: Props) {
  return (
    <Cascader
      style={{ width: "130px", height: "100%" }}
      size="large"
      multiple={false}
      removeIcon
      maxTagCount="responsive"
      placeholder="Filtrar"
      placement="bottomRight"
      options={[
        { label: "Activo", value: 1 },
        { label: "Inactivo", value: 0 }
      ]}
      onChange={(_, filter) => handleChangeActive(filter)}
    />
  );
}
