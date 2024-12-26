import React from "react";
import { Flex } from "antd";
import styles from "./nodata.module.scss";
import Image from "next/image";
const NoData: React.FC = () => {
  return (
    <Flex className={styles.noDataContainer}>
      <Image
        src="/images/logistics/coins.png" // Reemplaza con tu ícono o imagen
        alt="No Data Icon"
        width={48}
        height={48}
        className={styles.icon}
      />
      <p className={styles.message}>
        Generar una nueva TRM o<br /> modifica una ya creada
      </p>
    </Flex>
  );
};

export default NoData;
