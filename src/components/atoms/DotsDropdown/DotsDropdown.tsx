import { ReactNode } from "react";
import { Dropdown, Button } from "antd";
import { DotsThree } from "phosphor-react";
import "./dotsDropdown.scss";
import { ItemType } from "antd/es/menu/interface";

interface DotsDropdownProps {
  items?: ItemType[];
  dotsSize?: string;
}

export const DotsDropdown = ({ items, dotsSize = "1.8rem" }: DotsDropdownProps) => {
  const customDropdown = (menu: ReactNode) => <div className="dropdown">{menu}</div>;

  return (
    <Dropdown
      dropdownRender={customDropdown}
      menu={{ items }}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <Button className="dotsButton" size="large" icon={<DotsThree size={dotsSize} />} />
    </Dropdown>
  );
};
