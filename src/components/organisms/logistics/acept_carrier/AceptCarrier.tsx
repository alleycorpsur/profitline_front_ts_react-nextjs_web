"use client";
import { Flex, message } from "antd";
import UiSearchInput from "@/components/ui/search-input/search-input";
import AceptCarrierView from "./view/AceptCarrierView/AceptCarrierView";
import styles from "./AceptCarrier.module.scss";
import { getAceptCarrierRequestList } from "@/services/logistics/acept_carrier";
import { useEffect, useState } from "react";
import { FilterProjects } from "@/components/atoms/Filters/FilterProjects/FilterProjects";

export default function AceptCarrier() {
  const [carriers, setCarriers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectFilters, setSelectFilters] = useState({
    country: [] as string[],
    currency: [] as string[]
  });

  useEffect(() => {
    loadCarrierRequestTransferList();
  }, []);

  const loadCarrierRequestTransferList = async () => {
    setLoading(true);
    try {
      const data = await getAceptCarrierRequestList();
      setCarriers(data);
    } catch (error) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Error al obtener la lista de solicitudes de carga");
      console.error("Error loading transfer requests", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Flex className={styles.filters} gap={8} style={{ marginBottom: "0.5rem" }}>
        <UiSearchInput
          placeholder="Buscar"
          onChange={(event) => {
            setTimeout(() => {
              console.info(event.target.value);
            }, 1000);
          }}
        />
        <FilterProjects setSelecetedProjects={setSelectFilters} height="48" />
      </Flex>
      <AceptCarrierView carriers={carriers} loading={loading} />
    </div>
  );
}