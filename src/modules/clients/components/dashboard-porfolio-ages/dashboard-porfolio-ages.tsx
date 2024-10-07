import { FC } from "react";
import { Poppins } from "@next/font/google";
import ReactApexChart from "react-apexcharts";
import { formatMoney } from "@/utils/utils";
import { ApexOptions } from "apexcharts";

import styles from "./dashboard-porfolio-ages.module.scss";
const poppins = Poppins({ weight: "400", style: "normal", subsets: ["latin"] });

interface DashboardPortfolioAgesProps {
  invoiceAges:
    | {
        name: string;
        data: number[];
      }[]
    | undefined;
  className?: string;
}

const DashboardPortfolioAges: FC<DashboardPortfolioAgesProps> = ({ invoiceAges, className }) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: [""],
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        maxWidth: 30,
        offsetX: 10,
        offsetY: -5,
        align: "right",
        style: {
          cssClass: styles.yAxis
        }
      }
    },
    dataLabels: {
      style: {
        fontFamily: poppins.style.fontFamily,
        fontWeight: 400,
        colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#141414", "#141414", "#141414"]
      }
    },
    colors: ["#141414", "#4F4F4F", "#6E7B57", "#86A600", "#A8C600", "#CBE71E"],
    stroke: {
      show: false
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return formatMoney(val);
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    },
    grid: {
      strokeDashArray: 3
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.name}>Edades de la cartera</div>
      <div className={styles.chart}>
        <ReactApexChart
          className=""
          options={options}
          series={invoiceAges}
          type="bar"
          height={210}
        />
      </div>

      <div className={styles.legends}>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#CBE71E" }}></div>
          Actual
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#A8C600" }}></div>
          30 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#86A600" }}></div>
          60 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#6E7B57" }}></div>
          90 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#4F4F4F" }}></div>
          120 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#141414" }}></div>
          +120 días
        </div>
      </div>
    </div>
  );
};

export default DashboardPortfolioAges;
