import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { onCreateGroupClient } from "@/services/groupClients/groupClients";
import { MessageInstance } from "antd/es/message/interface";

export const useGroupClients = () => {
  const pathKey = `/group-client`;
  const { data, error, mutate } = useSWR<any>(pathKey, fetcher, {});

  const createGroupClient = async ({
    data,
    messageApi,
    onClose
  }: {
    data: { name: string; clients: string[] };
    messageApi: MessageInstance;
    onClose: () => {};
  }) => {
    onCreateGroupClient(data, messageApi, onClose);
    mutate();
  };

  return {
    data: (data?.data as any[]) || ([] as any[]),
    loading: !error && !data,
    createGroupClient
  };
};
