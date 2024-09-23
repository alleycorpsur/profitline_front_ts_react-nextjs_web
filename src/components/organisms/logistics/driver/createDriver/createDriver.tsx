"use client";
import { message } from "antd";

import { useRouter } from "next/navigation";

import "./createDriver.scss";
import { DriverFormTab } from "@/components/molecules/tabs/logisticsForms/driverForm/driverFormTab";
import { addDriver } from "@/services/logistics/drivers";
import { IFormDriver } from "@/types/logistics/schema";
import { DocumentCompleteType } from "@/types/logistics/certificate/certificate";

type Props = {
  params: {
    id: string;
    driverId: string;
  };
};

export const CreateDriverView = ({ params }: Props) => {
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onCreateDriver = async (data: IFormDriver) => {
    data.general.company_id = params.id;
    try {
      const response = await addDriver(
        data.general,
        data.logo as any,
        data?.files as DocumentCompleteType[]
      );

      if (response.status === 200) {
        messageApi
          .open({
            type: "success",
            content: "El conductor fue creado exitosamente.",
            duration: 2
          })
          .then(() => {
            push(`/logistics/providers/${params.id}/driver`);
          });
      }
    } catch (error) {
      if (error instanceof Error) {
        messageApi.open({
          type: "error",
          content: error.message,
          duration: 3
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Oops, hubo un error por favor intenta mas tarde.",
          duration: 3
        });
      }
    }
  };

  return (
    <>
      {contextHolder}
      <DriverFormTab onSubmitForm={onCreateDriver} statusForm={"create"} params={params} />
    </>
  );
};
