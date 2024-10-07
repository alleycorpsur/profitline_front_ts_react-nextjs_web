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
import { capitalize, formatMillionNumber, formatMoney } from "@/utils/utils";
import styles from "./dashboard.module.scss";
import dayjs from "dayjs";

const DynamicPortfoliAges = dynamic(() => import("../../components/dashboard-porfolio-ages"), {
  ssr: false
});

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => {
  const { portfolioData } = useContext(ClientDetailsContext);

  // Total Portfolio
  const formattedTotalWallet = formatMillionNumber(portfolioData?.total_wallet);
  const totalWallet = formatMoney(formattedTotalWallet);

  // Expired Portfolio
  const formattedPastDuePortfolio = formatMillionNumber(
    portfolioData?.data_wallet?.past_due_ammount
  );
  const pastDuePortfolio = formatMoney(formattedPastDuePortfolio);
  const expiredPercentage = portfolioData?.percentages?.past_due_percentage || "0";

  // Budget
  const formattedBudget = formatMillionNumber(portfolioData?.data_wallet?.budget_ammount);
  const budget = formatMoney(formattedBudget);

  // Portfolio Ages
  const invoiceAges = portfolioData?.invoice_ages
    ?.map((item) => ({
      name: item.days_range,
      data: [item.total]
    }))
    .reverse();

  // Invoice Status
  const formattedTotalUnreconciled = formatMillionNumber(
    portfolioData?.info_invioce?.total_invoice_unreconciled?.total_value
  );
  const totalUnreconciled = formatMoney(formattedTotalUnreconciled);
  const totalUnreconciledCount = portfolioData?.info_invioce?.total_invoice_unreconciled?.count;

  const formattedTotalReconciled = formatMillionNumber(
    portfolioData?.info_invioce?.total_invoice_reconciled?.total_value
  );
  const totalReconciled = formatMoney(formattedTotalReconciled);
  const totalReconciledCount = portfolioData?.info_invioce?.total_invoice_reconciled?.count;

  const formattedTotalBalance = formatMillionNumber(
    portfolioData?.info_invioce?.total_balances?.total_value
  );
  const totalBalance = formatMoney(formattedTotalBalance);
  const totalBalanceCount = portfolioData?.info_invioce?.total_balances?.count;

  // Alerts
  const formattedOpenAlerts = formatMillionNumber(
    portfolioData?.invoice_alerts?.accounting_updates?.total_value
  );
  const openAlerts = formatMoney(formattedOpenAlerts);
  const openAlertsCount = portfolioData?.invoice_alerts?.accounting_updates?.count;
  const formattedDiscounts = formatMillionNumber(
    portfolioData?.invoice_alerts?.financial_discounts?.discount.total_value
  );
  const discount = formatMoney(formattedDiscounts);
  const discountCount = portfolioData?.invoice_alerts?.financial_discounts?.discount.count;
  const formattedCreditNotes = formatMillionNumber(
    portfolioData?.invoice_alerts?.financial_discounts?.creditNote.total_value
  );
  const creditNotes = formatMoney(formattedCreditNotes);
  const creditNotesCount = portfolioData?.invoice_alerts?.financial_discounts?.creditNote.count;

  // Sells vs Payments
  const uniqueItemsMap = new Map();

  portfolioData?.payments_vs_invoices?.forEach((item) => {
    const name = capitalize(dayjs(item.month).utc().locale("es").format("MMM YY"));
    uniqueItemsMap.set(name, item);
  });

  const sellsVsPaymentsData = Array.from(uniqueItemsMap?.values())?.map((item) => {
    return {
      name: capitalize(dayjs(item.month).utc().locale("es").format("MMM YY")),
      ventas: item.sales,
      pagos: item.payments
    };
  });

  // Historic DSO
  const history_dso = portfolioData?.payments_vs_invoices?.map((month) => ({
    dso: month.dso,
    date: month.month
  }));

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

export default Dashboard;
