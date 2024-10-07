import { FC } from "react";
import Image from "next/image";
import styles from "./dashboard-expired-portfolio.module.scss";
import DashboardGenericItem from "../dashboard-generic-item";

interface DashboardExpiredPortfolioProps {
  pastDuePortfolio: string;
  expiredPercentage: string;
  className?: string;
}

const DashboardExpiredPortfolio: FC<DashboardExpiredPortfolioProps> = ({
  pastDuePortfolio,
  expiredPercentage,
  className
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <DashboardGenericItem
        name="C. vencida"
        badgeText={`${parseFloat(expiredPercentage).toFixed(1)}%`}
        value={pastDuePortfolio}
        unit="M"
      />
      <Image src="/images/graph-2.svg" alt="Graph" className={styles.img} width={78} height={48} />
    </div>
  );
};

export default DashboardExpiredPortfolio;
