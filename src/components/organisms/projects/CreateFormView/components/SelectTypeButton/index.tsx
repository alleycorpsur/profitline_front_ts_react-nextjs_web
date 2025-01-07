import { Button } from "antd";
import { ReactNode } from "react";
import styles from "./index.module.scss";
import { ButtonType } from "antd/lib/button";

interface Props {
  icon: ReactNode;
  selected: boolean;
  type?: ButtonType;
  onClick: () => void;
  title: string;
}
export const SelectTypeButton = ({ icon, selected, type = "default", onClick, title }: Props) => {
  return (
    <Button
      icon={icon}
      type={type}
      onClick={onClick}
      className={`${styles.selectTypeButton} ${selected && styles.selected}`}
    >
      {title}
    </Button>
  );
};
