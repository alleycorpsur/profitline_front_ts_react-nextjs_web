"use client";
import { message, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import "../../../../../styles/_variables_logistics.css";
import "./createVehicle.scss";
import { VehicleFormTab } from "@/components/molecules/tabs/logisticsForms/vehicleForm/vehicleFormTab";
import { addVehicle, getVehicleType } from "@/services/logistics/vehicle";
import { useState } from "react";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";
import useSWR from "swr";

type Props = {
  params: {
    id: string;
    vehicleId: string;
  };
};

export const CreateVehicleView = ({ params }: Props) => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoadingSubmit(true);
      const response = await addVehicle({ ...data }, data.files, data.images);
      if (response && response.status === 200) {
        messageApi.open({
          type: "success",
          content: `El vehículo fue creado exitosamente.`
        });
        push(`/logistics/providers/${params.id}/vehicle`);
      }
    } catch (error) {
      if (error instanceof Error) {
        messageApi.open({
          type: "error",
          content: error.message
        });
      } else {
        message.open({
          type: "error",
          content: "Oops, hubo un error por favor intenta más tarde."
        });
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  const { data: documentsType, isLoading: isLoadingDocuments } = useSWR(
    "1",
    getDocumentsByEntityType,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }
  );
  const { data: vehiclesTypesData, isLoading: isLoadingVehicles } = useSWR(
    "/vehicle/type",
    getVehicleType,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <>
      {contextHolder}
      <Skeleton active loading={isLoadingDocuments || isLoadingVehicles}>
        <VehicleFormTab
          onSubmitForm={handleSubmit}
          statusForm={"create"}
          params={params}
          documentsTypesList={documentsType ?? []}
          vehiclesTypesList={vehiclesTypesData?.data ?? []}
          isLoadingSubmit={isLoadingSubmit}
        />
      </Skeleton>
    </>
  );
};
