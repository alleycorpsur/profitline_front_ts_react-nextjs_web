"use client";
import { FC, useState } from "react";
import { CaretLeft } from "phosphor-react";
import UiFilterDropdown from "@/components/ui/ui-filter-dropdown";
import styles from "./client-details.module.scss";
import UiTabs from "@/components/ui/ui-tabs";

interface CreateOrderProps {}

const CreateOrders: FC<CreateOrderProps> = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerHeader}>
        <div className={styles.back}>
          <CaretLeft className={styles.icon} />
          Logistics
        </div>
        <UiFilterDropdown />
      </div>
      <UiTabs
        tabs={[
          "Cartera",
          "Ajustes contables",
          "Pagos",
          "Novedades",
          "Aplicación",
          "Contactos",
          "Historial"
        ]}
        className={styles.tabs}
        onTabClick={setSelectedTab}
      />
    </div>
  );
};

export default CreateOrders;
