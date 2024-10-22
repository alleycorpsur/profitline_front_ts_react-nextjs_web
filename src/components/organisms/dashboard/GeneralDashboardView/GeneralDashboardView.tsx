import { FC, useEffect, useState } from "react";

import { useAppStore } from "@/lib/store/store";
import GeneralDashboard from "../GeneralDashboard/GeneralDashboard";
import FilterDiscounts from "@/components/atoms/Filters/FilterDiscounts/FilterDiscounts";

import styles from "./generalDashboardView.module.scss";
import { getProjectPortfolio } from "@/services/portfolios/portfolios";
import { IDataSection } from "@/types/portfolios/IPortfolios";
import { Spin } from "antd";

interface GeneralDashboardViewProps {}

const GeneralDashboardView: FC<GeneralDashboardViewProps> = () => {
  const [portfolioData, setPortfolioData] = useState<{
    loading: boolean;
    data: IDataSection | undefined;
  }>({
    loading: false,
    data: undefined
  });
  const { ID: projectId } = useAppStore((state) => state.selectedProject);

  const fetchProjectPortfolio = async () => {
    setPortfolioData({ loading: true, data: undefined });
    // Call the API to get the data
    try {
      const response: IDataSection = await getProjectPortfolio(projectId);
      setPortfolioData({ loading: false, data: response });
    } catch (error) {
      console.warn("error getting project portfolio", error);
      setPortfolioData({ loading: false, data: undefined });
    }
  };

  useEffect(() => {
    fetchProjectPortfolio();
  }, [projectId]);

  return (
    <div className={styles.generalDashboardView}>
      {portfolioData.loading ? (
        <Spin size="large" style={{ margin: "70px auto" }} />
      ) : (
        <>
          <div>
            <FilterDiscounts />
          </div>

          <GeneralDashboard portfolioData={portfolioData} />
        </>
      )}
    </div>
  );
};

export default GeneralDashboardView;
