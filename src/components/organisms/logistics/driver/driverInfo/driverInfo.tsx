"use client";
import { Flex, Typography, message, Button, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../../../../../styles/_variables_logistics.css";
import "./driverInfo.scss";
import { DriverFormTab } from "@/components/molecules/tabs/logisticsForms/driverForm/driverFormTab";
import { getDriverById, updateDriver } from "@/services/logistics/drivers";
import { IDriver, IFormDriver } from "@/types/logistics/schema";
import Link from "next/link";

interface Props {
  isEdit?: boolean;
  params: {
    id: string;
    driverId: string;
  };
}

const { Text } = Typography;

export const DriverInfoView = ({ isEdit = false, params }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditProject, setIsEditProject] = useState(isEdit);

  const onUpdateDriver = async (finalData: IFormDriver) => {
    try {
      const response = await updateDriver(finalData.general);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "El proyecto fue editado exitosamente."
        });
      }
      setIsEditProject(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Oops, hubo un error por favor intenta mas tarde."
      });
    }
  };
  const datasource: IDriver[] = [];
  const loadDriver = async () => {
    const result = await getDriverById(params.driverId);
    const listDrivers: any[] | ((prevState: IDriver[]) => IDriver[]) = [];
    result.data.data.forEach((item, index) => {
      listDrivers.push(item);
    });
    return listDrivers;
  };

  useEffect(() => {
    loadDriver()
      .then((result) => {
        setLoading(false);
        setDrivers(result);
      })
      .catch((error) => setError(error));
  }, [error]);

  drivers.forEach((element) => {
    if (element.active) {
      element.status = true;
    } else {
      element.status = false;
    }
    datasource.push(element);
  });

  return (
    <>
      {contextHolder}
      <>
      {datasource.length === 0 ? (
          <Spin/>
        ) : (
          <DriverFormTab
            onSubmitForm={onUpdateDriver}
            onEditProject={() => setIsEditProject(true)}
            data={datasource}
            statusForm={isEditProject ? "edit" : "review"}
            params={params}
          />
        )}
      </>
    </>
  );
};
