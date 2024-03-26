import useSWR from "swr";

import { fetcher } from "@/utils/api/api";
import { MessageInstance } from "antd/es/message/interface";
import { IHolding } from "@/types/holding/IHolding";
import { addHolding, removeHoldingById } from "@/services/holding/holding";

export const useHolding = () => {
  const { data, isLoading, mutate } = useSWR<IHolding>(`/holding`, fetcher, {});

  const createHolding = async (name: string, messageApi: MessageInstance) => {
    await addHolding({ name: name, messageApi });
    mutate();
  };

  const removeHolding = async (id: string, messageApi: MessageInstance) => {
    await removeHoldingById({ idHolding: id, messageApi });
    mutate();
  };

  return {
    data,
    isLoading,
    createHolding,
    removeHolding
  };
};
