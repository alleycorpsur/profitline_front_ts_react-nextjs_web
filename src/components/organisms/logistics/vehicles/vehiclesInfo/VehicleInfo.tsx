"use client";
import { Flex, message, Row, Skeleton } from "antd";
import "../../../../../styles/_variables_logistics.css";
import "./vehicleInfo.scss";
import { VehicleFormTab } from "@/components/molecules/tabs/logisticsForms/vehicleForm/vehicleFormTab";
import { getVehicleById, getVehicleType, updateVehicle } from "@/services/logistics/vehicle";
import useSWR from "swr";
import { useCallback, useState } from "react";
import { StatusForm } from "@/components/molecules/tabs/logisticsForms/vehicleForm/vehicleFormTab.mapper";
import { useRouter } from "next/navigation";
import { getDocumentsByEntityType } from "@/services/logistics/certificates";

interface Props {
  isEdit?: boolean;
  idParam: string;
  params: {
    id: string;
    vehicleId: string;
  };
}

export const VehicleInfoView = ({ isEdit = false, idParam = "", params }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [statusForm, setStatusForm] = useState<StatusForm>("review");
  const { push } = useRouter();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const fetcher = async ({ id, key }: { id: string; key: string }) => {
    return getVehicleById(id);
  };

  const handleFormState = useCallback((newFormState: StatusForm) => {
    setStatusForm(newFormState);
  }, []);

  const { data, isLoading, isValidating } = useSWR({ id: idParam, key: "1" }, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsLoadingSubmit(true);
      const response = await updateVehicle({ ...data }, data.files, data.images);
      if (response && response.status === 200) {
        messageApi.open({
          type: "success",
          content: `El vehículo fue editado exitosamente.`
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
      <Flex className="vehicleFormContainer">
        <Row style={{ width: "100%" }}>
          <Skeleton
            active
            loading={isLoadingDocuments || isLoadingVehicles || isLoading || isValidating}
          >
            <VehicleFormTab
              statusForm={statusForm}
              handleFormState={handleFormState}
              data={data?.data as any}
              params={params}
              onSubmitForm={handleSubmit}
              documentsTypesList={documentsType ?? []}
              vehiclesTypesList={vehiclesTypesData?.data ?? []}
              isLoadingSubmit={isLoadingSubmit}
            />
          </Skeleton>
        </Row>
      </Flex>
    </>
  );
};
