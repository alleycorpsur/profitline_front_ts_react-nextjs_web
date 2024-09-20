import { NotificationInstance, NotificationPlacement } from "antd/es/notification/interface";
import styles from "./notification.module.scss";

type NotificationType = "success" | "info" | "warning" | "error";

export interface IOpenNotificationProps {
  api: NotificationInstance;
  type?: NotificationType;
  title: string;
  message: string;
  placement?: NotificationPlacement;
}

export const openNotification = ({
  api,
  type = "info",
  title,
  message,
  placement = "topRight"
}: IOpenNotificationProps) => {
  api[type]({
    message: <h5 className={styles.notificationLoginTitle}>{title}</h5>,
    description: <p className={styles.notificationLoginText}>{message}</p>,
    placement
  });
};
