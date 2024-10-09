import { FC } from "react";
import DashboardGenericItem from "../dashboard-generic-item";
import styles from "./dashboard-invoice-status.module.scss";

interface DashboardInvoiceStatusProps {
  totalUnreconciled: string;
  totalUnreconciledCount: number | undefined;
  totalReconciled: string;
  totalReconciledCount: number | undefined;
  totalBalance: string;
  totalBalanceCount: number | undefined;
  className?: string;
}

const DashboardInvoiceStatus: FC<DashboardInvoiceStatusProps> = ({
  totalUnreconciled,
  totalUnreconciledCount,
  totalReconciled,
  totalReconciledCount,
  totalBalance,
  totalBalanceCount,
  className
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.name}>Estatus de facturas</div>
      <div className={styles.list}>
        <DashboardGenericItem
          name="Sin conciliar"
          value={totalUnreconciled}
          unit="M"
          quantity={totalUnreconciledCount}
        />
        <DashboardGenericItem
          name="Conciliadas"
          value={totalReconciled}
          unit="M"
          quantity={totalReconciledCount}
        />
        <DashboardGenericItem
          name="Saldos"
          value={totalBalance}
          unit="M"
          quantity={totalBalanceCount}
        />
      </div>
    </div>
  );
};

export default DashboardInvoiceStatus;
