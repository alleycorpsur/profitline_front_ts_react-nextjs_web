import { FC } from "react";
import { Poppins } from "@next/font/google";
import ReactApexChart from "react-apexcharts";
import styles from "./dashboard-porfolio-ages.module.scss";
import { ApexOptions } from "apexcharts";
const poppins = Poppins({ weight: "400", style: "normal", subsets: ["latin"] });

interface DashboardPortfolioAgesProps {
  className?: string;
}

const DashboardPortfolioAges: FC<DashboardPortfolioAgesProps> = ({ className }) => {
  const series = [
    {
      name: "+120 días",
      data: [16.6]
    },
    {
      name: "120 días",
      data: [16.6]
    },
    {
      name: "90 días",
      data: [16.6]
    },
    {
      name: "60 días",
      data: [16.6]
    },
    {
      name: "30 días",
      data: [16.6]
    },
    {
      name: "Corriente",
      data: [16.6]
    }
  ];

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
        colors: ["#000000"]
      }
    },
    colors: ["#9eae38", "#a3b914", "#b9d121", "#cae234", "#daf04d", "#eafa88"],
    stroke: {
      show: false
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return val + "%";
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
        <ReactApexChart className="" options={options} series={series} type="bar" height={210} />
      </div>

      <div className={styles.legends}>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#eafa88" }}></div>
          Corriente
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#daf04d" }}></div>
          30 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#cae234" }}></div>
          60 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#b9d121" }}></div>
          90 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#a3b914" }}></div>
          120 días
        </div>
        <div className={styles.legend}>
          <div className={styles.circle} style={{ backgroundColor: "#9eae38" }}></div>
          +120 días
        </div>
      </div>
    </div>
  );
};

export default DashboardPortfolioAges;
