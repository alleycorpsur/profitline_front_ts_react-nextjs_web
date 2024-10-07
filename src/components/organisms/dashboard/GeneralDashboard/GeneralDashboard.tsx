import { FC, useContext } from "react";
import dynamic from "next/dynamic";

import { formatMillionNumber, formatMoney } from "@/utils/utils";

import DashboardTotalPortfolio from "@/modules/clients/components/dashboard-total-portfolio";
import DashboardExpiredPortfolio from "@/modules/clients/components/dashboard-expired-portfolio";
import DashboardBudget from "@/modules/clients/components/dashboard-budget";
import DashboardInvoiceStatus from "@/modules/clients/components/dashboard-invoice-status";
import DashboardAlerts from "@/modules/clients/components/dashboard-alerts";
import DashboardGenericItem from "@/modules/clients/components/dashboard-generic-item";
import DashboardSellsVsPayments from "@/modules/clients/components/dashboard-sells-vs-payments";
import DashboardHistoricDso from "@/modules/clients/components/dashboard-historic-dso";
import { ClientDetailsContext } from "@/modules/clients/containers/client-details/client-details";

import styles from "./generalDashboard.module.scss";

const DynamicPortfoliAges = dynamic(
  () => import("../../../../modules/clients/components/dashboard-porfolio-ages"),
  {
    ssr: false
  }
);

interface GeneralDashboardViewProps {}

const GeneralDashboard: FC<GeneralDashboardViewProps> = () => {
  const { portfolioData } = useContext(ClientDetailsContext);

  const formattedAppliedPayments = formatMillionNumber(
    portfolioData?.data_wallet?.applied_payments_ammount
  );
  const appliedPayments = formatMoney(formattedAppliedPayments);
  const appliedPaymentPercentage = portfolioData?.percentages?.applied_payments_percentage;

  const formattedUnappliedPayments = formatMillionNumber(
    portfolioData?.data_wallet?.unapplied_payments_ammount
  );
  const unappliedPayments = formatMoney(formattedUnappliedPayments);
  const unnappliedPaymentPercentage = portfolioData?.percentages?.unapplied_payments_percentage;

  const dsoValue = portfolioData?.dso;

  const formattedQuota = formatMillionNumber(portfolioData?.quota);
  const quota = formatMoney(formattedQuota);
  const quotaPercentage = portfolioData?.percentages?.quota_percentage || "0";

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
            <DashboardGenericItem
              name="R. aplicado"
              value={appliedPayments}
              unit="M"
              badgeText={
                appliedPaymentPercentage && appliedPaymentPercentage > 0
                  ? `${appliedPaymentPercentage.toFixed(1)}%`
                  : ""
              }
            />
            <DashboardGenericItem
              name="Pagos no ap."
              value={unappliedPayments}
              unit="M"
              badgeText={
                unnappliedPaymentPercentage && parseInt(unnappliedPaymentPercentage) > 0
                  ? `${parseFloat(unnappliedPaymentPercentage).toFixed(1)}%`
                  : ""
              }
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.list}>
            <DashboardGenericItem
              name="Cupo"
              value={quota}
              unit="M"
              badgeText={`${parseFloat(quotaPercentage).toFixed(1)}%`}
            />
          </div>
        </div>
        <div className={styles.dso}>
          <div className={styles.label}>DSO</div>
          <div className={styles.value}>{dsoValue}</div>
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
