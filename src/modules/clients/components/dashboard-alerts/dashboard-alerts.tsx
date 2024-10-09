import { FC } from "react";
import DashboardGenericItem from "../dashboard-generic-item";
import styles from "./dashboard-alerts.module.scss";

interface DashboardAlertsProps {
  openAlerts: string;
  openAlertsCount: number | undefined;
  discount: string;
  discountCount: number | undefined;
  creditNotes: string;
  creditNotesCount: number | undefined;
  className?: string;
}

const DashboardAlerts: FC<DashboardAlertsProps> = ({
  openAlerts,
  openAlertsCount,
  discount,
  discountCount,
  creditNotes,
  creditNotesCount,
  className
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.name}>Alertas</div>
      <div className={styles.list}>
        <DashboardGenericItem
          name="Novedades abiertas"
          value={openAlerts}
          unit="M"
          quantity={openAlertsCount}
        />
        <DashboardGenericItem
          name="DPP disponibles"
          value={discount}
          unit="M"
          quantity={discountCount}
        />
        <DashboardGenericItem
          name="NC disponibles"
          value={creditNotes}
          unit="M"
          quantity={creditNotesCount}
        />
      </div>
    </div>
  );
};

export default DashboardAlerts;
