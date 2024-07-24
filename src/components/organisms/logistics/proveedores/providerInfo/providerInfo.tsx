import { Flex, Typography, message, Row, Button, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import "../../../../../styles/_variables_logistics.css";
import "./providerInfo.scss";
import { updateDriver } from "@/services/logistics/drivers";
import { ICarrier, IFormDriver } from "@/types/logistics/schema";
import { getCarrierById } from "@/services/logistics/carrier";
import { CarrierFormTab } from "@/components/molecules/tabs/logisticsForms/CarrierForm/carrierFormTab";

interface Props {
  isEdit?: boolean;
  idParam: string;
}

const { Text } = Typography;

export const ProviderInfoView = ({ isEdit = false, idParam = "" }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [Carrier, setCarrier] = useState<ICarrier[]>([]);
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

  const datasource: ICarrier[] = [];

  const loadCarrier = async () => {
    const result = await getCarrierById(idParam);
    const listCarriers: any[] | ((prevState: ICarrier[]) => ICarrier[]) = [];
    result.data.data.forEach((item, index) => {
      listCarriers.push(item);
    });
    return listCarriers;
  };

  useEffect(() => {
    loadCarrier()
      .then((result) => {
        setLoading(false);
        setCarrier(result);
      })
      .catch((error) => setError(error));
  }, [error]);

  Carrier.forEach((element) => {
    if (element.active) {
      element.status = true;
    } else {
      element.status = false;
    }
    datasource.push(element);
  });

  if (idParam === "") return (<></>)
  return (
    <>
      {contextHolder}
      <Flex className="generalTabMainContent">
          {datasource.length === 0 ? (
              <Spin/>
          ) : (
        <Row style={{ width: "100%" }}>
            <CarrierFormTab
              onSubmitForm={onUpdateDriver}
              onEditProject={() => setIsEditProject(true)}
              data={datasource}
              statusForm={isEditProject ? "edit" : "review"}
            />
        </Row>
          )}
      </Flex>
    </>
  );
};
