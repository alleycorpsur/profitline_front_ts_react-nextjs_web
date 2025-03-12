import { FC, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./dashboard-historic-dso.module.scss";
import dayjs from "dayjs";

interface DashboardHistoricDsoProps {
  history_dso: historic_dso[] | undefined;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  yAxisLabelFormatter?: (value: number) => string;
}

type history_chart = {
  name: string;
  month: number;
  value: number;
};

type historic_dso = {
  dso: number;
  date: string;
};

const DashboardHistoricDso: FC<DashboardHistoricDsoProps> = ({
  history_dso,
  className,
  yAxisLabelFormatter
}) => {
  const [data, setData] = useState([] as history_chart[]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
  ];

  useEffect(() => {
    // Initialize the data array with default values
    const initialData: history_chart[] = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      initialData.push({
        name: monthNames[monthIndex],
        month: monthIndex + 1,
        value: 0
      });
    }

    // Assign actual DSO values from the dataset
    if (history_dso) {
      history_dso.forEach((item: historic_dso) => {
        const itemDate = dayjs(item.date).utc();
        const itemMonth = itemDate.month(); // Get month index from date string
        const foundIndex = initialData.findIndex((data) => data.month === itemMonth + 1);
        if (foundIndex !== -1) {
          initialData[foundIndex].value = item.dso;
        }
      });
    }

    // delete the months six months before the current month
    initialData.splice(0, 6);

    setData(initialData);
  }, [history_dso]);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.name}>
        DSO histórico
        <div className={styles.legends}>
          <div className={styles.legend}>
            <div className={styles.circle} style={{ backgroundColor: "#CBE71E" }}></div>
            Días
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart margin={{ right: 0, left: -3 }} barCategoryGap={10} data={data} barSize={20}>
            <XAxis padding={{ left: 20, right: 20 }} dataKey="name" scale="point" color="#CBE71E" />
            <YAxis tickFormatter={yAxisLabelFormatter} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <Bar dataKey="value" fill="#CBE71E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHistoricDso;
