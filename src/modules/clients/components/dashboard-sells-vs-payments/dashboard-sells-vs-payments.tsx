import { FC, useContext } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart
} from "recharts";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";

import { ClientDetailsContext } from "../../containers/client-details/client-details";
import { capitalize, formatMillionNumber, formatMoney } from "@/utils/utils";

import styles from "./dashboard-sells-vs-payments.module.scss";

interface DashboardSellsVsPaymentsProps {
  className?: string;
}

dayjs.extend(utcPlugin);

const DashboardSellsVsPayments: FC<DashboardSellsVsPaymentsProps> = ({ className }) => {
  const { portfolioData } = useContext(ClientDetailsContext);

  const uniqueItemsMap = new Map();

  portfolioData?.payments_vs_invoices?.forEach((item) => {
    const name = capitalize(dayjs(item.month).utc().locale("es").format("MMM YY"));
    uniqueItemsMap.set(name, item);
  });

  const data = Array.from(uniqueItemsMap?.values())?.map((item) => {
    return {
      name: capitalize(dayjs(item.month).utc().locale("es").format("MMM YY")),
      ventas: item.sales,
      pagos: item.payments
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p>{label}</p>
          {payload.map((item: any) => (
            <p key={item.dataKey} style={{ color: item.color }}>
              {capitalize(item.name)}: {formatMoney(item.value, true)}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.name}>
        Histórico ventas vs pagos
        <div className={styles.legends}>
          <div className={styles.legend}>
            <div className={styles.circle} style={{ backgroundColor: "#0085FF" }}></div>
            Facturación
          </div>
          <div className={styles.legend}>
            <div className={styles.circle} style={{ backgroundColor: "#CBE71E" }}></div>
            Pagos
          </div>
        </div>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer>
          <LineChart margin={{ right: 15, left: 0 }} barCategoryGap={10} data={data} barSize={20}>
            <XAxis padding={{ left: 20, right: 20 }} dataKey="name" scale="point" />
            <YAxis
              padding={{ top: 10 }}
              tickFormatter={(value) => formatMoney(formatMillionNumber(value), true) + "M"}
            />
            <Tooltip content={<CustomTooltip />} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="ventas" stroke="#0085FF" strokeWidth={4} />
            <Line type="monotone" dataKey="pagos" stroke="#CBE71E" strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSellsVsPayments;
