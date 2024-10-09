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
import { IDataSection } from "@/types/portfolios/IPortfolios";

import { useDashboardInfo } from "@/components/hooks/useDashboardInfo";

const DynamicPortfoliAges = dynamic(
  () => import("../../../../modules/clients/components/dashboard-porfolio-ages"),
  {
    ssr: false
  }
);

interface GeneralDashboardViewProps {
  portfolioData: {
    loading: boolean;
    data: IDataSection | undefined;
  };
}

const GeneralDashboard: FC<GeneralDashboardViewProps> = ({ portfolioData }) => {
  const {
    totalWallet,
    pastDuePortfolio,
    expiredPercentage,
    budget,
    invoiceAges,
    totalUnreconciled,
    totalUnreconciledCount,
    totalReconciled,
    totalReconciledCount,
    totalBalance,
    totalBalanceCount,
    openAlerts,
    openAlertsCount,
    discount,
    discountCount,
    creditNotes,
    creditNotesCount,
    appliedPayments,
    appliedPaymentPercentage,
    unappliedPayments,
    unnappliedPaymentPercentage,
    quota,
    quotaPercentage,
    dsoValue,
    sellsVsPaymentsData,
    history_dso
  } = useDashboardInfo(portfolioData.data);

  return (
    <div className={styles.wrapper}>
      <div className={styles.a}>
        <DashboardTotalPortfolio className={styles.item} totalWallet={totalWallet} />
        <DashboardExpiredPortfolio
          className={styles.item}
          pastDuePortfolio={pastDuePortfolio}
          expiredPercentage={expiredPercentage}
        />
        <DashboardBudget className={styles.item} budget={budget} />
        <DynamicPortfoliAges className={styles.item} invoiceAges={invoiceAges} />
        <DashboardInvoiceStatus
          className={styles.item}
          totalUnreconciled={totalUnreconciled}
          totalUnreconciledCount={totalUnreconciledCount}
          totalReconciled={totalReconciled}
          totalReconciledCount={totalReconciledCount}
          totalBalance={totalBalance}
          totalBalanceCount={totalBalanceCount}
        />
        <DashboardAlerts
          className={styles.item}
          openAlerts={openAlerts}
          openAlertsCount={openAlertsCount}
          discount={discount}
          discountCount={discountCount}
          creditNotes={creditNotes}
          creditNotesCount={creditNotesCount}
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
        <DashboardSellsVsPayments className={styles.item} chartData={sellsVsPaymentsData} />
        <DashboardHistoricDso className={styles.item} history_dso={history_dso} />
      </div>
    </div>
  );
};

export default GeneralDashboard;
