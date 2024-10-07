import { FC } from "react";
import dynamic from "next/dynamic";

import DashboardTotalPortfolio from "@/modules/clients/components/dashboard-total-portfolio";
import DashboardExpiredPortfolio from "@/modules/clients/components/dashboard-expired-portfolio";
import DashboardBudget from "@/modules/clients/components/dashboard-budget";
import DashboardInvoiceStatus from "@/modules/clients/components/dashboard-invoice-status";
import DashboardAlerts from "@/modules/clients/components/dashboard-alerts";
import DashboardGenericItem from "@/modules/clients/components/dashboard-generic-item";
import DashboardSellsVsPayments from "@/modules/clients/components/dashboard-sells-vs-payments";
import DashboardHistoricDso from "@/modules/clients/components/dashboard-historic-dso";

import styles from "./generalDashboard.module.scss";

const DynamicPortfoliAges = dynamic(
  () => import("../../../../modules/clients/components/dashboard-porfolio-ages"),
  {
    ssr: false
  }
);

interface GeneralDashboardViewProps {}

const GeneralDashboard: FC<GeneralDashboardViewProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.a}>
        <DashboardTotalPortfolio className={styles.item} totalWallet="0" />
        <DashboardExpiredPortfolio
          className={styles.item}
          expiredPercentage="0"
          pastDuePortfolio="0"
        />
        <DashboardBudget className={styles.item} budget="0" />
        <DynamicPortfoliAges className={styles.item} invoiceAges={undefined} />
        <DashboardInvoiceStatus
          className={styles.item}
          totalBalance=""
          totalBalanceCount={0}
          totalReconciled=""
          totalReconciledCount={0}
          totalUnreconciled=""
          totalUnreconciledCount={0}
        />
        <DashboardAlerts
          className={styles.item}
          creditNotes=""
          creditNotesCount={0}
          discount=""
          discountCount={0}
          openAlerts=""
          openAlertsCount={0}
        />
      </div>
      <div className={styles.b}>
        <div className={styles.item}>
          <div className={styles.list}>
            <DashboardGenericItem name="R. aplicado" value={""} unit="M" badgeText={""} />
            <DashboardGenericItem name="Pagos no ap." value={""} unit="M" badgeText={""} />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.list}>
            <DashboardGenericItem
              name="Cupo"
              value={""}
              unit="M"
              badgeText={`${parseFloat("0").toFixed(1)}%`}
            />
          </div>
        </div>
        <div className={styles.dso}>
          <div className={styles.label}>DSO</div>
          <div className={styles.value}>{""}</div>
        </div>
      </div>
      <div className={styles.c}>
        <DashboardSellsVsPayments className={styles.item} chartData={[]} />
        <DashboardHistoricDso className={styles.item} history_dso={undefined} />
      </div>
    </div>
  );
};

export default GeneralDashboard;
