import { FC, useContext } from "react";
import dynamic from "next/dynamic";
import DashboardTotalPortfolio from "../../components/dashboard-total-portfolio";
import DashboardExpiredPortfolio from "../../components/dashboard-expired-portfolio";
import DashboardBudget from "../../components/dashboard-budget";
import DashboardInvoiceStatus from "../../components/dashboard-invoice-status";
import DashboardAlerts from "../../components/dashboard-alerts";
import DashboardGenericItem from "../../components/dashboard-generic-item";
import DashboardSellsVsPayments from "../../components/dashboard-sells-vs-payments";
import DashboardHistoricDso from "../../components/dashboard-historic-dso";
import { ClientDetailsContext } from "../client-details/client-details";
import { formatMoney } from "@/utils/utils";
import styles from "./dashboard.module.scss";

const DynamicPortfoliAges = dynamic(() => import("../../components/dashboard-porfolio-ages"), {
  ssr: false
});

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const { portfolioData } = useContext(ClientDetailsContext);

  const appliedPayments = formatMoney(portfolioData?.data_wallet?.applied_payments_ammount);
  const unappliedPayments = formatMoney(portfolioData?.data_wallet?.unapplied_payments_ammount);
  const dsoValue = portfolioData?.dso;

  return (
    <div className={styles.wrapper}>
      <div className={styles.a}>
        <DashboardTotalPortfolio className={styles.item} />
        <DashboardExpiredPortfolio className={styles.item} />
        <DashboardBudget className={styles.item} />
        <DynamicPortfoliAges className={styles.item} />
        <DashboardInvoiceStatus className={styles.item} />
        <DashboardAlerts className={styles.item} />
      </div>
      <div className={styles.b}>
        <div className={styles.item}>
          <div className={styles.list}>
            <DashboardGenericItem
              name="R. aplicado"
              value={appliedPayments}
              unit="M"
              badgeText="12%"
            />
            <DashboardGenericItem
              name="Pagos no ap."
              value={unappliedPayments}
              unit="M"
              badgeText="12%"
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.list}>
            <DashboardGenericItem name="Cupo" value="$54.950" unit="M" badgeText="12%" />
          </div>
        </div>
        <div className={styles.dso}>
          <div className={styles.label}>DSO</div>
          <div className={styles.value}>{dsoValue}</div>
        </div>
      </div>
      <div className={styles.c}>
        <DashboardSellsVsPayments className={styles.item} />
        <DashboardHistoricDso className={styles.item} />
      </div>
    </div>
  );
};

export default Dashboard;
