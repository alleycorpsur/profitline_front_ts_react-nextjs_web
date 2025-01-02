import { ReactNode } from "react";
import { Dropdown, Button } from "antd";
import { DotsThree } from "phosphor-react";
import "./dotsDropdown.scss";
import { ItemType } from "antd/es/menu/interface";

interface DotsDropdownProps {
  items?: ItemType[];
  dotsSize?: string;
  customButtonStyle?: React.CSSProperties;
  customIcon?: ReactNode;
}

export const DotsDropdown = ({
  items,
  customButtonStyle,
  customIcon,
  dotsSize = "1.8rem"
}: DotsDropdownProps) => {
  const customDropdown = (menu: ReactNode) => <div className="dropdown">{menu}</div>;

  const buttonStyle = {
    height: "48px",
    width: "48px"
  };

  return (
    <Dropdown
      dropdownRender={customDropdown}
      menu={{ items }}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <Button
        style={customButtonStyle ? customButtonStyle : buttonStyle}
        className="dotsButton"
        size="large"
        icon={customIcon ? customIcon : <DotsThree size={dotsSize} />}
      />
    </Dropdown>
  );
};
