import { FC } from "react";
import Image from "next/image";
import DashboardGenericItem from "../dashboard-generic-item";

import styles from "./dashboard-total-portfolio.module.scss";

interface DashboardTotalPortfolioProps {
  totalWallet: string;
  className?: string;
}

const DashboardTotalPortfolio: FC<DashboardTotalPortfolioProps> = ({ totalWallet, className }) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <DashboardGenericItem name="Total cartera" value={totalWallet} unit="M" />
      <Image src="/images/graph-1.svg" alt="Graph" className={styles.img} width={48} height={62} />
    </div>
  );
};

export default DashboardTotalPortfolio;
