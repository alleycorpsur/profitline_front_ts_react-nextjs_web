"use client";
import { Flex, message, Row, Skeleton } from "antd";

import "../../../../../styles/_variables_logistics.css";

import "./vehicleInfo.scss";
import { VehicleFormTab } from "@/components/molecules/tabs/logisticsForms/vehicleForm/vehicleFormTab";
import { getVehicleById } from "@/services/logistics/vehicle";
import useSWR from "swr";

interface Props {
  isEdit?: boolean;
  idParam: string;
  params: {
    id: string;
    vehicleId: string;
  };
}

export const VehicleInfoView = ({ isEdit = false, idParam = "", params }: Props) => {
  const [_messageApi, contextHolder] = message.useMessage();

  const fetcher = async ({ id, key }: { id: string; key: string }) => {
    return getVehicleById(id);
  };

  const { data, isLoading } = useSWR({ id: idParam, key: "1" }, fetcher);

  return (
    <>
      {contextHolder}
      <Flex className="vehicleFormContainer">
        <Row style={{ width: "100%" }}>
          {!isLoading ? (
            <VehicleFormTab
              statusForm={"review"}
              data={data?.data as any}
              params={params}
            ></VehicleFormTab>
          ) : (
            <Skeleton />
          )}
        </Row>
      </Flex>
    </>
  );
};
