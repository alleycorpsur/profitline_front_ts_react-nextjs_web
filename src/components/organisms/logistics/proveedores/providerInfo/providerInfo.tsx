import { Flex, Typography, message, Row, Col, Tabs, TabsProps, Spin, Button, Result } from "antd";
import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import { NavRightSection } from "@/components/atoms/NavRightSection/NavRightSection";
import { useRouter } from "next/navigation";
import "../../../../../styles/_variables_logistics.css";
import "./providerInfo.scss";
import { getDriverById, updateDriver } from "@/services/logistics/drivers";
import { ICarrier, IDriver, IFormDriver } from "@/types/logistics/schema";
import { getCarrierById } from "@/services/logistics/carrier";
import { CarrierFormTab } from "@/components/molecules/tabs/logisticsForms/CarrierForm/carrierFormTab";

interface Props {
  isEdit?: boolean;
  idParam: string;
}

const { Title, Text } = Typography;

export const ProviderInfoView = ({ isEdit = false, idParam = "" }: Props) => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [Carrier, setCarrier] = useState<ICarrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [value, setValue] = useState("1");

  const [isEditProject, setIsEditProject] = useState(isEdit);
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [isViewDetailsUser, setIsViewDetailsUser] = useState({
    active: false,
    id: 0
  });

  const onGoBackTableUsers = () => {
    setIsCreateUser(false);
    setIsViewDetailsUser({
      active: false,
      id: 0
    });
  };

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

  const onChange = (key: string) => {
    setValue(key);
  };
  const datasource: ICarrier[] = [];

  const retry = () => {
    setLoading(true);
    setError("");
  };
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
    if (element.active.data[0] === 1) {
      element.status = true;
    } else {
      element.status = false;
    }
    datasource.push(element);
  });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "General",
      children: <></>
    },
    {
      key: "2",
      label: "Vehiculo",
      children: <></>
    },
    {
      key: "3",
      label: "Conductor",
      children: <></>
    }
  ];

  return (
    <>
      {contextHolder}
      <main className="mainCreateOrder">
        <SideBar />
        <Flex vertical className="containerCreateOrder">
          <Flex className="infoHeaderOrder">
            <Flex gap={"2rem"}>
              <Title level={2} className="titleName">
                Proveedores
              </Title>
            </Flex>
            <Flex align="center" justify="space-between">
              <NavRightSection />
            </Flex>
          </Flex>
          {/* ------------Main Info Order-------------- */}
          <Flex className="orderContainer">
            <Row style={{ width: "100%" }}>
              <Col span={24}>
                <Tabs defaultActiveKey={value} items={items} onChange={onChange}></Tabs>
              </Col>
              <>
                {datasource.length === 0 ? (
                  <Flex vertical>
                    <Flex align="center" gap={"2rem"}>
                      <Button href="/logistics/providers/all">Volver</Button>
                      <Text>Informacion No encontrada</Text>
                    </Flex>
                    <Result
                      status="404"
                      title="404"
                      subTitle="Lo siento este conductor no existe"
                      extra={
                        <Button type="primary" href="/logistics/providers/all">
                          Back Home
                        </Button>
                      }
                    />
                  </Flex>
                ) : (
                  <CarrierFormTab
                    onSubmitForm={onUpdateDriver}
                    onEditProject={() => setIsEditProject(true)}
                    data={datasource}
                    statusForm={isEditProject ? "edit" : "review"}
                  ></CarrierFormTab>
                )}
              </>
            </Row>
          </Flex>
        </Flex>
      </main>
    </>
  );
};