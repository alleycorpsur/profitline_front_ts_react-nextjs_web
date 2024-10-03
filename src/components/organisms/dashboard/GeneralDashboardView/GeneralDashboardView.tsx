import { FC } from "react";

import styles from "./generalDashboardView.module.scss";
import GeneralDashboard from "../GeneralDashboard/GeneralDashboard";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";

interface GeneralDashboardViewProps {}

const GeneralDashboardView: FC<GeneralDashboardViewProps> = () => {
  return (
    <div className={styles.generalDashboardView}>
      <FilterDiscounts />
      <GeneralDashboard />
    </div>
  );
};

export default GeneralDashboardView;
