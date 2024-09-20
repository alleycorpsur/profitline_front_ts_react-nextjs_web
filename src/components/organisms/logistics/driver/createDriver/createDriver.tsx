"use client";
import { message, Skeleton } from "antd";

import { useRouter } from "next/navigation";

import "./createDriver.scss";
import { DriverFormTab } from "@/components/molecules/tabs/logisticsForms/driverForm/driverFormTab";
import { addDriver } from "@/services/logistics/drivers";
import { IFormDriver } from "@/types/logistics/schema";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";
import { useState } from "react";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";
import { getVehicleType } from "@/services/logistics/vehicle";
import useSWR from "swr";

type Props = {
  params: {
    id: string;
    driverId: string;
  };
};

export const CreateDriverView = ({ params }: Props) => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const onCreateDriver = async (data: IFormDriver) => {
    data.general.company_id = params.id;
    try {
      setIsLoadingSubmit(true);
      const response = await addDriver(
        data.general,
        data.logo as any,
        data?.files as DocumentCompleteType[]
      );

      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "El conductor fue creado exitosamente."
        });
        push(`/logistics/providers/${params.id}/driver`);
      }
    } catch (error) {
      if (error instanceof Error) {
        messageApi.open({
          type: "error",
          content: error.message
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Oops, hubo un error por favor intenta mas tarde."
        });
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  const { data: documentsType, isLoading: isLoadingDocuments } = useSWR(
    "2",
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
        <DriverFormTab
          isLoadingSubmit={isLoadingSubmit}
          onSubmitForm={onCreateDriver}
          statusForm={"create"}
          params={params}
          documentsTypesList={documentsType ?? []}
          vehiclesTypesList={vehiclesTypesData?.data ?? []}
          messageApi={messageApi}
        />
      </Skeleton>
    </>
  );
};
