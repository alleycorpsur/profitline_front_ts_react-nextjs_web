import { DotsDropdown } from "@/components/atoms/DotsDropdown/DotsDropdown";
import { Button, MenuProps } from "antd";

type Props = {
  handleDeleteDiscount: () => void;
  disableDelete: boolean;
};

export default function DropdownDiscount({ handleDeleteDiscount, disableDelete }: Props) {
  const items: MenuProps["items"] = [
    {
      key: "discount-option-1",
      label: (
        <Button className="buttonOutlined" disabled={disableDelete} onClick={handleDeleteDiscount}>
          Eliminar
        </Button>
      )
    }
  ];
  return <DotsDropdown items={items} />;
}
