import { CaretRight } from "@phosphor-icons/react";
import styles from "./buttonGenerateAction.module.scss";

type ButtonGenerateActionProps = {
  icon: React.ReactElement;
  title: string;
  onClick?: () => void;
};
export const ButtonGenerateAction: React.FC<ButtonGenerateActionProps> = ({
  icon,
  title,
  onClick
}) => {
  return (
    <button className={styles.actionButton} onClick={onClick}>
      {icon}
      <p className={styles.actionButton__text}>{title}</p>
      <CaretRight className={styles.actionButton__caretRight} size={"1.1rem"} />
    </button>
  );
};
